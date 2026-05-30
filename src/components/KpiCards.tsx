import React from 'react'
import { Card } from './ui/Card'

export function KpiCards({ metrics }: { metrics: any }) {
  const cards = [
    { label: 'Total Spend', value: `Rp ${(metrics.spend || 0).toLocaleString('id-ID')}` },
    { label: 'Total Leads', value: metrics.leads || 0 },
    { label: 'Cost per Lead', value: `Rp ${(metrics.cpl || 0).toLocaleString('id-ID')}` },
    { label: 'Qualified Rate', value: `${((metrics.qualifiedRate || 0) * 100).toFixed(1)}%` },
    { label: 'Active Campaigns', value: metrics.activeCampaigns || 0 },
    { label: 'Alerts', value: metrics.alerts || 0 },
  ]

  return (
    <div className="ocm-grid-3 lg:grid-cols-6 mb-8">
      {cards.map((c, i) => (
        <Card key={i} className="p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{c.label}</p>
          <p className="text-xl font-bold">{c.value}</p>
        </Card>
      ))}
    </div>
  )
}
