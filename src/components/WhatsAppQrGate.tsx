import React, { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { waSocket } from '../lib/waSocket'

type WhatsAppStatus = 'Loading' | 'Disconnected' | 'Connected' | 'QR_Ready' | 'Reconnecting' | 'Logged_Out' | 'Error'

interface WhatsAppQrGateProps {
  onConnected?: () => void
}

export function WhatsAppQrGate({ onConnected }: WhatsAppQrGateProps) {
  const [status, setStatus] = useState<WhatsAppStatus>('Loading')
  const [qrCode, setQrCode] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    console.log('WhatsAppQrGate mounted')
    waSocket.connect()

    waSocket.on('connect', () => {
      console.log('Socket connected!')
    })

    waSocket.on('status', (s: string) => {
      console.log('Socket status update:', s)
      setStatus(s as WhatsAppStatus)
      if (s === 'Connected') {
        onConnected?.()
      }
    })

    waSocket.on('qr', (qr: string) => {
      console.log('Socket QR received')
      setQrCode(qr)
      setStatus('QR_Ready')
    })

    waSocket.on('connect_error', (err: Error) => {
      setError(err.message)
      setStatus('Error')
    })

    return () => {
      waSocket.off('status')
      waSocket.off('qr')
      waSocket.off('connect_error')
    }
  }, [])

  const handleRegenerate = async () => {
    try {
      const res = await fetch('http://localhost:3001/regenerate', {
        method: 'POST'
      })
      if (res.ok) {
        setQrCode('')
        setStatus('Loading')
      }
    } catch (err) {
      setError('Failed to regenerate QR')
    }
  }

  if (status === 'Connected') {
    return (
      <Card className="p-6 bg-green-50 border-green-200">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="text-green-700 font-medium">WhatsApp Connected</span>
        </div>
      </Card>
    )
  }

  if (error && !qrCode) {
    return (
      <Card className="p-6 bg-red-50 border-red-200">
        <p className="text-red-600 mb-3">Connection Error: {error}</p>
        <Button onClick={handleRegenerate} size="sm">
          Retry Connection
        </Button>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="text-center mb-4">
        <h3 className="font-bold text-lg mb-1">Connect WhatsApp</h3>
        <p className="text-sm text-muted-foreground">
          Scan QR code dengan WhatsApp untuk menghubungkan akun
        </p>
      </div>

      <div className="flex justify-center mb-4">
        {qrCode ? (
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <QRCodeSVG 
              value={qrCode} 
              size={256} 
              level="H"
              includeMargin
            />
          </div>
        ) : (
          <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">
              {status === 'Loading' || status === 'Reconnecting' 
                ? 'Generating QR Code...' 
                : 'Waiting...'}
            </div>
          </div>
        )}
      </div>

      {status === 'QR_Ready' && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-3">
            QR code aktif selama 60 detik. Refresh halaman jika QR kadaluarsa.
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={handleRegenerate} variant="outline" size="sm">
              Regenerate QR
            </Button>
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-muted-foreground">
          <strong>Status:</strong> {status}
        </p>
      </div>
    </Card>
  )
}

export default WhatsAppQrGate
