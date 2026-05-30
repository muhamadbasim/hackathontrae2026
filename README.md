# Autonomous Leads and Customer Relationship Management WhatsApp Agent

**Autonomous Leads and Customer Relationship Management WhatsApp Agent** is an end-to-end system that turns paid traffic into structured WhatsApp conversations, handled by **agentic AI**, and closed through an **automated closing + follow-up engine**.

The problem I’m solving is simple but expensive: many businesses can run ads, but they don’t have an operational machine to (1) respond instantly, (2) qualify leads, (3) follow up consistently, and (4) close deals—without burning out the CS team.

What makes this different: **you can run ads directly from chat**, without having to open or manage the Meta Ads dashboard.
- Create campaigns, set budgets, and define targeting straight from WhatsApp
- Receive performance insights (e.g., CPL spikes, lead quality drops) as chat notifications
- Execute quick actions like **Pause / Resume / Scale** by replying with a keyword

This project combines:
- A **WhatsApp Agent** that stays always-on (QR/worker) to receive and reply to messages.
- A **CRM Workspace** for Inbox, Handover, Orders, Customers, Broadcast, and Workflow (UI mockups to simulate operations).
- An **agentic AI runtime (Openclaw/Hermes)** that can run multi-step workflows, use tools, retain context, and operate across sessions/channels.
- A **closing engine** that executes sales scripts, handles objections, and performs stateful follow-ups (not just a basic Q&A chatbot).

The goal: build an **“ad machine that can close”**—not just generating leads, but converting them into revenue with scalable, agent-driven operations.

## Capture

| WhatsApp Chat Demo | Dashboard Menu |
| --- | --- |
| ![WhatsApp Chat Demo](https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=realistic%20whatsapp%20desktop%20screenshot%20light%20theme%20chat%20conversation%20in%20Indonesian%20between%20user%20and%20crm%20assistant%20messages%20halo%20menu%20list%20campaign%20info%20Pause%20confirmation%20clean%20UI%20high%20detail&image_size=landscape_16_9) | ![Dashboard Menu](https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=realistic%20web%20dashboard%20screenshot%20for%20whatsapp%20crm%20agent%20sidebar%20menu%20items%20Dashboard%20Inbox%20Handover%20Orders%20Pelanggan%20Products%20Broadcast%20Workflow%20AI%20Agents%20Knowledge%20Settings%20orange%20accent%20clean%20modern%20UI%20high%20detail&image_size=landscape_16_9) |

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

## Tutorial WhatsApp (Scan QR + Chat Demo)

Fitur WhatsApp di project ini memakai Baileys (unofficial). Cocok untuk demo/prototyping.

### 1) Jalankan worker + frontend

```bash
npm run dev:all
```

- Frontend default: http://localhost:5173
- Worker default: http://localhost:3001

### 2) Masuk ke aplikasi (Demo Mode)

Jika env InsForge belum diisi, aplikasi akan menampilkan layar “Setup Required”.
- Klik “Continue in Demo Mode”

### 3) Hubungkan WhatsApp via QR

Di aplikasi:
- Buka menu Settings
- Di bagian “WhatsApp Connection”, klik “Connect WhatsApp”
- Akan muncul QR Code

Di WhatsApp (HP):
- Buka WhatsApp → Linked devices (Perangkat tertaut) → Link a device
- Scan QR Code yang tampil di aplikasi

Jika berhasil:
- Status berubah menjadi “Connected”

### 4) Coba chat bot (contoh seperti screenshot)

Setelah WhatsApp tersambung, kamu bisa uji chat dengan cara:
- Gunakan akun WhatsApp lain untuk mengirim pesan ke nomor WhatsApp yang sedang tersambung

Keyword demo yang sudah tersedia di worker:
- `halo` / `hai` / `menu`: menampilkan menu bantuan
- `1` / `info`: contoh insight performa campaign
- `3` / `pause`: contoh aksi “pause campaign”
- `ping`: balasan cepat “pong”

### 5) Troubleshooting

- Tidak muncul QR / status Error:
  - Pastikan worker hidup (`npm run worker` atau `npm run dev:all`)
  - Pastikan port worker `3001` tidak dipakai aplikasi lain
  - Jika tombol “Regenerate QR” tidak bekerja: endpoint yang dipakai adalah `POST http://localhost:3001/regenerate`
- QR kadaluarsa:
  - Klik “Regenerate QR” atau refresh halaman Settings
- Mau reset koneksi (logout paksa):
  - Worker menyimpan session Baileys di folder `worker/auth_info_baileys`
  - Hapus folder tersebut lalu jalankan ulang worker untuk generate QR baru

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
