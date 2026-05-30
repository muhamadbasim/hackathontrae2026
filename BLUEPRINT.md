# LOCKED BLUEPRINT — Autonomous Leads and Customer Relationship Management WhatsApp Agent

Status: **Final build contract / single source of truth**  
Tujuan: menjaga hasil build **konsisten 100% sama** walaupun dikerjakan oleh Trae Solo / coding agent berbeda.

> Dokumen ini mengunci pilihan arsitektur, struktur file, nama komponen, nama route, schema database, data seed, UI contract, event contract, dan acceptance criteria. Builder tidak boleh mengganti framework, mengganti nama menu, menambah navigasi di luar scope, atau mengubah flow utama.

---

## 0. Non-Negotiable Decisions

### 0.1 Product Name

```text
Autonomous Leads and Customer Relationship Management WhatsApp Agent
```

Subtitle:

```text
InsForge Backend + Baileys Worker + OpenCRM Command Center
```

### 0.2 Architecture Must Stay This Way

```text
Frontend React SPA
  ↓ InsForge SDK
InsForge Backend Platform
  - Auth
  - Postgres Database
  - Realtime

Frontend React SPA
  ↓ Socket.IO + REST
Baileys WhatsApp Worker
  - QR bridge
  - WhatsApp session
  - send/receive WhatsApp messages
  - sync rows to InsForge
```

### 0.3 Why Baileys Worker Exists

Baileys **must not** be implemented as an InsForge Edge Function because it requires a long-running stateful WhatsApp connection. Therefore:

- InsForge = main backend data/auth/realtime platform.
- Baileys Worker = long-running bridge service, local first and compute-ready.

### 0.4 Locked Tech Stack

Frontend:

```text
Vite
React
TypeScript
Tailwind CSS
lucide-react
socket.io-client
qrcode.react
@insforge/sdk
clsx
tailwind-merge
sonner
recharts
date-fns
```

Worker:

```text
Node.js
Express
cors
socket.io
@whiskeysockets/baileys
pino
@insforge/sdk
dotenv
```

Do **not** replace with Next.js, TanStack Start, Supabase, Firebase, Prisma, tRPC, NestJS, or another framework for this build. OpenCRM frontend references are used as design/structure guidance, not as a requirement to use TanStack Start.

### 0.5 Locked Route Strategy

Use **Vite SPA manual routing** with `activePath` in `src/App.tsx`. Do not add react-router unless explicitly requested later.

Reason: build-once prototype must be stable and fast.

### 0.6 Locked Navigation

Sidebar must contain exactly 12 menu items:

```text
Dashboard
Inbox
Handover
Orders
Pelanggan
Products
Broadcast
Workflow
AI Agents
AI Playground
Knowledge Base
Settings
```

Forbidden navigation items:

```text
Metrics
Analytics
Developers
Apps
Integration
Help
Pipeline
```

These forbidden items must not appear in Sidebar, TopBar quick links, BottomNav, command menu, or page shortcut cards.

---

## 1. Final Folder Structure

Builder must create this exact structure.

```text
project-root/
├── .env.example
├── .gitignore
├── package.json
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── insforge/
│   ├── migrations/
│   │   └── 001_opencrm_whatsapp_schema.sql
│   └── seed/
│       └── seed-demo-data.ts
├── worker/
│   ├── package.json
│   ├── server.js
│   └── auth_info_baileys/                # generated at runtime only, gitignored
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── data/
    │   └── demoFallbackData.ts
    ├── lib/
    │   ├── insforge.ts
    │   ├── api.ts
    │   ├── waSocket.ts
    │   ├── opencrm-navigation.ts
    │   ├── organization.ts
    │   ├── role-access.ts
    │   └── utils.ts
    ├── hooks/
    │   ├── useInsforgeAuth.ts
    │   └── use-mobile.ts
    ├── components/
    │   ├── AuthGate.tsx
    │   ├── Sidebar.tsx
    │   ├── TopBar.tsx
    │   ├── BottomNav.tsx
    │   ├── WhatsAppQrGate.tsx
    │   ├── KpiCards.tsx
    │   ├── CampaignTable.tsx
    │   ├── AlertSender.tsx
    │   ├── opencrm/
    │   │   ├── opencrm.css
    │   │   └── shared.tsx
    │   └── ui/
    │       ├── Button.tsx
    │       ├── Input.tsx
    │       ├── Textarea.tsx
    │       ├── Badge.tsx
    │       └── Card.tsx
    └── pages/
        ├── DashboardPage.tsx
        ├── InboxPage.tsx
        ├── HandoverPage.tsx
        ├── OrdersPage.tsx
        ├── CustomersPage.tsx
        ├── ProductsPage.tsx
        ├── BroadcastPage.tsx
        ├── WorkflowPage.tsx
        ├── AiAgentsPage.tsx
        ├── AiPlaygroundPage.tsx
        ├── KnowledgePage.tsx
        └── SettingsPage.tsx
```

