import React, { useEffect, useState } from 'react'
import { OpenCrmSectionHeader } from '../components/opencrm/shared'
import { crmApi } from '../lib/api'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

export default function KnowledgePage() {
  const [sources, setSources] = useState<any[]>([])

  useEffect(() => {
    crmApi.listKnowledgeSources().then(setSources)
  }, [])

  return (
    <main className="ocm-page">
      <OpenCrmSectionHeader title="Knowledge Base" subtitle="Sumber data untuk RAG (Retrieval-Augmented Generation)." />
      
      <div className="ocm-grid-2 mb-8">
        <Card className="p-6">
          <h3 className="font-bold mb-4">Add Text Source</h3>
          <form className="space-y-4" onSubmit={e=>e.preventDefault()}>
            <Input placeholder="Title" required />
            <textarea className="ocm-textarea" placeholder="Content text..." required></textarea>
            <Button type="submit" className="ocm-btn-primary">Add Source</Button>
          </form>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-bold mb-4">Retrieval Test</h3>
          <form className="space-y-4" onSubmit={e=>e.preventDefault()}>
            <Input placeholder="Search query..." required />
            <Button className="border border-input hover:bg-muted w-full text-foreground bg-background">Test Search</Button>
          </form>
        </Card>
      </div>

      <h3 className="font-bold mb-4">Knowledge Sources</h3>
      <Card className="overflow-x-auto">
        <table className="ocm-table w-full text-left">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Type</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sources.map(s => (
              <tr key={s.id}>
                <td className="p-4 font-medium">{s.title}</td>
                <td className="p-4 text-muted-foreground uppercase text-xs">{s.type}</td>
                <td className="p-4">
                  <Badge variant={s.status === 'ready' ? 'success' : 'warning'}>{s.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </main>
  )
}
