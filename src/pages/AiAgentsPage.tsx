import React, { useEffect, useState } from 'react'
import { OpenCrmSectionHeader } from '../components/opencrm/shared'
import { crmApi } from '../lib/api'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'

export default function AiAgentsPage() {
  const [agents, setAgents] = useState<any[]>([])

  useEffect(() => {
    crmApi.listAiAgents().then(setAgents)
  }, [])

  return (
    <main className="ocm-page">
      <OpenCrmSectionHeader title="AI Agents" subtitle="Kelola agent AI untuk operasional CRM." />
      
      <div className="ocm-grid-3">
        {agents.map(a => (
          <Card key={a.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold">{a.name}</h3>
              <Badge variant={a.is_active ? 'success' : 'default'}>{a.is_active ? 'Active' : 'Inactive'}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{a.description}</p>
            <div className="bg-muted p-3 rounded-md text-xs font-mono">
              Persona: {a.persona}
            </div>
          </Card>
        ))}
      </div>
    </main>
  )
}