No extra top-level `backend/` folder. The backend bridge folder must be named exactly:

```text
worker/
```

---

## 2. Environment Contract

Create `.env.example` exactly with these keys:

```env
VITE_INSFORGE_BASE_URL=https://your-project.insforge.app
VITE_INSFORGE_ANON_KEY=***
VITE_WA_WORKER_URL=http://localhost:3001
VITE_WA_SOCKET_URL=http://localhost:3001

INSFORGE_BASE_URL=https://your-project.insforge.app
INSFORGE_ANON_KEY=***
WA_WORKER_PORT=3001
FRONTEND_ORIGIN=http://localhost:5173
```

Rules:

- Do not invent real InsForge credentials.
- If env is missing, app must show a clear setup message and still render fallback demo data.
- Worker must still start if InsForge env is missing; it should warn and use memory fallback.

---

## 3. Package Scripts Contract

Root `package.json` must contain:

```json
{
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "tsc && vite build",
    "preview": "vite preview --host 0.0.0.0",
    "worker": "node worker/server.js",
    "dev:all": "concurrently \"npm run worker\" \"npm run dev\""
  }
}
```

Root dependencies must include:

```text
@insforge/sdk
@vitejs/plugin-react
clsx
date-fns
lucide-react
qrcode.react
react
react-dom
recharts
socket.io-client
sonner
tailwind-merge
```

Root dev dependencies must include:

```text
@types/react
@types/react-dom
autoprefixer
concurrently
postcss
tailwindcss
typescript
vite
```

Worker dependencies in `worker/package.json` must include:

```text
@insforge/sdk
@whiskeysockets/baileys
cors
dotenv
express
pino
socket.io
```

---

## 4. InsForge Backend Contract

### 4.1 InsForge Docs Basis

Use InsForge for:

- Authentication
- Postgres database
- Realtime channels
- TypeScript SDK

Important SDK patterns:

```ts
import { createClient } from '@insforge/sdk'

export const insforge = createClient({
  baseUrl: import.meta.env.VITE_INSFORGE_BASE_URL,
  anonKey: import.meta.env.VITE_INSFORGE_ANON_KEY,
})
```

Auth methods:

```ts
insforge.auth.signUp({ email, password, name })
insforge.auth.signInWithPassword({ email, password })
insforge.auth.getCurrentUser()
insforge.auth.signOut()
```

Database methods:

```ts
insforge.database.from('table').select()
insforge.database.from('table').insert(data).select()
insforge.database.from('table').update(data).eq('id', id).select()
insforge.database.from('table').delete().eq('id', id)
```

Realtime methods:

```ts
await insforge.realtime.connect()
await insforge.realtime.subscribe('crm:demo')
insforge.realtime.on('message_created', handler)
await insforge.realtime.publish('crm:demo', 'message_created', payload)
```

### 4.2 Database Migration

Create file:

```text
insforge/migrations/001_opencrm_whatsapp_schema.sql
```

The migration must be deterministic and include `create extension if not exists pgcrypto;` for UUID generation if needed.

Use this exact table set and core columns:

```sql
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
```

### 4.3 Seed Data Contract

Seed/fallback data must match these values exactly for campaign rows:

| campaign | objective | spend | leads | cpl | qualifiedRate | status | flag |
|---|---:|---:|---:|---:|---:|---|---|
| Diskon Umum | Leads | 3250000 | 96 | 33854 | 0.42 | Warning | CPL naik 37% |
| Retargeting Warm Leads | Conversion | 2100000 | 88 | 23863 | 0.61 | Healthy | Stabil |
| Lookalike High Intent | Leads | 4800000 | 174 | 27586 | 0.55 | Healthy | Scale candidate |
| Promo WhatsApp Click | Messages | 2700000 | 124 | 21774 | 0.48 | Monitor | High volume |

Seed/fallback must also include at least:

- 4 contacts
- 4 conversations
- 6 messages
- 3 handover requests
- 4 orders
- 4 products
- 3 broadcast jobs
- 3 automation flows
- 3 AI agents
- 4 knowledge sources

Organization seed:

```text
name: Demo Business
slug: demo-business
app profile: OpenCRM Demo / opencrm-demo
```

---

## 5. Worker Contract — `worker/server.js`

### 5.1 Runtime

- Port: `process.env.WA_WORKER_PORT || 3001`
- CORS origin: `process.env.FRONTEND_ORIGIN || 'http://localhost:5173'`
- Auth state path: `worker/auth_info_baileys`
- Must use CommonJS for compatibility:

```js
require('dotenv').config()
```

### 5.2 Worker Endpoints

#### `GET /health`

Response:

```json
{ "ok": true, "service": "baileys-insforge-worker" }
```

