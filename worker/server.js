require('dotenv').config({ path: '../.env' })
const express = require('express')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')
const pino = require('pino')
const { createWhatsAppGenerator } = require('./whatsapp-generator')

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

const userState = {}

const wa = createWhatsAppGenerator({
  authDir: './auth_info_baileys',
  printQRInTerminal: true,
  logger: pino({ level: 'silent' })
})

io.on('connection', (socket) => {
  console.log('New socket client connected')
  const status = wa.getStatus()
  socket.emit('status', status.status)
  if (wa.qr) {
    socket.emit('qr', wa.qr)
  }
})

wa.setCallback('onQR', (qr) => {
  io.emit('qr', qr)
})

wa.setCallback('onStatus', (status) => {
  io.emit('status', status)
  
  if (status === 'Connected' && hasInsforgeEnv) {
    insforge.database.from('whatsapp_sessions').insert({
      provider: 'baileys',
      status: 'Connected',
      connected_at: new Date().toISOString()
    }).catch(err => console.warn('Failed to insert session', err.message))
  }
})

wa.setCallback('onMessage', async (msg) => {
  const remoteJid = msg.key.remoteJid
  const contactPhone = remoteJid.split('@')[0]
  const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || ''
  const lower = text.toLowerCase()
  
  if (hasInsforgeEnv) {
    try {
      await insforge.database.from('contacts')
        .insert({ phone: contactPhone, name: msg.pushName || contactPhone, source: 'whatsapp' })
        .select()
      
      await insforge.database.from('conversations')
        .insert({ contact_id: null, last_message: text, channel: 'whatsapp', provider: 'baileys' })
        .select()
      
      await insforge.database.from('messages').insert({
        direction: 'inbound',
        sender_type: 'customer',
        content: text
      })
    } catch (err) {
      console.warn('Insforge sync failed', err.message)
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

  let replyText = ''
  
  if (lower === 'ping') {
    replyText = 'pong'
  } else if (['menu', 'halo', 'hai'].includes(lower)) {
    replyText = `Halo! 👋 Saya asisten CRM kamu. Ada yang bisa saya bantu hari ini?\n\nKamu bisa coba beberapa hal ini:\n1. Cek performa campaign\n2. Buat campaign baru\n3. Pause ad yang bermasalah\n\nBalas angka atau keyword aja ya.`
  } else if (lower === '1' || lower === 'info') {
    replyText = `Eh, ada info penting nih! ⚠️\n\nCPL buat campaign "Diskon Umum" lagi naik 37% dari biasanya, terus lead qualified-nya malah turun ke 42%.\n\nMending kita "Pause" aja dulu gimana? Biar budgetnya nggak boncos.`
  } else if (lower === '2' || lower === 'buat') {
    userState[remoteJid] = { step: 'awaiting_budget' }
    replyText = `Siap, ayo kita bikin campaign baru! 🚀\n\nKira-kira mau pasang budget berapa per harinya? Kasih tau aja angkanya, misal 150000.`
  } else if (userState[remoteJid]?.step === 'awaiting_budget' && (/\d{4,}/.test(lower) || lower.includes('ribu'))) {
    userState[remoteJid].budget = lower
    userState[remoteJid].step = 'awaiting_audience'
    replyText = `Oke, budget udah dicatat ya. 👌\n\nTerus, siapa nih target audiensnya? Kasih tau kriteria spesifiknya, misal: Wanita 25-35 di Jakarta.`
  } else if (userState[remoteJid]?.step === 'awaiting_audience' && ['pria', 'wanita', 'indonesia', 'jakarta', 'bandung', 'surabaya'].some(w => lower.includes(w))) {
    userState[remoteJid].audience = text
    userState[remoteJid].step = 'awaiting_launch'
    replyText = `Sip! Ini draft campaign-nya:\n\n🎯 Objective: Leads\n👥 Audience: sesuai yang kamu minta tadi\n📝 Copy: "Dapatkan penawaran terbaik hari ini. Klik WhatsApp untuk konsultasi gratis."\n\nKalau udah oke, balas "Launch" ya buat kita jalanin sekarang.`
  } else if (lower === 'launch' && userState[remoteJid]?.step === 'awaiting_launch') {
    replyText = `🚀 Mantap! Campaign-nya udah jalan di Meta Ads ya.\n\nTenang aja, bakal aku pantau terus CPL sama kualitas lead-nya secara otomatis. Nanti aku kabarin kalau ada apa-apa!`
    
    if (hasInsforgeEnv) {
      await insforge.database.from('campaigns').insert({
        name: `AI Campaign - ${userState[remoteJid].audience || 'Auto'}`,
        objective: 'Leads',
        status: 'Healthy',
        spend: 0,
        leads: 0,
        flag: `Budget: ${userState[remoteJid].budget || 'Unknown'}`
      }).catch(err => console.warn('Campaign insert failed', err.message))
    }
    delete userState[remoteJid]
  } else if (lower === '3' || lower === 'pause') {
    replyText = `✅ Siap, creative 'Diskon Umum' udah aku pause ya.\n\nAku lanjut pantau campaign lainnya, kalau ada kendala lagi langsung aku infoin!`
  } else {
    replyText = `Aduh, maaf ya aku kurang paham maksudnya. 😅\n\nBoleh balas "menu" aja biar kita liat apa aja yang bisa aku bantu?`
  }

  if (replyText) {
    await wa.sendTextMessage(remoteJid, replyText)
    
    if (hasInsforgeEnv) {
      await insforge.database.from('messages').insert({
        direction: 'outbound',
        sender_type: 'bot',
        content: replyText
      }).catch(err => console.warn('Outbound sync failed', err.message))
    }
  }
})

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'baileys-insforge-worker' })
})

app.get('/status', (req, res) => {
  res.json(wa.getStatus())
})

app.post('/alert', async (req, res) => {
  const { number, message } = req.body
  if (!number || !message) return res.status(400).json({ error: 'Missing number or message' })
  
  const jid = wa.formatJid(number)
  
  try {
    if (wa.getStatus().isConnected) {
      await wa.sendTextMessage(jid, message)
      
      if (hasInsforgeEnv) {
        await insforge.database.from('whatsapp_alerts').insert({
          target_number: number.replace(/\D/g, ''),
          message,
          status: 'sent'
        }).catch(e => console.warn('Alert insert failed', e.message))
      }
      
      io.emit('alert:sent', { number, message })
      res.json({ success: true })
    } else {
      res.status(503).json({ error: 'WhatsApp not connected' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/regenerate', async (req, res) => {
  wa.disconnect()
  wa.clearAuth()
  await wa.generate()
  res.json({ success: true, status: 'regenerating' })
})

wa.generate().then(result => {
  if (result.success) {
    console.log('✅ WhatsApp Generator started successfully')
  } else {
    console.error('❌ WhatsApp Generator failed:', result.error)
  }
})

server.listen(PORT, () => {
  console.log(`Worker listening on port ${PORT}`)
})
