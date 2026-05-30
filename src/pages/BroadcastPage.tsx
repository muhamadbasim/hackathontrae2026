import React, { useEffect, useState } from 'react'
import { OpenCrmSectionHeader } from '../components/opencrm/shared'
import { crmApi, waApi } from '../lib/api'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { Button } from '../components/ui/Button'

export default function BroadcastPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [testNumber, setTestNumber] = useState('')
  const [testMsg, setTestMsg] = useState('')

  useEffect(() => {
    crmApi.listBroadcastJobs().then(setJobs)
  }, [])

  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault()
    await waApi.sendAlert({ number: testNumber, message: testMsg })
    alert('Test broadcast sent!')
  }

  return (
    <main className="ocm-page">
      <OpenCrmSectionHeader title="Broadcast" subtitle="Kirim pesan massal ke audiens target." />
      
      <div className="ocm-grid-2 mb-8">
        <Card className="p-6">
          <h3 className="font-bold mb-4">Create Broadcast</h3>
          <form onSubmit={handleTest} className="space-y-4">
            <Input placeholder="Test Phone Number" value={testNumber} onChange={e=>setTestNumber(e.target.value)} required />
            <Textarea placeholder="Broadcast Message" value={testMsg} onChange={e=>setTestMsg(e.target.value)} required />
            <Button type="submit" className="ocm-btn-primary w-full">Send Test Broadcast</Button>
          </form>
        </Card>
      </div>

      <h3 className="font-bold mb-4">Broadcast History</h3>
      <Card className="overflow-x-auto">
        <table className="ocm-table w-full text-left">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Recipients</th>
              <th className="p-4 text-right">Success</th>
              <th className="p-4 text-right">Failed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {jobs.map(j => (
              <tr key={j.id}>
                <td className="p-4 font-medium">{j.title}</td>
                <td className="p-4">
                  <Badge variant={j.status === 'completed' ? 'success' : j.status === 'running' ? 'warning' : 'default'}>
                    {j.status}
                  </Badge>
                </td>
                <td className="p-4 text-right">{j.total_recipients}</td>
                <td className="p-4 text-right text-green-600">{j.success_count}</td>
                <td className="p-4 text-right text-red-600">{j.failed_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </main>
  )
}
