import React, { useEffect, useState } from 'react'
import { OpenCrmSectionHeader } from '../components/opencrm/shared'
import { crmApi } from '../lib/api'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { ExternalLink } from 'lucide-react'

export default function AiAgentsPage() {
  const [agents, setAgents] = useState<any[]>([])

  useEffect(() => {
    crmApi.listAiAgents().then(setAgents)
  }, [])

  return (
    <main className="ocm-page">
      <OpenCrmSectionHeader title="AI Agents" subtitle="Kelola agent AI untuk operasional CRM." />
      
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-purple-600 mb-1">Live Preview</div>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono text-gray-700 bg-white px-3 py-2 rounded-lg border border-gray-200 truncate">
                https://crm.basim.id/ai-agents
              </code>
              <a 
                href="https://crm.basim.id/ai-agents" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-2 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                Buka
              </a>
            </div>
          </div>
        </div>
      </div>
      
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
