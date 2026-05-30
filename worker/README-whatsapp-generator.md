# WhatsApp Generator Module

Modul generator WhatsApp menggunakan library **Baileys** untuk koneksi WhatsApp Web.

## Fitur

- **QR Code Generation** - Generate QR code untuk autentikasi WhatsApp
- **Auto Reconnect** - Otomatis reconnect jika koneksi terputus
- **Multi-Device Support** - Mendukung banyak sesi dengan direktori auth berbeda
- **Send Messages** - Kirim teks, gambar, dan pesan bulk
- **Event Callbacks** - Callback untuk QR, status, pesan, dll

## Instalasi

Modul ini sudah termasuk dalam dependencies project:
```json
"@whiskeysockets/baileys": "^7.0.0-rc13"
```

## Usage

### Basic Usage

```javascript
const { createWhatsAppGenerator } = require('./whatsapp-generator')

const wa = createWhatsAppGenerator()

wa.setCallback('onQR', (qr) => {
  console.log('QR Code:', qr)
})

wa.setCallback('onConnected', () => {
  console.log('Connected!')
})

await wa.generate()
```

### Send Text Message

```javascript
const jid = '6281234567890@s.whatsapp.net'
await wa.sendTextMessage(jid, 'Halo dari Bot!')
```

### Send Bulk Messages

```javascript
const numbers = ['6281234567890', '6289876543210']
const results = await wa.sendBulkMessages(numbers, 'Pesan broadcast')
console.log(results)
```

### Get Status

```javascript
const status = wa.getStatus()
console.log(status)
// { status: 'Connected', hasQR: false, isConnected: true }
```

## Callbacks

| Event | Description |
|-------|-------------|
| `onQR` | Dipanggil saat QR code di-generate |
| `onStatus` | Dipanggil saat status berubah |
| `onConnected` | Dipanggil saat berhasil terhubung |
| `onDisconnected` | Dipanggil saat terputus |
| `onMessage` | Dipanggil saat ada pesan masuk |
| `onCredsUpdate` | Dipanggil saat credentials di-update |
| `onError` | Dipanggil saat ada error |

## Status Codes

| Status | Description |
|--------|-------------|
| `Loading` | Sedang memuat |
| `QR_Ready` | QR code siap di-scan |
| `Connected` | Berhasil terhubung |
| `Reconnecting` | Sedang reconnect |
| `Logged_Out` | Terlogout, butuh scan ulang |
| `Disconnected` | Terputus |
| `Error` | Error terjadi |

## API Reference

### `createWhatsAppGenerator(options)`

Buat instance WhatsApp generator.

**Options:**
- `authDir` - Direktori penyimpanan auth (default: `./auth_info_baileys`)
- `printQRInTerminal` - Print QR di terminal (default: `true`)
- `logger` - Pino logger instance

### `wa.generate()`

Mulai generate WhatsApp session dan QR code.

### `wa.sendTextMessage(jid, text)`

Kirim pesan teks.

### `wa.sendImageMessage(jid, imageBuffer, caption)`

Kirim pesan gambar.

### `wa.sendBulkMessages(numbers, message)`

Kirim pesan ke banyak nomor.

### `wa.formatJid(phone)`

Format nomor telepon ke format JID WhatsApp.

### `wa.disconnect()`

Putuskan koneksi WhatsApp.

### `wa.clearAuth()`

Hapus data autentikasi.

### `wa.getStatus()`

Ambil status koneksi saat ini.

## Example

Jalankan contoh lengkap:

```bash
cd worker
node example-usage.js
```