#### `GET /status`

Response:

```json
{ "status": "Connected" }
```

Allowed status values:

```text
Loading
Disconnected
Connected
```

#### `POST /alert`

Request:

```json
{
  "number": "628123456789",
  "message": "⚠️ CPL campaign naik. Mohon cek dashboard."
}
```

Behavior:

1. Strip all non-digits from number.
2. If number starts with `0`, convert to Indonesian format `62...`.
3. JID = `${normalized}@s.whatsapp.net`.
4. Send `sock.sendMessage(jid, { text: message })`.
5. Insert row into `whatsapp_alerts` if InsForge configured.
6. Emit Socket.IO event `alert:sent`.
7. Return success JSON.

#### `GET /api/demo/dashboard`

Return aggregate metrics:

```json
{
  "spend": 12850000,
  "leads": 482,
  "cpl": 26659,
  "qualifiedRate": 0.42,
  "activeCampaigns": 8,
  "alerts": 3
}
```

Prefer InsForge aggregation from campaigns. Fallback exactly as above.

#### `GET /api/demo/campaigns`

Return campaigns from InsForge or exact fallback campaign data.

#### `GET /api/demo/conversations`

Return conversations/messages from InsForge or memory fallback.

### 5.3 Socket.IO Events Emitted by Worker

```text
qr
status
message:new
conversation:updated
alert:sent
```

Payload contract:

```ts
type StatusPayload = 'Loading' | 'Disconnected' | 'Connected'

type MessageNewPayload = {
  id: string
  conversationId: string
  contactPhone: string
  direction: 'inbound' | 'outbound'
  content: string
  createdAt: string
}
```

### 5.4 WhatsApp Auto-Reply Contract

On inbound WhatsApp message:

- Ignore messages from self.
- Extract plain text.
- Upsert contact/conversation/message to InsForge when configured.
- Emit `message:new` to frontend.
- Reply according to exact flow below.

#### `ping`

Reply exactly:

```text
pong
```

#### `menu`, `halo`, `hai`

Reply exactly:

```text
Halo! 👋 Saya asisten CRM kamu. Ada yang bisa saya bantu hari ini?

Kamu bisa coba beberapa hal ini:
1. Cek performa campaign
2. Buat campaign baru
3. Pause ad yang bermasalah

Balas angka atau keyword aja ya.
```

#### `1`, `info`

Reply exactly:

```text
Eh, ada info penting nih! ⚠️

CPL buat campaign "Diskon Umum" lagi naik 37% dari biasanya, terus lead qualified-nya malah turun ke 42%.

Mending kita "Pause" aja dulu gimana? Biar budgetnya nggak boncos.
```

#### `2`, `buat`

Reply exactly:

```text
Siap, ayo kita bikin campaign baru! 🚀

Kira-kira mau pasang budget berapa per harinya? Kasih tau aja angkanya, misal 150000.
```

#### budget detection

Condition:

```js
/\d{4,}/.test(text) || text.includes('ribu')
```

Reply exactly:

```text
Oke, budget udah dicatat ya. 👌

Terus, siapa nih target audiensnya? Kasih tau kriteria spesifiknya, misal: Wanita 25-35 di Jakarta.
```

#### audience detection

Condition includes any:

```text
pria, wanita, indonesia, jakarta, bandung, surabaya
```

Reply exactly:

```text
Sip! Ini draft campaign-nya:

🎯 Objective: Leads
👥 Audience: sesuai yang kamu minta tadi
📝 Copy: "Dapatkan penawaran terbaik hari ini. Klik WhatsApp untuk konsultasi gratis."

Kalau udah oke, balas "Launch" ya buat kita jalanin sekarang.
```

#### `launch`

Reply exactly:

```text
🚀 Mantap! Campaign-nya udah jalan di Meta Ads ya.

Tenang aja, bakal aku pantau terus CPL sama kualitas lead-nya secara otomatis. Nanti aku kabarin kalau ada apa-apa!
```

#### `3`, `pause`

Reply exactly:

```text
✅ Siap, creative 'Diskon Umum' udah aku pause ya.

Aku lanjut pantau campaign lainnya, kalau ada kendala lagi langsung aku infoin!
```

#### fallback

Reply exactly:

```text
Aduh, maaf ya aku kurang paham maksudnya. 😅

Boleh balas "menu" aja biar kita liat apa aja yang bisa aku bantu?
```

### 5.5 InsForge Sync From Worker

If InsForge env is valid, worker should write:

- inbound WhatsApp message -> `contacts`, `conversations`, `messages`
- outbound bot reply -> `messages`
- alert send result -> `whatsapp_alerts`
- status changes -> `whatsapp_sessions`

---

## 6. Baileys Connection Stability & Maintenance

Untuk memastikan koneksi WhatsApp berjalan lancar dan stabil, implementasi pada `worker/server.js` wajib mengikuti standar berikut:

