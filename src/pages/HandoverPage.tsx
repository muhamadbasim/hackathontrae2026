import React, { useEffect, useState } from 'react'
import { OpenCrmSectionHeader } from '../components/opencrm/shared'
import { crmApi } from '../lib/api'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'

export default function HandoverPage() {
  const [requests, setRequests] = useState<any[]>([])

  useEffect(() => {
    crmApi.listHandoverRequests().then(setRequests)
  }, [])

  return (
    <main className="ocm-page">
      <OpenCrmSectionHeader title="Handover Queue" subtitle="Permintaan eskalasi dari AI ke Agent manusia." />
      
      <div className="space-y-4">
        {requests.map(req => (
          <Card key={req.id} className="p-6 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-bold">Conversation: {req.conversation_id}</h3>
                <Badge variant={req.status === 'pending' ? 'warning' : 'success'}>{req.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Reason: {req.ai_reason}</p>
            </div>
            {req.status === 'pending' && (
              <div className="flex gap-2">
                <Button className="ocm-btn-primary">Approve</Button>
                <Button className="border border-input bg-background hover:bg-muted text-foreground">Reject</Button>
              </div>
            )}
          </Card>
        ))}
        {requests.length === 0 && <p className="text-muted-foreground">No handover requests.</p>}
      </div>
    </main>
  )
}
