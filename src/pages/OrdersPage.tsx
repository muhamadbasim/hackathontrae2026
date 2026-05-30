import React, { useEffect, useState } from 'react'
import { OpenCrmSectionHeader } from '../components/opencrm/shared'
import { crmApi } from '../lib/api'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    crmApi.listOrders().then(setOrders)
  }, [])

  return (
    <main className="ocm-page">
      <OpenCrmSectionHeader title="Orders" subtitle="Daftar pesanan dari pelanggan." />
      
      <div className="ocm-grid-3 mb-8">
        <Card className="p-4"><p className="text-xs text-muted-foreground">Total Orders</p><p className="text-xl font-bold">{orders.length}</p></Card>
        <Card className="p-4"><p className="text-xs text-muted-foreground">Pending</p><p className="text-xl font-bold">{orders.filter(o=>o.order_status==='pending').length}</p></Card>
        <Card className="p-4"><p className="text-xs text-muted-foreground">Revenue</p><p className="text-xl font-bold">Rp {orders.reduce((sum, o)=>sum+(o.order_status==='completed'?Number(o.grand_total):0),0).toLocaleString()}</p></Card>
      </div>

      <Card className="overflow-x-auto">
        <table className="ocm-table w-full text-left">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="p-4">Order Number</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Total</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map(o => (
              <tr key={o.id}>
                <td className="p-4 font-medium">{o.order_number}</td>
                <td className="p-4">{o.contact_id}</td>
                <td className="p-4">Rp {Number(o.grand_total).toLocaleString()}</td>
                <td className="p-4">{o.payment_status}</td>
                <td className="p-4">
                  <Badge variant={o.order_status === 'completed' ? 'success' : o.order_status === 'pending' ? 'warning' : 'default'}>
                    {o.order_status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </main>
  )
}
