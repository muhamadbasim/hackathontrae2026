import React, { useEffect, useState } from 'react'
import { OpenCrmSectionHeader } from '../components/opencrm/shared'
import { crmApi } from '../lib/api'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Input } from '../components/ui/Input'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    crmApi.listContacts().then(setCustomers)
  }, [])

  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search))

  return (
    <main className="ocm-page">
      <OpenCrmSectionHeader title="Pelanggan" subtitle="Database prospek dan pelanggan." />
      
      <div className="mb-6 max-w-md">
        <Input placeholder="Cari nama atau nomor telepon..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="ocm-grid-3">
        {filtered.map(c => (
          <Card key={c.id} className="p-6">
            <h3 className="font-bold text-lg">{c.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{c.phone}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-muted-foreground">Lead Score</span>
              <span className="font-bold">{c.lead_score}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {c.tags.map((t: string) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </main>
  )
}
