-- Members can delete their own account; Facebook Login requires a data-deletion path.
-- Deleting the auth user cascades to public.profiles (and later member content).

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

  delete from auth.users where id = v_uid;
end;
$$;

revoke execute on function public.delete_my_account() from public, anon, authenticated;
grant execute on function public.delete_my_account() to authenticated;
