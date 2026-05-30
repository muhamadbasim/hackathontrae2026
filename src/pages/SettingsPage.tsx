import React from 'react'
import { OpenCrmSectionHeader } from '../components/opencrm/shared'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { hasInsforgeEnv } from '../lib/insforge'
import { WhatsAppQrGate } from '../components/WhatsAppQrGate'

export default function SettingsPage({ waStatus, qrCode }: { waStatus: string, qrCode: string }) {
  return (
    <main className="ocm-page">
      <OpenCrmSectionHeader title="Settings" subtitle="Konfigurasi sistem dan integrasi." />
      
      <div className="ocm-grid-2 mb-8">
        <Card className="p-6">
          <h3 className="font-bold mb-4">WhatsApp Connection</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={waStatus === 'Connected' ? 'success' : 'danger'}>{waStatus}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Worker URL</span>
              <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{import.meta.env.VITE_WA_WORKER_URL || 'http://localhost:3001'}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold mb-4">InsForge Backend</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Environment</span>
              <Badge variant={hasInsforgeEnv ? 'success' : 'warning'}>
                {hasInsforgeEnv ? 'Configured' : 'Missing (Demo Mode)'}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* QR Code component is hidden as requested */}
      {/* waStatus !== 'Connected' && (
        <div className="mb-8">
          <WhatsAppQrGate qrCode={qrCode} status={waStatus} />
        </div>
      ) */}

      <div className="ocm-grid-2">
        <Card className="p-6">
          <h3 className="font-bold mb-4">AI Models</h3>
          <p className="text-sm text-muted-foreground">Model configuration will appear here.</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-bold mb-4">Team</h3>
          <p className="text-sm text-muted-foreground">Team management will appear here.</p>
        </Card>
      </div>
    </main>
  )
}