### 6.1 Version Management
Selalu gunakan `fetchLatestBaileysVersion()` sebelum inisialisasi socket. Ini mencegah error "Connection Failure" atau "Outdated Version" yang sering terjadi pada Baileys.

```js
const { version, isLatest } = await fetchLatestBaileysVersion();
const sock = makeWASocket({
  version,
  auth: state,
  // ... rest of config
});
```

### 6.2 Session Management
- Path sesi: `worker/auth_info_baileys`.
- Jika terjadi `DisconnectReason.loggedOut`, folder sesi harus dihapus secara rekursif sebelum mencoba koneksi ulang untuk menghindari *stale state*.

### 6.3 Performance & Logging
- Gunakan `pino({ level: 'silent' })` atau `level: 'error'` untuk menghindari log yang terlalu bising di terminal produksi.
- Jangan gunakan opsi `printQRInTerminal: true` karena sudah *deprecated* dan dapat menyebabkan gangguan pada *output control*. QR harus dikirim melalui Socket.IO sebagai *string base64* atau *raw string* ke frontend.

### 6.4 Auto-Reconnect Logic
Implementasikan logika *reconnect* pada event `connection.update` kecuali jika statusnya adalah `loggedOut`. Gunakan *exponential backoff* jika diperlukan untuk stabilitas jangka panjang.


If any InsForge write fails:

- log error
- do not crash
- continue WhatsApp flow

---

## 7. Frontend Contract

### 7.1 `src/lib/insforge.ts`

Must be:

```ts
import { createClient } from '@insforge/sdk'

export const hasInsforgeEnv = Boolean(
  import.meta.env.VITE_INSFORGE_BASE_URL &&
  import.meta.env.VITE_INSFORGE_ANON_KEY &&
  !String(import.meta.env.VITE_INSFORGE_BASE_URL).includes('your-project')
)

export const insforge = createClient({
  baseUrl: import.meta.env.VITE_INSFORGE_BASE_URL,
  anonKey: import.meta.env.VITE_INSFORGE_ANON_KEY,
})
```

### 7.2 `src/lib/opencrm-navigation.ts`

Must be this exact contract:

```ts
import {
  LayoutDashboard,
  MessagesSquare,
  Shuffle,
  ShoppingCart,
  Users,
  Package,
  Megaphone,
  Network,
  Bot,
  WandSparkles,
  BookOpen,
  Settings,
} from 'lucide-react'

export type OpenCrmNavGroup = 'operasional' | 'data' | 'outreach' | 'otomasi'

export const OPENCRM_GROUP_LABELS: Record<OpenCrmNavGroup, string> = {
  operasional: 'Operasional',
  data: 'Data',
  outreach: 'Outreach',
  otomasi: 'Otomasi',
}

export const OPENCRM_NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', group: 'operasional', icon: LayoutDashboard },
  { id: 'inbox', label: 'Inbox', path: '/chat', group: 'operasional', icon: MessagesSquare },
  { id: 'handover', label: 'Handover', path: '/handover', group: 'operasional', icon: Shuffle },
  { id: 'orders', label: 'Orders', path: '/orders', group: 'operasional', icon: ShoppingCart },
  { id: 'customers', label: 'Pelanggan', path: '/customers', group: 'data', icon: Users },
  { id: 'products', label: 'Products', path: '/products', group: 'data', icon: Package },
  { id: 'broadcast', label: 'Broadcast', path: '/broadcast', group: 'outreach', icon: Megaphone },
  { id: 'workflow', label: 'Workflow', path: '/flows', group: 'otomasi', icon: Network },
  { id: 'ai-agents', label: 'AI Agents', path: '/ai-agents', group: 'otomasi', icon: Bot },
  { id: 'ai-playground', label: 'AI Playground', path: '/ai', group: 'otomasi', icon: WandSparkles },
  { id: 'knowledge', label: 'Knowledge Base', path: '/knowledge', group: 'otomasi', icon: BookOpen },
  { id: 'settings', label: 'Settings', path: '/settings', group: 'otomasi', icon: Settings },
] as const

export const OPENCRM_ALLOWED_PATHS = [
  '/dashboard',
  '/chat',
  '/handover',
  '/orders',
  '/customers',
  '/products',
  '/broadcast',
  '/flows',
  '/ai-agents',
  '/ai',
  '/knowledge',
  '/settings',
]

export function isActivePath(pathname: string, itemPath: string) {
  return pathname === itemPath || pathname.startsWith(`${itemPath}/`)
}
```

### 6.3 Auth Behavior

`AuthGate.tsx` must:

- Show login and register modes.
- Login uses `insforge.auth.signInWithPassword({ email, password })`.
- Register uses `insforge.auth.signUp({ email, password, name })`.
- On success, store:

