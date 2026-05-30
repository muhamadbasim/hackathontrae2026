import React, { useEffect, useState } from 'react'
import { OpenCrmSectionHeader } from '../components/opencrm/shared'
import { crmApi } from '../lib/api'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'

export default function WorkflowPage() {
  const [flows, setFlows] = useState<any[]>([])

  useEffect(() => {
    crmApi.listFlows().then(setFlows)
  }, [])

  return (
    <main className="ocm-page">
      <OpenCrmSectionHeader title="Workflow" subtitle="Automasi CRM dan integrasi Ads." />
      
      <div className="ocm-grid-3">
        {flows.map(f => (
          <Card key={f.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold">{f.name}</h3>
              <Badge variant={f.active ? 'success' : 'default'}>{f.active ? 'Active' : 'Inactive'}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{f.description}</p>
          </Card>
        ))}
      </div>
    </main>
  )
}
