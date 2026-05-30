import React from 'react'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'

export function CampaignTable({ campaigns }: { campaigns: any[] }) {
  return (
    <Card className="overflow-x-auto">
      <table className="ocm-table w-full text-left">
        <thead className="bg-muted/50 text-muted-foreground border-b border-border">
          <tr>
            <th className="p-4 font-medium">Campaign Name</th>
            <th className="p-4 font-medium">Objective</th>
            <th className="p-4 font-medium text-right">Spend</th>
            <th className="p-4 font-medium text-right">Leads</th>
            <th className="p-4 font-medium text-right">CPL</th>
            <th className="p-4 font-medium">Status</th>
            <th className="p-4 font-medium">Flag</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {campaigns.map(c => (
            <tr key={c.id} className="hover:bg-muted/50 transition-colors">
              <td className="p-4 font-medium">{c.name}</td>
              <td className="p-4 text-muted-foreground">{c.objective}</td>
              <td className="p-4 text-right">Rp {Number(c.spend).toLocaleString('id-ID')}</td>
              <td className="p-4 text-right">{c.leads}</td>
              <td className="p-4 text-right">Rp {Number(c.cpl).toLocaleString('id-ID')}</td>
              <td className="p-4">
                <Badge variant={c.status === 'Healthy' ? 'success' : c.status === 'Warning' ? 'danger' : 'warning'}>
                  {c.status}
                </Badge>
              </td>
              <td className="p-4 text-muted-foreground text-sm">{c.flag}</td>
            </tr>
          ))}
          {campaigns.length === 0 && (
            <tr>
              <td colSpan={7} className="p-4 text-center text-muted-foreground">No campaigns found</td>
            </tr>
          )}
        </tbody>
      </table>
    </Card>
  )
}