```ts
localStorage.setItem('scalechat_user', JSON.stringify(user))
localStorage.setItem('scalechat_token', accessToken || '')
```

- If InsForge env missing, show setup card with env keys needed, and offer `Continue in Demo Mode` button.
- Demo mode sets:

```ts
localStorage.setItem('scalechat_user', JSON.stringify({ id: 'demo-user', email: 'demo@opencrm.local', profile: { name: 'Demo Admin' } }))
```

### 6.4 Organization Context

`organization.ts` must create deterministic demo org:

```ts
{
  id: 'demo-org',
  name: 'Demo Business',
  slug: 'demo-business',
  appId: 'demo-app'
}
```

Persist keys:

```text
scalechat_org_id
scalechat_org_slug
scalechat_org_name
scalechat_app_id
```

Cookies:

```text
scalechat_org_slug=demo-business
scalechat_app_id=demo-app
```

### 7.5 API Behavior

`src/lib/api.ts` must expose:

```ts
crmApi.getDashboardMetrics()
crmApi.listCampaigns()
crmApi.listConversations()
crmApi.listContacts()
crmApi.listOrders()
crmApi.listProducts()
crmApi.listHandoverRequests()
crmApi.listBroadcastJobs()
crmApi.listFlows()
crmApi.listAiAgents()
crmApi.listKnowledgeSources()
waApi.getStatus()
waApi.sendAlert({ number, message })
```

Each CRM list call:

1. If InsForge env exists, try InsForge database first.
2. On error, return fallback demo data.
3. Never let a page render blank because a backend call failed.

### 6.6 App Shell Behavior

`App.tsx` must manage:

```ts
type WhatsAppStatus = 'Loading' | 'Disconnected' | 'Connected'
const [activePath, setActivePath] = useState('/dashboard')
const [waStatus, setWaStatus] = useState<WhatsAppStatus>('Loading')
const [qrCode, setQrCode] = useState('')
```

Behavior:

- Bootstrap demo organization on load.
- Bootstrap auth via `useInsforgeAuth`.
- If not authenticated and not demo mode, render `AuthGate`.
- After auth/demo mode, render OpenCRM shell always.
- Connect to worker Socket.IO.
- Listen `qr`, `status`, `message:new`, `alert:sent`.
- Subscribe to InsForge realtime `crm:demo` if env exists.
- Do not hide the app just because WhatsApp is disconnected. Show QR/status card inside Dashboard and Settings.

### 6.7 Page Render Function

`App.tsx` must map routes exactly:

```ts
/dashboard -> DashboardPage
/chat -> InboxPage
/handover -> HandoverPage
/orders -> OrdersPage
/customers -> CustomersPage
/products -> ProductsPage
/broadcast -> BroadcastPage
/flows -> WorkflowPage
/ai-agents -> AiAgentsPage
/ai -> AiPlaygroundPage
/knowledge -> KnowledgePage
/settings -> SettingsPage
fallback -> DashboardPage
```

---

## 8. InsForge Integration & WhatsApp Automation Contract

Untuk mengaktifkan integrasi penuh antara WhatsApp Worker dan InsForge Backend, implementasi wajib mengikuti aturan berikut:

### 8.1 InsForge Sync Strategy
Worker harus bertindak sebagai *bridge* yang melakukan sinkronisasi data secara *real-time* ke InsForge Database jika variabel lingkungan (`INSFORGE_BASE_URL` & `INSFORGE_ANON_KEY`) terdeteksi.

- **Inbound Messages**: Setiap pesan masuk harus di-insert ke tabel `messages`.
- **Outbound Replies**: Setiap balasan otomatis dari bot harus di-insert ke tabel `messages`.
- **Campaign Creation**: Saat pengguna memicu perintah "launch", data campaign baru harus di-insert ke tabel `campaigns`.

### 8.2 WhatsApp Automation Flow (Campaign Insert)
Logika pada `worker/server.js` untuk perintah "launch" wajib menyertakan blok integrasi dan manajemen state agentic:

```js
const userState = {} // Manajemen state percakapan sederhana

// Inbound message logic:
// 1. Awaiting Budget -> Simpan budget, lanjut tanya audiens
// 2. Awaiting Audience -> Simpan audiens, tunjukkan ringkasan strategi
// 3. Launch -> Eksekusi insert ke InsForge

if (lower === 'launch' && state.step === 'awaiting_launch') {
  replyText = '🚀 *PROSES EKSEKUSI*... Campaign berhasil saya luncurkan!';
  
  if (hasInsforgeEnv) {
    await insforge.database.from('campaigns').insert({
      name: `AI Campaign - ${state.audience}`,
      objective: 'Leads',
      status: 'Healthy',
      spend: 0,
      leads: 0,
      flag: `Budget: ${state.budget}`
    });
  }
}
```

