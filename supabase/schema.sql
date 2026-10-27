-- TechParts 3D: database schema + least-privilege RLS policies
-- Run this file in the Supabase SQL Editor for a fresh project.
-- IMPORTANT: Do not add the service_role key to any browser file.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.form_fields (
  id uuid primary key default gen_random_uuid(),
  field_key text not null unique check (field_key ~ '^[a-z][a-z0-9_]{1,39}$'),
  label_de text not null check (length(trim(label_de)) between 1 and 120),
  label_en text not null check (length(trim(label_en)) between 1 and 120),
  input_type text not null check (input_type in ('text','email','tel','number','date','textarea','select','checkbox')),
  is_required boolean not null default false,
  enabled boolean not null default true,
  options jsonb not null default '[]'::jsonb check (jsonb_typeof(options) = 'array'),
  position integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new','in_progress','closed')),
  data jsonb not null check (jsonb_typeof(data) = 'object' and pg_column_size(data) < 16384)
);

create index if not exists inquiries_created_at_idx on public.inquiries(created_at desc);
create index if not exists inquiries_status_idx on public.inquiries(status);

alter table public.admin_users enable row level security;
alter table public.form_fields enable row level security;
alter table public.inquiries enable row level security;

-- Revoke broad default privileges. Re-grant only operations used by the app.
revoke all on table public.admin_users from anon, authenticated;
revoke all on table public.form_fields from anon, authenticated;
revoke all on table public.inquiries from anon, authenticated;

grant select on table public.admin_users to authenticated;
grant select on table public.form_fields to anon, authenticated;
grant insert, update, delete on table public.form_fields to authenticated;
grant insert (data) on table public.inquiries to anon, authenticated;
grant select, delete on table public.inquiries to authenticated;
grant update (status) on table public.inquiries to authenticated;

-- An authenticated user can only read their own grant. Grants are added manually
-- from the SQL Editor; this table cannot be changed through the website.
drop policy if exists admin_users_select_self on public.admin_users;
create policy admin_users_select_self
  on public.admin_users for select to authenticated
  using (user_id = (select auth.uid()));

-- Public visitors may read only active form definitions. A granted administrator
-- can read and maintain all definitions, including disabled fields.
drop policy if exists form_fields_public_read_enabled on public.form_fields;
create policy form_fields_public_read_enabled
  on public.form_fields for select to anon, authenticated
  using (enabled = true);

drop policy if exists form_fields_admin_manage on public.form_fields;
create policy form_fields_admin_manage
  on public.form_fields for all to authenticated
  using (exists (select 1 from public.admin_users au where au.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users au where au.user_id = (select auth.uid())));

-- Visitors may INSERT a new enquiry, but cannot read, update, or delete any enquiry.
-- The column-level grant permits submitting only `data`; id, timestamp and status
-- remain server-generated. Request bodies are size-limited as a basic abuse guard.
drop policy if exists inquiries_public_insert_only on public.inquiries;
create policy inquiries_public_insert_only
  on public.inquiries for insert to anon, authenticated
  with check (
    status = 'new'
    and jsonb_typeof(data) = 'object'
    and pg_column_size(data) < 16384
  );

-- Only rows accessed by an explicitly granted admin are visible/manageable.
drop policy if exists inquiries_admin_read on public.inquiries;
create policy inquiries_admin_read
  on public.inquiries for select to authenticated
  using (exists (select 1 from public.admin_users au where au.user_id = (select auth.uid())));

drop policy if exists inquiries_admin_update_status on public.inquiries;
create policy inquiries_admin_update_status
  on public.inquiries for update to authenticated
  using (exists (select 1 from public.admin_users au where au.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users au where au.user_id = (select auth.uid())));

drop policy if exists inquiries_admin_delete on public.inquiries;
create policy inquiries_admin_delete
  on public.inquiries for delete to authenticated
  using (exists (select 1 from public.admin_users au where au.user_id = (select auth.uid())));

-- Safe default fields. Run idempotently; existing settings are left unchanged.
insert into public.form_fields (field_key,label_de,label_en,input_type,is_required,enabled,options,position)
values
  ('full_name','Vor- und Nachname','Full name','text',true,true,'[]'::jsonb,1),
  ('email','E-Mail-Adresse','Email address','email',true,true,'[]'::jsonb,2),
  ('company','Unternehmen','Company','text',false,true,'[]'::jsonb,3),
  ('phone','Telefon','Phone','tel',false,true,'[]'::jsonb,4),
  ('part','Bauteil','Component','select',true,true,'["TP-CAD-001 — Stufenwelle","TP-CAD-002 — Keilriemenscheibe","TP-CAD-003 — Wälzlager"]'::jsonb,5),
  ('quantity','Menge (Stück)','Quantity (pcs)','number',true,true,'[]'::jsonb,6),
  ('message','Nachricht / Anmerkungen','Message / notes','textarea',false,true,'[]'::jsonb,7)
on conflict (field_key) do nothing;

-- Do not automatically add an administrator here. Use the secure setup steps in
-- BACKEND_SETUP_RU.md after creating your own Auth user in the Supabase dashboard.
