-- Laboratório aberto para nomes fictícios: nunca usar para dados pessoais reais.
create table if not exists public.oficina_nomes (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(btrim(nome)) between 1 and 120),
  created_at timestamptz not null default now()
);
alter table public.oficina_nomes enable row level security;
grant select, insert on public.oficina_nomes to anon, authenticated;
create policy "oficina_demo_select" on public.oficina_nomes for select to anon, authenticated using (true);
create policy "oficina_demo_insert" on public.oficina_nomes for insert to anon, authenticated with check (char_length(btrim(nome)) between 1 and 120);