### 8.3 Frontend Real-time Refresh
Dashboard wajib melakukan polling atau menggunakan realtime subscription untuk menampilkan data terbaru secara instan setelah aksi Agent AI:
- Interval polling: 5 detik (fallback).
- UI harus menunjukkan status koneksi WhatsApp secara dinamis.


---

## 9. UI Contract

### 9.1 Visual Identity

- Warm orange primary.
- Light background.
- Glassmorphism cards.
- Animated gradient/blob background.
- Clean SaaS CRM look.
- Rounded cards and subtle shadows.
- Use lucide-react icons only.

### 9.2 Tailwind Theme

`tailwind.config.js` must include:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        border: 'hsl(var(--border))',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
      },
      animation: {
        blob: 'blob 12s infinite',
      },
    },
  },
  plugins: [],
}
```

### 9.3 `src/index.css`

Must include:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 30 60% 98%;
  --foreground: 222 47% 11%;
  --card: 0 0% 100%;
  --card-foreground: 222 47% 11%;
  --primary: 24 95% 53%;
  --primary-foreground: 33 100% 96%;
  --muted: 30 20% 94%;
  --muted-foreground: 215 16% 47%;
  --border: 24 20% 88%;
}

* { box-sizing: border-box; }

body {
  min-height: 100vh;
  margin: 0;
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

### 9.4 `opencrm.css`

Must define at least:

```text
ocm-shell
ocm-page
ocm-card
ocm-card-header
ocm-card-title
ocm-card-body
ocm-btn
ocm-btn-primary
ocm-tag
ocm-grid-2
ocm-grid-3
ocm-grid-4
ocm-table
ocm-input
ocm-textarea
ocm-select
ocm-section-title
ocm-section-subtitle
```

### 7.5 Sidebar Contract

Sidebar markup shape:

```tsx
<aside className="flex h-full w-72 flex-col border-r border-border bg-card/80 text-card-foreground backdrop-blur-xl">
  <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
    ...
  </nav>
</aside>
```

Group label class:

```text
px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground
```

Item class base:

```text
group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
```

Active class:

```text
bg-primary/15 text-primary
```

Inactive class:

```text
text-muted-foreground hover:bg-muted hover:text-foreground
```

### 7.6 BottomNav Contract

Mobile bottom nav only. Preferred paths:

```ts
const preferred = ['/dashboard', '/chat', '/customers', '/flows']
```

Add Menu button. Do not add more shortcuts.

---

## 8. Page Contracts

All pages must use:

```tsx
<main className="ocm-page">
  <OpenCrmSectionHeader title="..." subtitle="..." actions={...} />
  ...content...
