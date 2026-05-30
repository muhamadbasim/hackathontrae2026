import React, { useEffect, useState } from 'react'
import { OpenCrmSectionHeader } from '../components/opencrm/shared'
import { KpiCards } from '../components/KpiCards'
import { CampaignTable } from '../components/CampaignTable'
import { AlertSender } from '../components/AlertSender'
import { CampaignForm } from '../components/CampaignForm'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { crmApi } from '../lib/api'

export default function DashboardPage({ waStatus }: { waStatus: string }) {
  const [metrics, setMetrics] = useState<any>({})
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [showCampaignForm, setShowCampaignForm] = useState(false)

  useEffect(() => {
    crmApi.getDashboardMetrics().then(setMetrics)
    crmApi.listCampaigns().then(setCampaigns)
  }, [])

  const handleCampaignCreated = () => {
    setShowCampaignForm(false)
    crmApi.listCampaigns().then(setCampaigns)
  }

  return (
    <main className="ocm-page">
      <OpenCrmSectionHeader 
        title="Dashboard" 
        subtitle="Pantau performa campaign, CRM signals, dan koneksi WhatsApp." 
        actions={
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">WhatsApp:</span>
            <Badge variant={waStatus === 'Connected' ? 'success' : 'danger'}>{waStatus}</Badge>
            <Button size="sm" onClick={() => setShowCampaignForm(!showCampaignForm)}>
              {showCampaignForm ? 'Tutup Form' : '+ Campaign Baru'}
            </Button>
          </div>
        }
      />

      {showCampaignForm && (
        <div className="mb-8 max-w-xl">
          <CampaignForm 
            onSuccess={handleCampaignCreated}
            onCancel={() => setShowCampaignForm(false)}
          />
        </div>
      )}

      <KpiCards metrics={metrics} />
      
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4">Active Campaigns</h3>
        <CampaignTable campaigns={campaigns} />
      </div>

      <div className="mb-8 max-w-xl">
        <AlertSender />
      </div>
    </main>
  )
}
