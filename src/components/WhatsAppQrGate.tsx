import React from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Card } from './ui/Card'

export function WhatsAppQrGate({ qrCode, status }: { qrCode: string, status: string }) {
  return (
    <Card className="p-6 flex flex-col items-center justify-center text-center max-w-sm mx-auto">
      <h3 className="text-lg font-bold mb-2">WhatsApp Disconnected</h3>
      <p className="text-sm text-muted-foreground mb-6">Scan QR code below to connect your Baileys worker.</p>
      
      {status === 'Loading' ? (
        <div className="w-64 h-64 flex items-center justify-center bg-muted rounded-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : qrCode ? (
        <div className="p-4 bg-white rounded-xl">
          <QRCodeSVG value={qrCode} size={256} />
        </div>
      ) : (
        <div className="w-64 h-64 flex items-center justify-center bg-muted rounded-xl text-muted-foreground">
          Waiting for QR...
        </div>
      )}
    </Card>
  )
}
