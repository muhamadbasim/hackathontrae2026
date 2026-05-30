import React, { useEffect, useState } from 'react'
import { OpenCrmSectionHeader } from '../components/opencrm/shared'
import { crmApi } from '../lib/api'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    crmApi.listProducts().then(setProducts)
  }, [])

  return (
    <main className="ocm-page">
      <OpenCrmSectionHeader title="Products" subtitle="Katalog produk dan layanan." />
      
      <div className="ocm-grid-4">
        {products.map(p => (
          <Card key={p.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold">{p.name}</h3>
              <Badge variant={p.is_active ? 'success' : 'default'}>{p.is_active ? 'Active' : 'Inactive'}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-4">SKU: {p.sku}</p>
            <div className="flex justify-between items-end">
              <p className="font-bold text-primary">Rp {Number(p.price).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Stock: {p.stock}</p>
            </div>
          </Card>
        ))}
      </div>
    </main>
  )
}
