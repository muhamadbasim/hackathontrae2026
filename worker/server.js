require('dotenv').config({ path: '../.env' })
const express = require('express')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')
const pino = require('pino')
const { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys')
const fs = require('fs')

const PORT = process.env.WA_WORKER_PORT || 3001
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'

const hasInsforgeEnv = Boolean(
  process.env.INSFORGE_BASE_URL &&
  process.env.INSFORGE_ANON_KEY &&
  !String(process.env.INSFORGE_BASE_URL).includes('your-project')
)

let insforge = null;
import('@insforge/sdk').then(({ createClient }) => {
  insforge = createClient({
    baseUrl: process.env.INSFORGE_BASE_URL || 'https://demo.insforge.app',
    anonKey: process.env.INSFORGE_ANON_KEY || 'demo-key'
  })
}).catch(e => console.warn('Failed to load InsForge SDK in worker', e.message))

const app = express()
app.use(cors({ origin: FRONTEND_ORIGIN }))
app.use(express.json())

const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: FRONTEND_ORIGIN }
})

let sock = null
let currentStatus = 'Disconnected'
let currentQr = ''

const userState = {} // Simple state management for automation flow

async function startSock() {
  currentStatus = 'Loading'
  io.emit('status', currentStatus)
  
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
  const { version, isLatest } = await fetchLatestBaileysVersion()
  
  sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: 'silent' })
  })
  
  sock.ev.on('creds.update', saveCreds)
  
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update
    
    if (qr) {
      currentQr = qr
      currentStatus = 'Disconnected'
      io.emit('qr', qr)
      io.emit('status', currentStatus)
    }
    
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut
      if (shouldReconnect) {
        startSock()
      } else {
        fs.rmSync('auth_info_baileys', { recursive: true, force: true })
        currentStatus = 'Disconnected'
        io.emit('status', currentStatus)
        startSock()
      }
    } else if (connection === 'open') {
      currentStatus = 'Connected'
      currentQr = ''
      io.emit('status', currentStatus)
      if (hasInsforgeEnv) {
        insforge.database.from('whatsapp_sessions').insert({
          provider: 'baileys',
          status: 'Connected',
          connected_at: new Date().toISOString()
        }).catch(err => console.warn('Failed to insert session', err.message))
      }
    }
  })

  sock.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0]
    if (!msg.message || msg.key.fromMe) return
    
    const remoteJid = msg.key.remoteJid
    const contactPhone = remoteJid.split('@')[0]
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || ''
    const lower = text.toLowerCase()
    
    // InsForge Sync for inbound
    if (hasInsforgeEnv) {
      try {
        const { data: contact } = await insforge.database.from('contacts')
          .insert({ phone: contactPhone, name: msg.pushName || contactPhone, source: 'whatsapp' })
          .select().single()
        
        let contactId = contact?.id
        
        const { data: conv } = await insforge.database.from('conversations')
          .insert({ contact_id: contactId, last_message: text, channel: 'whatsapp', provider: 'baileys' })
          .select().single()
          
        if (conv) {
          await insforge.database.from('messages').insert({
            conversation_id: conv.id,
            contact_id: contactId,
            direction: 'inbound',
            sender_type: 'customer',
            content: text
          })
        }
      } catch (err) {
        console.warn('Insforge inbound sync failed', err.message)
      }
    }

    io.emit('message:new', {
      id: msg.key.id,
      conversationId: 'temp',
      contactPhone,
      direction: 'inbound',
      content: text,
      createdAt: new Date().toISOString()
    })

    // Bot automation flow
    let replyText = ''
    
    if (lower === 'ping') {
      replyText = 'pong'
    } else if (['menu', 'halo', 'hai'].includes(lower)) {
      replyText = `Halo! Saya Autonomous CRM Agent.\n\nPilih menu:\n1. Info performa campaign\n2. Buat campaign baru\n3. Pause ad bermasalah\n\nBalas angka atau keyword.`
    } else if (lower === '1' || lower === 'info') {
      replyText = `⚠️ Alert CRM + Ads:\nCPL campaign "Diskon Umum" naik 37% dibanding baseline.\nLead qualified turun ke 42%.\n\nRekomendasi: balas "Pause" untuk menghentikan creative bermasalah.`
    } else if (lower === '2' || lower === 'buat') {
      userState[remoteJid] = { step: 'awaiting_budget' }
      replyText = `Baik, kita buat campaign baru.\nBerapa budget harian? Contoh: 150000`
    } else if (userState[remoteJid]?.step === 'awaiting_budget' && (/\d{4,}/.test(lower) || lower.includes('ribu'))) {
      userState[remoteJid].budget = lower
      userState[remoteJid].step = 'awaiting_audience'
      replyText = `Budget tercatat.\nSiapa target audiensnya? Contoh: Wanita 25-35, Jakarta.`
    } else if (userState[remoteJid]?.step === 'awaiting_audience' && ['pria', 'wanita', 'indonesia', 'jakarta', 'bandung', 'surabaya'].some(w => lower.includes(w))) {
      userState[remoteJid].audience = text
      userState[remoteJid].step = 'awaiting_launch'
      replyText = `Draft Campaign:\nObjective: Leads\nAudience: sesuai input Anda\nCopy: Dapatkan penawaran terbaik hari ini. Klik WhatsApp untuk konsultasi gratis.\n\nBalas "Launch" untuk menjalankan campaign.`
    } else if (lower === 'launch' && userState[remoteJid]?.step === 'awaiting_launch') {
      replyText = `🚀 Campaign berhasil diluncurkan ke Meta Ads!\nSaya akan pantau CPL dan kualitas leads secara otomatis.`
      
      if (hasInsforgeEnv) {
        await insforge.database.from('campaigns').insert({
          name: `AI Campaign - ${userState[remoteJid].audience || 'Auto'}`,
          objective: 'Leads',
          status: 'Healthy',
          spend: 0,
          leads: 0,
          flag: `Budget: ${userState[remoteJid].budget || 'Unknown'}`
        }).catch(err => console.warn('Insforge insert campaign failed', err.message))
      }
      delete userState[remoteJid]
    } else if (lower === '3' || lower === 'pause') {
      replyText = `✅ Done! Creative 'Diskon Umum' telah di-pause.\nSaya akan terus memantau campaign lainnya.`
    } else {
      replyText = `Saya belum paham. Balas "menu" untuk melihat pilihan yang tersedia.`
    }

    if (replyText) {
      await sock.sendMessage(remoteJid, { text: replyText })
      
      if (hasInsforgeEnv) {
        try {
          await insforge.database.from('messages').insert({
            direction: 'outbound',
            sender_type: 'bot',
            content: replyText
          })
        } catch (err) {
          console.warn('Insforge outbound sync failed', err.message)
        }
      }
    }
  })
}

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'baileys-insforge-worker' })
})

app.get('/status', (req, res) => {
  res.json({ status: currentStatus })
})

app.post('/alert', async (req, res) => {
  const { number, message } = req.body
  if (!number || !message) return res.status(400).json({ error: 'Missing number or message' })
  
  let normalized = number.replace(/\D/g, '')
  if (normalized.startsWith('0')) {
    normalized = '62' + normalized.slice(1)
  }
  
  const jid = `${normalized}@s.whatsapp.net`
  
  try {
    if (sock && currentStatus === 'Connected') {
      await sock.sendMessage(jid, { text: message })
      
      if (hasInsforgeEnv) {
        await insforge.database.from('whatsapp_alerts').insert({
          target_number: normalized,
          message,
          status: 'sent'
        }).catch(e => console.warn('Alert insert failed', e.message))
      }
      
      io.emit('alert:sent', { number: normalized, message })
      res.json({ success: true })
    } else {
      res.status(503).json({ error: 'WhatsApp not connected' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Start socket immediately
startSock()

server.listen(PORT, () => {
  console.log(`Worker listening on port ${PORT}`)
})