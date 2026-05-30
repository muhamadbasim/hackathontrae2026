const { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys')
const NodeCache = require('node-cache')
const pino = require('pino')
const fs = require('fs')
const path = require('path')

class WhatsAppGenerator {
  constructor(options = {}) {
    this.authDir = options.authDir || './auth_info_baileys'
    this.printQRInTerminal = options.printQRInTerminal ?? true
    this.msgRetryCounterCache = new NodeCache()
    this.sock = null
    this.status = 'Disconnected'
    this.qr = ''
    this.logger = options.logger || pino({ level: 'silent' })
    this.callbacks = {
      onQR: null,
      onConnected: null,
      onDisconnected: null,
      onMessage: null,
      onCredsUpdate: null
    }
  }

  setCallback(event, callback) {
    if (this.callbacks.hasOwnProperty(event)) {
      this.callbacks[event] = callback
    }
  }

  async generate() {
    try {
      this.status = 'Loading'
      this.emit('status', this.status)

      const { state, saveCreds } = await useMultiFileAuthState(this.authDir)
      const { version, isLatest } = await fetchLatestBaileysVersion()

      this.sock = makeWASocket({
        version,
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, this.logger),
        },
        printQRInTerminal: this.printQRInTerminal,
        msgRetryCounterCache: this.msgRetryCounterCache,
        logger: this.logger,
        defaultQuotaTimeout: 60 * 1000
      })

      this.sock.ev.on('creds.update', async () => {
        await saveCreds()
        if (this.callbacks.onCredsUpdate) {
          this.callbacks.onCredsUpdate()
        }
      })

      this.sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update
        console.log('Baileys connection update:', { connection, qr: qr ? 'exists' : 'null' })

        if (qr) {
          this.qr = qr
          this.status = 'QR_Ready'
          this.emit('qr', qr)
          this.emit('status', this.status)
        }

        if (connection === 'close') {
          const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut
          
          if (shouldReconnect) {
            this.status = 'Reconnecting'
            this.emit('status', this.status)
            setTimeout(() => this.generate(), 2000)
          } else {
            this.clearAuth()
            this.status = 'Logged_Out'
            this.emit('status', this.status)
            setTimeout(() => this.generate(), 2000)
          }
        } else if (connection === 'open') {
          this.status = 'Connected'
          this.qr = ''
          this.emit('status', this.status)
          if (this.callbacks.onConnected) {
            this.callbacks.onConnected()
          }
        }
      })

      this.sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0]
        if (!msg.message || msg.key.fromMe) return

        if (this.callbacks.onMessage) {
          this.callbacks.onMessage({
            key: msg.key,
            message: msg.message,
            pushName: msg.pushName,
            timestamp: msg.messageTimestamp
          })
        }
      })

      return { success: true, socket: this.sock }
    } catch (error) {
      this.status = 'Error'
      this.emit('status', this.status)
      this.emit('error', error.message)
      return { success: false, error: error.message }
    }
  }

  emit(event, data) {
    if (event === 'qr' && this.callbacks.onQR) {
      this.callbacks.onQR(data)
    } else if (event === 'status' && this.callbacks.onStatus) {
      this.callbacks.onStatus(data)
    }
  }

  async sendTextMessage(jid, text) {
    if (!this.sock || this.status !== 'Connected') {
      throw new Error('WhatsApp not connected')
    }
    return await this.sock.sendMessage(jid, { text })
  }

  async sendImageMessage(jid, imageBuffer, caption = '') {
    if (!this.sock || this.status !== 'Connected') {
      throw new Error('WhatsApp not connected')
    }
    return await this.sock.sendMessage(jid, {
      image: imageBuffer,
      caption
    })
  }

  async sendBulkMessages(numbers, message) {
    const results = []
    for (const number of numbers) {
      try {
        const jid = this.formatJid(number)
        await this.sendTextMessage(jid, message)
        results.push({ number, status: 'sent' })
      } catch (error) {
        results.push({ number, status: 'failed', error: error.message })
      }
    }
    return results
  }

  formatJid(phone) {
    let normalized = phone.replace(/\D/g, '')
    if (normalized.startsWith('0')) {
      normalized = '62' + normalized.slice(1)
    }
    if (!normalized.endsWith('@s.whatsapp.net')) {
      normalized = normalized + '@s.whatsapp.net'
    }
    return normalized
  }

  clearAuth() {
    if (fs.existsSync(this.authDir)) {
      fs.rmSync(this.authDir, { recursive: true, force: true })
    }
  }

  disconnect() {
    if (this.sock) {
      this.sock.end()
      this.sock = null
    }
    this.status = 'Disconnected'
    this.emit('status', this.status)
    if (this.callbacks.onDisconnected) {
      this.callbacks.onDisconnected()
    }
  }

  getStatus() {
    return {
      status: this.status,
      hasQR: !!this.qr,
      isConnected: this.status === 'Connected'
    }
  }
}

function createWhatsAppGenerator(options) {
  return new WhatsAppGenerator(options)
}

module.exports = { WhatsAppGenerator, createWhatsAppGenerator }
