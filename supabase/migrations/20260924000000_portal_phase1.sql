-- Шинэ Амь member portal, phase 1: profiles, roles, groups.
-- Apply once via the Supabase SQL Editor or `supabase db push`.

create type public.member_role as enum ('pending', 'member', 'mentor', 'leader', 'admin');

create table public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 80),
  mentor_id uuid,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text not null default '' check (char_length(full_name) <= 120),
  avatar_url text check (avatar_url is null or avatar_url ~ '^https://'),
  role public.member_role not null default 'pending',
  group_id uuid references public.groups (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.groups
  add constraint groups_mentor_id_fkey
  foreign key (mentor_id) references public.profiles (id) on delete set null;

create index profiles_group_id_idx on public.profiles (group_id);
create index groups_mentor_id_idx on public.groups (mentor_id);

alter table public.profiles enable row level security;
alter table public.groups enable row level security;

-- The project does not auto-expose new tables, so every privilege is explicit.
revoke all on public.profiles, public.groups from anon, authenticated;
grant select on public.profiles, public.groups to authenticated;
grant update (full_name) on public.profiles to authenticated;
grant all on public.profiles, public.groups to service_role;

-- Helpers are SECURITY DEFINER so policies on profiles can read profiles
-- without recursing into their own RLS checks.
create function public.my_role()
returns public.member_role
language sql
stable
security definer
set search_path = ''
as $$
  select role from public.profiles where id = (select auth.uid());
$$;

create function public.is_my_mentee(p_profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    join public.groups g on g.id = p.group_id
    where p.id = p_profile_id
      and g.mentor_id = (select auth.uid())
  );
$$;

create function public.is_my_mentor(p_profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles me
    join public.groups g on g.id = me.group_id
    where me.id = (select auth.uid())
      and me.role >= 'member'
      and g.mentor_id = p_profile_id
  );
$$;

create policy "Own profile is readable"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()));

create policy "Leaders and admins read all profiles"
  on public.profiles for select to authenticated
  using ((select public.my_role()) >= 'leader');

create policy "Mentors read their group members"
  on public.profiles for select to authenticated
  using (public.is_my_mentee(id));

create policy "Members read their group mentor"
  on public.profiles for select to authenticated
  using (public.is_my_mentor(id));

create policy "Users update their own profile"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "Approved members read groups"
  on public.groups for select to authenticated
  using ((select public.my_role()) >= 'member');

-- Role and group changes go through these functions; clients have no
-- UPDATE privilege on profiles.role / profiles.group_id or any groups column.
create function public.admin_update_member(
  p_member_id uuid,
  p_role public.member_role,
  p_group_id uuid
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_current public.member_role;
begin
  if public.my_role() is distinct from 'admin' then
    raise exception 'permission denied' using errcode = '42501';
  end if;

  if p_role is null then
    raise exception 'Эрхийн түвшинг сонгоно уу';
  end if;

  if p_group_id is not null
     and not exists (select 1 from public.groups where id = p_group_id) then
    raise exception 'Сонгосон бүлэг олдсонгүй';
  end if;

  -- Lock every admin row in a stable order so two admins demoting each
  -- other at once cannot both succeed and leave the church with none.
  perform 1 from public.profiles where role = 'admin' order by id for update;

  select role into v_current from public.profiles where id = p_member_id for update;
  if not found then
    raise exception 'Гишүүн олдсонгүй';
  end if;

  if v_current = 'admin' and p_role <> 'admin'
     and (select count(*) from public.profiles where role = 'admin') <= 1 then
    raise exception 'Сүүлийн админы эрхийг хасах боломжгүй. Эхлээд өөр хүнд админ эрх олгоно уу.';
  end if;

  update public.profiles
     set role = p_role, group_id = p_group_id
   where id = p_member_id;

  if p_role < 'mentor' then
    update public.groups set mentor_id = null where mentor_id = p_member_id;
  end if;
end;
$$;

create function public.admin_save_group(
  p_group_id uuid,
  p_name text,
  p_mentor_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_name text := btrim(coalesce(p_name, ''));
  v_id uuid;
begin
  if public.my_role() is distinct from 'admin' then
    raise exception 'permission denied' using errcode = '42501';
  end if;

  if char_length(v_name) = 0 then
    raise exception 'Бүлгийн нэрийг оруулна уу';
  end if;

  if char_length(v_name) > 80 then
    raise exception 'Бүлгийн нэр 80 тэмдэгтээс хэтрэхгүй байх ёстой';
  end if;

  if p_mentor_id is not null
     and not exists (
       select 1 from public.profiles where id = p_mentor_id and role >= 'mentor'
     ) then
    raise exception 'Сонгосон хүн чиглүүлэгчийн эрхгүй байна';
  end if;

  if p_group_id is null then
    insert into public.groups (name, mentor_id)
    values (v_name, p_mentor_id)
    returning id into v_id;
  else
    update public.groups
       set name = v_name, mentor_id = p_mentor_id
     where id = p_group_id
    returning id into v_id;

    if v_id is null then
      raise exception 'Бүлэг олдсонгүй';
    end if;
  end if;

  return v_id;
end;
$$;

create function public.admin_delete_group(p_group_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if public.my_role() is distinct from 'admin' then
    raise exception 'permission denied' using errcode = '42501';
  end if;

  delete from public.groups where id = p_group_id;
  if not found then
    raise exception 'Бүлэг олдсонгүй';
  end if;
end;
$$;

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_avatar text := coalesce(
    new.raw_user_meta_data ->> 'avatar_url',
    new.raw_user_meta_data ->> 'picture'
  );
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    left(
      coalesce(
        nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''),
        nullif(btrim(new.raw_user_meta_data ->> 'name'), ''),
        split_part(coalesce(new.email, ''), '@', 1)
      ),
      120
    ),
    case when v_avatar ~ '^https://' then v_avatar end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create function public.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles set email = new.email where id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row
  when (old.email is distinct from new.email)
  execute function public.handle_user_email_change();

revoke execute on function
  public.my_role(),
  public.is_my_mentee(uuid),
  public.is_my_mentor(uuid),
  public.admin_update_member(uuid, public.member_role, uuid),
  public.admin_save_group(uuid, text, uuid),
  public.admin_delete_group(uuid),
  public.handle_new_user(),
  public.handle_user_email_change()
from public, anon, authenticated;

grant execute on function
  public.my_role(),
  public.is_my_mentee(uuid),
  public.is_my_mentor(uuid),
  public.admin_update_member(uuid, public.member_role, uuid),
  public.admin_save_group(uuid, text, uuid),
  public.admin_delete_group(uuid)
to authenticated;

-- First admin: sign in once through the portal, then run (with your email):
--   update public.profiles set role = 'admin' where email = 'you@example.com';
