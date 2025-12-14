-- Create RPC to get all hymns (aggregated from hymn_lines)
create or replace function public.get_all_hymns()
returns table (
  hymn_number integer,
  title text,
  verse_count bigint,
  has_chorus boolean
)
language sql
stable
security definer
set search_path = public
as $$
  select 
    hymn_number,
    max(text) filter (where verse_number = 1 and line_number = 1) as title,
    count(distinct verse_number) filter (where not chorus) as verse_count,
    bool_or(chorus) as has_chorus
  from public.hymn_lines
  group by hymn_number
  order by hymn_number;
$$;

-- Create function to refresh hymns index
create or replace function public.refresh_hymns_index()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Reindex the hymn_lines table to ensure optimal query performance
  reindex table public.hymn_lines;
  
  -- Log the refresh action
  insert into public.admin_logs (user_id, email, action)
  values (
    auth.uid(),
    (select email from public.profiles where user_id = auth.uid()),
    'Refreshed hymns index'
  );
end;
$$;

-- Ensure hymn_number is integer type (already is, but this confirms it)
alter table public.hymn_lines
alter column hymn_number type integer using hymn_number::integer;

-- Ensure RLS allows anonymous reads
drop policy if exists "Everyone can view hymn lines" on public.hymn_lines;
create policy "Everyone can view hymn lines"
on public.hymn_lines
for select
to anon, authenticated
using (true);