# Autonomous Leads and Customer Relationship Management WhatsApp Agent

Aplikasi CRM WhatsApp dengan mockup UI (Inbox, Handover, Orders, Customers, Broadcast, Workflow, AI Agents) dan worker WhatsApp untuk simulasi koneksi WhatsApp (QR) + sinkronisasi ke InsForge (opsional).

## Fitur Utama

- Dashboard & navigasi CRM
- Inbox WhatsApp (mock data)
- Handover queue (mock data)
- Customers & Orders (mock data)
- Broadcast (mockup)
- Workflow & AI pages (mockup)
- WhatsApp Worker (QR + status via Socket.IO)
- Integrasi InsForge (opsional, via env var)

## Tech Stack

- Frontend: React + TypeScript + Vite
- UI: TailwindCSS, lucide-react
- Worker: Node.js + Express + Socket.IO
- Backend (opsional): InsForge

## Menjalankan Secara Lokal

### Prasyarat

Pastikan sudah ter-install:
- Node.js 18+ (disarankan)
- npm

### Install dependency

```bash
npm install
```

### Environment Variables (opsional)

Frontend (Vite):
- VITE_INSFORGE_BASE_URL
- VITE_INSFORGE_ANON_KEY

Worker (Node.js):
- INSFORGE_BASE_URL
- INSFORGE_ANON_KEY
- WA_WORKER_PORT (default: 3001)
- FRONTEND_ORIGIN (default: http://localhost:5173)

Catatan:
- Jika env InsForge belum diisi, aplikasi tetap bisa jalan dengan mode demo.
- Jangan pernah commit file .env yang berisi key asli.

### Jalankan frontend saja

```bash
npm run dev
```

### Jalankan worker saja

```bash
npm run worker
```

### Jalankan frontend + worker bersamaan

```bash
npm run dev:all
```

## Scripts

- dev: Menjalankan Vite dev server
- build: Build production (TypeScript + Vite)
- preview: Preview hasil build
- worker: Menjalankan WhatsApp worker
- dev:all: Menjalankan worker + frontend sekaligus (concurrently)

## Struktur Folder (ringkas)

- src/components: UI components (Sidebar, TopBar, dsb.)
- src/pages: Halaman utama (Inbox, Handover, Orders, Customers, Broadcast, dsb.)
- src/data: Mock data untuk demo UI
- src/lib: API client, navigasi, util
- worker: WhatsApp worker (Socket.IO + generator)

## Catatan Penggunaan

- Halaman Broadcast saat ini adalah mockup UI (tanpa redirect).
- Jika kamu ingin menghubungkan ke backend/WA real, biasanya flow-nya: worker menerima event WA → simpan ke InsForge (jika env tersedia) → frontend fetch dari API.
