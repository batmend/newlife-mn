-- Facebook Login support: self-service account deletion (required by Meta),
-- keeping mentors' emails private from mentees, and refreshing OAuth avatars.

-- 1. Members delete their own account. Deleting the auth user cascades to
--    public.profiles (and later member content).
create function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
begin
  if v_uid is null then
    raise exception 'permission denied' using errcode = '42501';
  end if;

  -- Same admin-row lock as admin_update_member, so the last two admins can't
  -- both leave at once.
  perform 1 from public.profiles where role = 'admin' order by id for update;

  if exists (select 1 from public.profiles where id = v_uid and role = 'admin')
     and (select count(*) from public.profiles where role = 'admin') <= 1 then
    raise exception 'Та чуулганы цорын ганц админ тул бүртгэлээ устгах боломжгүй. Эхлээд өөр хүнд админ эрх олгоно уу.';
  end if;

  -- Auth audit rows hold the email, name and IP but have no FK to auth.users.
  -- Best effort: never let a missing privilege block the deletion itself.
  begin
    delete from auth.audit_log_entries where payload ->> 'actor_id' = v_uid::text;
  exception when insufficient_privilege then
    null;
  end;

  delete from auth.users where id = v_uid;
end;
$$;

revoke execute on function public.delete_my_account() from public, anon, authenticated;
grant execute on function public.delete_my_account() to authenticated;

-- 2. Mentees see only their mentor's name and photo, not the whole profile row.
drop policy "Members read their group mentor" on public.profiles;
drop function public.is_my_mentor(uuid);

create function public.my_group_mentor()
returns table (id uuid, full_name text, avatar_url text)
language sql
stable
security definer
set search_path = ''
as $$
  select m.id, m.full_name, m.avatar_url
  from public.profiles me
  join public.groups g on g.id = me.group_id
  join public.profiles m on m.id = g.mentor_id
  where me.id = (select auth.uid())
    and me.role >= 'member'
    and m.role >= 'mentor';
$$;

revoke execute on function public.my_group_mentor() from public, anon, authenticated;
grant execute on function public.my_group_mentor() to authenticated;

-- 3. Facebook photo links are signed and expire; Supabase rewrites the user's
--    metadata on every OAuth sign-in, so copy the fresh link each time.
create function public.handle_user_avatar_change()
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
  update public.profiles
     set avatar_url = case when v_avatar ~ '^https://' then v_avatar end
   where id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_avatar_changed
  after update of raw_user_meta_data on auth.users
  for each row
  when (
    coalesce(old.raw_user_meta_data ->> 'avatar_url', old.raw_user_meta_data ->> 'picture')
    is distinct from
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture')
  )
  execute function public.handle_user_avatar_change();

revoke execute on function public.handle_user_avatar_change() from public, anon, authenticated;
