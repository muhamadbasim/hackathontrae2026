create extension if not exists pgcrypto;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.app_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  name text not null,
  slug text not null,
  created_at timestamptz default now()
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  name text not null,
  objective text not null,
  spend numeric default 0,
  leads integer default 0,
  cpl numeric default 0,
  qualified_rate numeric default 0,
  status text default 'Healthy',
  flag text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  name text,
  phone text not null,
  email text,
  lead_score integer default 0,
  tags jsonb default '[]'::jsonb,
  source text default 'whatsapp',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  contact_id uuid references public.contacts(id) on delete set null,
  channel text default 'whatsapp',
  provider text default 'baileys',
  status text default 'open',
  priority text default 'medium',
  last_message text,
  last_message_at timestamptz default now(),
  unread_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade,
  contact_id uuid references public.contacts(id) on delete set null,
  direction text not null,
  sender_type text not null,
  content text,
  content_type text default 'text',
  external_id text,
  raw_payload jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.handover_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  conversation_id uuid references public.conversations(id) on delete cascade,
  status text default 'pending',
  request_note text,
  ai_reason text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  contact_id uuid references public.contacts(id) on delete set null,
  order_number text not null,
  order_status text default 'pending',
  grand_total numeric default 0,
  payment_status text default 'NOT_PAID',
  created_at timestamptz default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  name text not null,
  sku text,
  price numeric default 0,
  stock integer default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.broadcast_jobs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  title text not null,
  message text not null,
  status text default 'draft',
  total_recipients integer default 0,
  success_count integer default 0,
  failed_count integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.automation_flows (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  name text not null,
  description text,
  nodes jsonb default '[]'::jsonb,
  edges jsonb default '[]'::jsonb,
  active boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.ai_agents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  name text not null,
  description text,
  persona text,
  model text default 'openai/gpt-4o-mini',
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.knowledge_sources (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  title text not null,
  type text default 'text',
  content text,
  status text default 'ready',
  created_at timestamptz default now()
);

create table if not exists public.crm_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  key text not null,
  value jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.whatsapp_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  provider text default 'baileys',
  status text default 'Disconnected',
  phone text,
  last_qr_at timestamptz,
  connected_at timestamptz,
  updated_at timestamptz default now()
);

create table if not exists public.whatsapp_alerts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  target_number text not null,
  message text not null,
  status text default 'pending',
  error text,
  created_at timestamptz default now()
);