</main>
```

### 8.1 DashboardPage

Must show:

- Title: `Dashboard`
- Subtitle: `Pantau performa campaign, CRM signals, dan koneksi WhatsApp.`
- WhatsApp status badge.
- QR card if `waStatus !== 'Connected'`.
- KPI cards:
  - Spend
  - Leads
  - CPL
  - Qualified Rate
  - Active Campaigns
  - Alerts
- CampaignTable.
- AlertSender.
- Recharts simple chart using campaigns data.

### 8.2 InboxPage

Must show:

- Title: `Inbox`
- Conversation list.
- Active chat window.
- Right customer context panel.
- Badge `WhatsApp Baileys`.
- Append socket `message:new` events to visible list.

### 8.3 HandoverPage

Must show:

- Handover queue.
- Status tags pending/approved/rejected.
- Approve/Reject buttons update state.

### 8.4 OrdersPage

Must show:

- Orders table.
- Summary cards.
- Status tags pending/completed/cancelled/expired.

### 8.5 CustomersPage

Must show:

- Search input.
- Customer list.
- Detail panel.
- Lead score.
- Tags.

### 8.6 ProductsPage

Must show:

- Product cards/table.
- SKU.
- Price.
- Stock.
- Active status.

### 8.7 BroadcastPage

Must show:

- Broadcast form.
- Use `waApi.sendAlert` for single-number test send.
- Broadcast jobs table/list.

### 8.8 WorkflowPage

Must show three flow cards exactly:

```text
WhatsApp Lead Qualification
CPL Alert Auto Pause
Broadcast Follow-up
```

### 8.9 AiAgentsPage

Must show three agent cards exactly:

```text
Campaign Analyst
CRM Qualifier
WhatsApp Reply Assistant
```

### 8.10 AiPlaygroundPage

Must show:

- Agent select.
- Prompt textarea.
- Run button.
- Deterministic simulated output.

### 8.11 KnowledgePage

Must show:

- Knowledge sources list.
- Add text source form.
- Retrieval test panel.

### 8.12 SettingsPage

Must show cards/tabs:

```text
WhatsApp Connection
InsForge Backend
AI Models
Labels
Team
Notifications
```

Must display:

- Worker URL.
- InsForge env presence.
- Current WhatsApp status.
- QR if disconnected.

---

## 9. Deterministic Fallback Data Contract

`src/data/demoFallbackData.ts` must export named arrays/objects:

```ts
campaignsData
contactsData
conversationsData
messagesData
handoverRequestsData
ordersData
productsData
broadcastJobsData
flowsData
aiAgentsData
knowledgeSourcesData
settingsSummary
```

Campaign values must match section 4.3 exactly.

Use stable IDs, not random IDs, in fallback data:

```text
camp-001, camp-002...
contact-001...
conv-001...
msg-001...
```

Do not use `Math.random()` for seed/fallback UI data.

---

## 10. Realtime Contract

### 10.1 Worker Socket.IO Events

Frontend must listen:

```text
qr
status
message:new
conversation:updated
alert:sent
```

### 10.2 InsForge Realtime Events

If env exists, frontend subscribes to channel:

```text
crm:demo
```

Frontend may listen:

```text
conversation_created
message_created
alert_sent
campaign_updated
```

If subscription fails, log warning and continue fallback mode.

---

## 11. Build Order

Builder must follow this order:

1. Scaffold Vite React TS.
2. Install dependencies.
3. Create env/gitignore/package scripts.
4. Create InsForge client and migration SQL.
5. Create deterministic fallback data.
6. Create Worker `worker/server.js`.
7. Create design system CSS and shared components.
8. Create navigation source.
9. Create shell components: AuthGate, Sidebar, TopBar, BottomNav, WhatsAppQrGate.
10. Create API/socket utilities.
11. Create Dashboard components: KpiCards, CampaignTable, AlertSender.
12. Create all 12 pages.
13. Wire `App.tsx` route mapping.
14. Run typecheck/build.
15. Report files and run instructions.

Do not start by polishing visuals before schema, worker, and core shell exist.

---

## 12. Verification Commands

Run:

```bash
npm run build
npm run worker
npm run dev
```

If using one terminal command:

```bash
npm run dev:all
```

Expected local URLs:

```text
Frontend: http://localhost:5173
Worker: http://localhost:3001
Health: http://localhost:3001/health
```

---

## 13. Acceptance Checklist

### 13.1 Build

- [ ] `npm run build` passes.
- [ ] `npm run worker` starts without crashing even if InsForge env missing.
- [ ] `npm run dev` starts frontend.

### 13.2 InsForge

- [ ] `src/lib/insforge.ts` exists.
- [ ] Auth methods use InsForge SDK.
- [ ] Database methods use InsForge SDK.
- [ ] Realtime subscription attempts `crm:demo` when env exists.
- [ ] Migration SQL exists with all locked tables.

### 13.3 Worker

- [ ] `/health` returns expected JSON.
- [ ] `/status` returns allowed status.
- [ ] `/alert` normalizes phone and sends message if connected.
- [ ] Worker emits QR/status.
- [ ] Bot replies exactly to ping/menu/info/buat/budget/audience/launch/pause.
- [ ] Worker continues if InsForge writes fail.

### 13.4 UI/Nav

- [ ] Sidebar exactly 12 menu items.
- [ ] Forbidden items absent.
- [ ] Bottom nav only Dashboard/Inbox/Pelanggan/Workflow/Menu.
- [ ] Active class is `bg-primary/15 text-primary`.
- [ ] All 12 pages render non-empty useful content.

### 13.5 Dashboard

- [ ] Shows WhatsApp status.
- [ ] Shows QR card if disconnected.
- [ ] Shows six KPI cards.
- [ ] Shows CampaignTable.
- [ ] Shows AlertSender.
- [ ] Uses exact campaign fallback data.

### 13.6 Resilience

- [ ] Missing InsForge env does not blank the app.
- [ ] Missing worker does not blank the app; status shows disconnected/setup warning.
- [ ] Failed database query falls back to deterministic data.

---

## 14. Final Prompt for Trae Solo

Copy this section only if Trae Solo needs one concise prompt instead of the full blueprint:

```text
Build exactly from LOCKED BLUEPRINT: InsForge WhatsApp Autonomous CRM + OpenCRM Frontend.

You are a senior full-stack engineer. Build one complete project:
Autonomous Leads and Customer Relationship Management WhatsApp Agent powered by InsForge Backend + Baileys Worker + OpenCRM-style React Command Center.

Use this architecture exactly:
- Frontend: Vite + React + TypeScript + Tailwind CSS.
- Backend platform: InsForge via @insforge/sdk for Auth, Database, and Realtime.
- WhatsApp integration: separate long-running worker in worker/ using Express + Baileys + Socket.IO.
- Do not replace InsForge with a custom backend.
- Do not run Baileys inside an edge/serverless function.
- App must keep working with deterministic fallback data when InsForge env or worker is missing.

