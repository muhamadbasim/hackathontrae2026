const { createWhatsAppGenerator } = require('./whatsapp-generator')

const wa = createWhatsAppGenerator({
  authDir: './whatsapp_session',
  printQRInTerminal: true
})

wa.setCallback('onQR', (qr) => {
  console.log('📱 QR Code Received:', qr)
})

wa.setCallback('onStatus', (status) => {
  console.log('📊 Status:', status)
})

wa.setCallback('onConnected', () => {
  console.log('✅ WhatsApp Connected!')
  
  wa.sendTextMessage('6281234567890@s.whatsapp.net', 'Halo dari OpenCRM Bot!')
    .then(() => console.log('✅ Message sent'))
    .catch(err => console.error('❌ Failed:', err))
})

wa.setCallback('onDisconnected', () => {
  console.log('⚠️ WhatsApp Disconnected')
})

wa.setCallback('onMessage', (msg) => {
  console.log('💬 Message from:', msg.pushName || 'Unknown')
  const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || ''
  console.log('📝 Content:', text)
})

async function main() {
  console.log('🚀 Starting WhatsApp Generator...')
  await wa.generate()
}

main().catch(console.error)

setTimeout(() => {
  console.log('\n📋 Available Methods:')
  console.log('- wa.getStatus()')
  console.log('- wa.sendTextMessage(jid, text)')
  console.log('- wa.sendBulkMessages(numbers, message)')
  console.log('- wa.disconnect()')
}, 2000)
