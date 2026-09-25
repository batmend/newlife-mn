-- Шинэ Амь member portal, phase 2: daily word, reading log, reflections, morning email.
-- "Today" is always the Ulaanbaatar calendar day.

create function public.today_ub()
returns date
language sql
stable
set search_path = ''
as $$
  select (now() at time zone 'Asia/Ulaanbaatar')::date;
$$;

create function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Daily words ---------------------------------------------------------------

create table public.daily_words (
  id uuid primary key default gen_random_uuid(),
  publish_date date not null unique,
  title text not null check (char_length(btrim(title)) between 1 and 160),
  scripture_ref text not null check (char_length(btrim(scripture_ref)) between 1 and 120),
  scripture_text text not null default '' check (char_length(scripture_text) <= 4000),
  body text not null check (char_length(btrim(body)) between 1 and 20000),
  author_id uuid default auth.uid() references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger daily_words_touch_updated_at
  before update on public.daily_words
  for each row execute function public.touch_updated_at();

-- Moving a word members have already read to another day would hide their
-- reflections from them; and a re-dated word should be emailed on its new day.
create function public.guard_word_date_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.publish_date is distinct from old.publish_date then
    if exists (select 1 from public.devotion_reads where word_id = old.id)
       or exists (select 1 from public.reflections where word_id = old.id) then
      raise exception 'Гишүүд уншсан эсвэл бодлоо үлдээсэн үгийн огноог өөрчлөх боломжгүй. Агуулгыг нь засаж болно.';
    end if;
    delete from public.daily_word_emails where word_id = old.id;
  end if;
  return new;
end;
$$;

alter table public.daily_words enable row level security;

create policy "Members read published words"
  on public.daily_words for select to authenticated
  using ((select public.my_role()) >= 'member' and publish_date <= (select public.today_ub()));

create policy "Leaders read every word"
  on public.daily_words for select to authenticated
  using ((select public.my_role()) >= 'leader');

create policy "Leaders add words"
  on public.daily_words for insert to authenticated
  with check ((select public.my_role()) >= 'leader');

create policy "Leaders edit words"
  on public.daily_words for update to authenticated
  using ((select public.my_role()) >= 'leader')
  with check ((select public.my_role()) >= 'leader');

create policy "Leaders delete words"
  on public.daily_words for delete to authenticated
  using ((select public.my_role()) >= 'leader');

revoke all on public.daily_words from anon, authenticated;
grant select, delete on public.daily_words to authenticated;
grant insert (publish_date, title, scripture_ref, scripture_text, body) on public.daily_words to authenticated;
grant update (publish_date, title, scripture_ref, scripture_text, body) on public.daily_words to authenticated;
grant all on public.daily_words to service_role;

-- Reading log (quiet time) --------------------------------------------------
-- Words that members have read or reflected on cannot be deleted (restrict),
-- so a leader can never wipe members' history by removing a word.

create table public.devotion_reads (
  member_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  word_id uuid not null references public.daily_words (id) on delete restrict,
  read_at timestamptz not null default now(),
  primary key (member_id, word_id)
);

create index devotion_reads_word_id_idx on public.devotion_reads (word_id);

alter table public.devotion_reads enable row level security;

create policy "Own, mentees' and (for leaders) all reading"
  on public.devotion_reads for select to authenticated
  using (
    member_id = (select auth.uid())
    or (select public.my_role()) >= 'leader'
    or public.is_my_mentee(member_id)
  );

create policy "Members log their own reading of published words"
  on public.devotion_reads for insert to authenticated
  with check (
    member_id = (select auth.uid())
    and (select public.my_role()) >= 'member'
    and exists (
      select 1 from public.daily_words w
      where w.id = word_id and w.publish_date <= (select public.today_ub())
    )
  );

revoke all on public.devotion_reads from anon, authenticated;
grant select on public.devotion_reads to authenticated;
grant insert (word_id) on public.devotion_reads to authenticated;
grant all on public.devotion_reads to service_role;

-- Reflections ---------------------------------------------------------------

create type public.reflection_visibility as enum ('members', 'leaders');

create table public.reflections (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  word_id uuid not null references public.daily_words (id) on delete restrict,
  body text not null check (char_length(btrim(body)) between 1 and 5000),
  visibility public.reflection_visibility not null default 'leaders',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (member_id, word_id)
);

create index reflections_word_id_idx on public.reflections (word_id);

create trigger reflections_touch_updated_at
  before update on public.reflections
  for each row execute function public.touch_updated_at();

alter table public.reflections enable row level security;

-- Members can't read other profiles, so policies ask this whether an author is still approved.
create function public.is_approved(p_profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.profiles where id = p_profile_id and role >= 'member');
$$;

-- 'members': every approved member; 'leaders': the author's mentor, leaders, admins.
-- Shared reflections disappear from others' view once their author is no longer approved.
create policy "Reflections visible per the author's choice"
  on public.reflections for select to authenticated
  using (
    member_id = (select auth.uid())
    or (select public.my_role()) >= 'leader'
    or (
      visibility = 'members'
      and (select public.my_role()) >= 'member'
      and public.is_approved(member_id)
    )
    or public.is_my_mentee(member_id)
  );

create policy "Members write their own reflection on published words"
  on public.reflections for insert to authenticated
  with check (
    member_id = (select auth.uid())
    and (select public.my_role()) >= 'member'
    and exists (
      select 1 from public.daily_words w
      where w.id = word_id and w.publish_date <= (select public.today_ub())
    )
  );

create policy "Approved members edit their own reflection"
  on public.reflections for update to authenticated
  using (member_id = (select auth.uid()) and (select public.my_role()) >= 'member')
  with check (member_id = (select auth.uid()) and (select public.my_role()) >= 'member');

-- Authors can always remove their own words, even after losing access.
create policy "Members delete their own reflection"
  on public.reflections for delete to authenticated
  using (member_id = (select auth.uid()));

create policy "Leaders remove any reflection"
  on public.reflections for delete to authenticated
  using ((select public.my_role()) >= 'leader');

revoke all on public.reflections from anon, authenticated;
grant select, delete on public.reflections to authenticated;
grant insert (word_id, body, visibility) on public.reflections to authenticated;
grant update (body, visibility) on public.reflections to authenticated;
grant all on public.reflections to service_role;

-- Writing a reflection counts as having read the word.
create function public.reflection_marks_read()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.devotion_reads (member_id, word_id)
  values (new.member_id, new.word_id)
  on conflict do nothing;
  return new;
end;
$$;

create trigger reflections_mark_read
  after insert on public.reflections
  for each row execute function public.reflection_marks_read();

-- Reflections with their authors' names. Members can't read other profiles
-- directly, so this applies the same visibility rules as the policy above.
create function public.word_reflections(p_word_id uuid)
returns table (
  id uuid,
  member_id uuid,
  author_name text,
  author_avatar text,
  body text,
  visibility public.reflection_visibility,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select r.id, r.member_id, p.full_name, p.avatar_url, r.body, r.visibility, r.created_at, r.updated_at
  from public.reflections r
  join public.profiles p on p.id = r.member_id
  join public.daily_words w on w.id = r.word_id
  where r.word_id = p_word_id
    and (select public.my_role()) >= 'member'
    and (w.publish_date <= (select public.today_ub()) or (select public.my_role()) >= 'leader')
    and (
      r.member_id = (select auth.uid())
      or (select public.my_role()) >= 'leader'
      or (r.visibility = 'members' and p.role >= 'member')
      or public.is_my_mentee(r.member_id)
    )
  order by r.created_at;
$$;

-- Quiet-time overview: mentors see their own groups, leaders and admins see
-- every approved member. Dates are word publish dates within the window.
create function public.quiet_time_overview(p_days integer default 14)
returns table (
  member_id uuid,
  full_name text,
  avatar_url text,
  group_id uuid,
  group_name text,
  read_dates date[],
  reflection_dates date[]
)
language sql
stable
security definer
set search_path = ''
as $$
  with viewer as (
    select public.my_role() as role, (select auth.uid()) as uid
  ),
  span as (
    select public.today_ub() - (least(greatest(coalesce(p_days, 14), 1), 60) - 1) as first_day,
           public.today_ub() as last_day
  ),
  tracked as (
    select p.id, p.full_name, p.avatar_url, p.group_id
    from public.profiles p, viewer v
    where p.role >= 'member'
      and p.id <> v.uid
      and (
        v.role >= 'leader'
        or (
          v.role >= 'mentor'
          and exists (select 1 from public.groups g where g.id = p.group_id and g.mentor_id = v.uid)
        )
      )
  )
  select
    t.id,
    t.full_name,
    t.avatar_url,
    t.group_id,
    g.name,
    coalesce((
      select array_agg(w.publish_date order by w.publish_date)
      from public.devotion_reads d
      join public.daily_words w on w.id = d.word_id, span s
      where d.member_id = t.id and w.publish_date between s.first_day and s.last_day
    ), '{}'),
    coalesce((
      select array_agg(w.publish_date order by w.publish_date)
      from public.reflections r
      join public.daily_words w on w.id = r.word_id, span s
      where r.member_id = t.id and w.publish_date between s.first_day and s.last_day
    ), '{}')
  from tracked t
  left join public.groups g on g.id = t.group_id
  order by g.name nulls last, t.full_name;
$$;

-- Morning email ------------------------------------------------------------

alter table public.profiles add column daily_email boolean not null default true;
grant update (daily_email) on public.profiles to authenticated;

-- One row per word once its email went out; written only by the server (service role).
create table public.daily_word_emails (
  word_id uuid primary key references public.daily_words (id) on delete cascade,
  sent_at timestamptz not null default now(),
  recipients integer not null default 0
);

alter table public.daily_word_emails enable row level security;
revoke all on public.daily_word_emails from anon, authenticated;
grant all on public.daily_word_emails to service_role;

-- Created here because it touches daily_word_emails, defined just above.
create trigger daily_words_guard_date_change
  before update of publish_date on public.daily_words
  for each row execute function public.guard_word_date_change();

-- Function privileges -------------------------------------------------------

revoke execute on function
  public.today_ub(),
  public.touch_updated_at(),
  public.guard_word_date_change(),
  public.is_approved(uuid),
  public.reflection_marks_read(),
  public.word_reflections(uuid),
  public.quiet_time_overview(integer)
from public, anon, authenticated;

grant execute on function
  public.today_ub(),
  public.is_approved(uuid),
  public.word_reflections(uuid),
  public.quiet_time_overview(integer)
to authenticated, service_role;
