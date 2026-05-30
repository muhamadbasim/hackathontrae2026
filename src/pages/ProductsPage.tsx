import React, { useEffect, useState } from 'react'
import { OpenCrmSectionHeader } from '../components/opencrm/shared'
import { MOCK_PRODUCTS, PRODUCT_CATEGORIES } from '../data/productsMockData'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Search, Filter, Package, TrendingUp, AlertCircle } from 'lucide-react'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setProducts(MOCK_PRODUCTS)
  }, [])

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const activeProducts = products.filter(p => p.is_active).length
  const outOfStock = products.filter(p => p.stock === 0).length

  return (
    <main className="ocm-page">
      <OpenCrmSectionHeader title="Products" subtitle="Kelola katalog produk dan layanan Anda" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Produk</p>
            <p className="text-2xl font-bold">{products.length}</p>
          </div>
        </Card>
        
        <Card className="p-4 flex items-center gap-3">
          <div className="p-3 bg-green-100 rounded-lg">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Produk Aktif</p>
            <p className="text-2xl font-bold">{activeProducts}</p>
          </div>
        </Card>
        
        <Card className="p-4 flex items-center gap-3">
          <div className="p-3 bg-red-100 rounded-lg">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Stok Habis</p>
            <p className="text-2xl font-bold">{outOfStock}</p>
          </div>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari produk atau SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-background"
          >
            {PRODUCT_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="ocm-grid-4">
        {filteredProducts.map(p => (
          <Card key={p.id} className="p-5 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{p.name}</h3>
                <p className="text-xs text-muted-foreground">SKU: {p.sku}</p>
              </div>
              <Badge variant={p.is_active ? 'success' : 'default'}>
                {p.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {p.description || 'Tidak ada deskripsi'}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline">{p.category}</Badge>
              {p.stock === 0 && (
                <Badge variant="danger">Stok Habis</Badge>
              )}
              {p.stock > 0 && p.stock < 20 && (
                <Badge variant="warning">Stok Rendah</Badge>
              )}
            </div>
            
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Harga</p>
                  <p className="text-xl font-bold text-primary">
                    Rp {Number(p.price).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-1">Stok</p>
                  <p className={`font-semibold ${p.stock === 0 ? 'text-red-600' : 'text-foreground'}`}>
                    {p.stock} {p.unit || 'pcs'}
                  </p>
                </div>
              </div>
              
              {p.min_order && p.min_order > 1 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Min. order: {p.min_order} {p.unit || 'pcs'}
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Tidak ada produk ditemukan</h3>
          <p className="text-muted-foreground">
            Coba ubah filter atau kata kunci pencarian Anda
          </p>
        </Card>
      )}
    </main>
  )
}