Create exact file structure:
- insforge/migrations/001_opencrm_whatsapp_schema.sql
- insforge/seed/seed-demo-data.ts
- worker/server.js
- src/lib/insforge.ts
- src/lib/api.ts
- src/lib/waSocket.ts
- src/lib/opencrm-navigation.ts
- src/lib/organization.ts
- src/lib/role-access.ts
- src/data/demoFallbackData.ts
- src/components/AuthGate.tsx
- src/components/Sidebar.tsx
- src/components/TopBar.tsx
- src/components/BottomNav.tsx
- src/components/WhatsAppQrGate.tsx
- src/components/KpiCards.tsx
- src/components/CampaignTable.tsx
- src/components/AlertSender.tsx
- src/pages/DashboardPage.tsx
- src/pages/InboxPage.tsx
- src/pages/HandoverPage.tsx
- src/pages/OrdersPage.tsx
- src/pages/CustomersPage.tsx
- src/pages/ProductsPage.tsx
- src/pages/BroadcastPage.tsx
- src/pages/WorkflowPage.tsx
- src/pages/AiAgentsPage.tsx
- src/pages/AiPlaygroundPage.tsx
- src/pages/KnowledgePage.tsx
- src/pages/SettingsPage.tsx

Use these env keys:
- VITE_INSFORGE_BASE_URL
- VITE_INSFORGE_ANON_KEY
- VITE_WA_WORKER_URL=http://localhost:3001
- VITE_WA_SOCKET_URL=http://localhost:3001
- INSFORGE_BASE_URL
- INSFORGE_ANON_KEY
- WA_WORKER_PORT=3001
- FRONTEND_ORIGIN=http://localhost:5173

Implement InsForge auth with:
- signUp({ email, password, name })
- signInWithPassword({ email, password })
- getCurrentUser()
- signOut()

Implement InsForge database with:
- database.from(table).select()
- insert(...).select()
- update(...).eq(...).select()
- delete().eq(...)

Implement InsForge realtime with channel crm:demo and event handlers for CRM/conversation updates.

Worker requirements:
- GET /health returns JSON health.
- GET /status returns disconnected | qr | connected.
- POST /alert normalizes phone number and sends WhatsApp message if connected.
- Emits qr and status through Socket.IO.
- Bot replies exactly to: ping, menu, info, buat, budget, audience, launch, pause.
- Worker continues even if InsForge writes fail.

Navigation must be exactly 12 sidebar items:
Dashboard, Inbox, Handover, Orders, Pelanggan, Products, Broadcast, Workflow, AI Agents, AI Playground, Knowledge Base, Settings.

Forbidden navigation items:
Metrics, Analytics, Developers, Apps, Integration, Help, Pipeline.

Mobile bottom nav must be exactly:
Dashboard, Inbox, Pelanggan, Workflow, Menu.

Active class must be:
bg-primary/15 text-primary

Dashboard must show:
- WhatsApp status / QR card.
- Six KPI cards.
- CampaignTable.
- AlertSender.
- Exact fallback campaigns:
  1. Diskon Umum, Leads, 3250000, 96, 33854, 0.42, Warning, CPL naik 37%
  2. Retargeting Warm Leads, Conversion, 2100000, 88, 23863, 0.61, Healthy, Stabil
  3. Lookalike High Intent, Leads, 4800000, 174, 27586, 0.55, Healthy, Scale candidate
  4. Promo WhatsApp Click, Messages, 2700000, 124, 21774, 0.48, Monitor, High volume

Design direction:
Premium OpenCRM-style command center, responsive desktop/mobile, clean app shell, sidebar, topbar, dense CRM data views, warm orange primary color, glassmorphism where useful. Do not build a landing page. First screen after auth is the real CRM dashboard.

Acceptance criteria:
- npm run build passes.
- npm run worker starts port 3001.
- npm run dev starts port 5173.
- Missing env never blanks the app.
- All 12 pages render useful non-empty content.
- Sidebar and bottom nav match the locked lists exactly.
- Migration SQL exists with all locked tables.
- Worker QR/status/send alert flow works.

Use the full LOCKED BLUEPRINT as the single source of truth. Start building files now; do not only explain.
```

---

## 15. Minimal Caller Prompt

Use this when attaching this blueprint file to Trae Solo and you only want a short instruction:

```text
Saya lampirkan file LOCKED-BLUEPRINT-INSFORGE-OPENCRM-WHATSAPP-100P.md.

Tugas kamu: baca blueprint tersebut sebagai single source of truth, lalu build project persis sesuai isi blueprint sampai selesai.

Jangan mengubah arsitektur, stack, daftar route/menu, schema, worker WhatsApp, fallback data, acceptance criteria, atau design direction yang sudah dikunci di blueprint.

Implementasikan semua file yang diminta, jalankan build/test yang relevan, dan laporkan hasil akhir beserta cara menjalankan project.
```
