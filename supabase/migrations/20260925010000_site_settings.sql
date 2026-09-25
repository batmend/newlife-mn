-- Site-wide settings, starting with the coming-soon switch for the public website.
-- The middleware reads coming_soon anonymously; only admins can change it (via the RPC).

create table public.site_settings (
  id boolean primary key default true check (id),
  coming_soon boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) on delete set null
);

insert into public.site_settings (id) values (true);

alter table public.site_settings enable row level security;

create policy "Anyone can read site settings"
  on public.site_settings for select to anon, authenticated
  using (true);

-- Column grants: who changed the setting (updated_by) stays private.
revoke all on public.site_settings from anon, authenticated;
grant select (id, coming_soon) on public.site_settings to anon;
grant select (id, coming_soon, updated_at) on public.site_settings to authenticated;
grant all on public.site_settings to service_role;

create function public.admin_set_coming_soon(p_coming_soon boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if public.my_role() is distinct from 'admin' then
    raise exception 'permission denied' using errcode = '42501';
  end if;
  if p_coming_soon is null then
    raise exception 'Тохиргооны утга хоосон байна';
  end if;

  update public.site_settings
     set coming_soon = p_coming_soon,
         updated_at = now(),
         updated_by = (select auth.uid())
   where id;
end;
$$;

revoke execute on function public.admin_set_coming_soon(boolean) from public, anon, authenticated;
grant execute on function public.admin_set_coming_soon(boolean) to authenticated;
