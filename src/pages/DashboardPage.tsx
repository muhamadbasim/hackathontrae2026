import React, { useEffect, useState } from 'react'
import { OpenCrmSectionHeader } from '../components/opencrm/shared'
import { KpiCards } from '../components/KpiCards'
import { CampaignTable } from '../components/CampaignTable'
import { AlertSender } from '../components/AlertSender'
import { Badge } from '../components/ui/Badge'
import { crmApi } from '../lib/api'

export default function DashboardPage({ waStatus }: { waStatus: string }) {
  const [metrics, setMetrics] = useState<any>({})
  const [campaigns, setCampaigns] = useState<any[]>([])

  useEffect(() => {
    crmApi.getDashboardMetrics().then(setMetrics)
    crmApi.listCampaigns().then(setCampaigns)
  }, [])

  return (
    <main className="ocm-page">
      <OpenCrmSectionHeader 
        title="Dashboard" 
        subtitle="Pantau performa campaign, CRM signals, dan koneksi WhatsApp." 
        actions={
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">WhatsApp:</span>
            <Badge variant={waStatus === 'Connected' ? 'success' : 'danger'}>{waStatus}</Badge>
          </div>
        }
      />

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
