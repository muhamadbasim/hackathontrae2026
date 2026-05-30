import React, { useEffect, useState } from 'react'
import { OpenCrmSectionHeader } from '../components/opencrm/shared'
import { crmApi } from '../lib/api'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Search, BookOpen, FileText, Database, HelpCircle, MessageSquare, ChevronRight, Plus, RefreshCw } from 'lucide-react'

const KNOWLEDGE_CATEGORIES = [
  { id: 'products', name: 'Produk & Layanan', icon: Package, count: 24, color: 'bg-blue-50 text-blue-600' },
  { id: 'faq', name: 'FAQ', icon: HelpCircle, count: 18, color: 'bg-green-50 text-green-600' },
  { id: 'guides', name: 'Panduan Penggunaan', icon: BookOpen, count: 32, color: 'bg-purple-50 text-purple-600' },
  { id: 'policies', name: 'Kebijakan & Aturan', icon: FileText, count: 12, color: 'bg-orange-50 text-orange-600' },
]

const RECENT_ARTICLES = [
  { id: 1, title: 'Cara Mengatur Auto-Reply WhatsApp', category: 'guides', views: 1250, updated: '2 jam lalu' },
  { id: 2, title: 'Panduan Lengkap Broadcast Message', category: 'guides', views: 980, updated: '5 jam lalu' },
  { id: 3, title: 'FAQ Tagihan & Pembayaran', category: 'faq', views: 756, updated: '1 hari lalu' },
  { id: 4, title: 'Integrasi API WhatsApp Business', category: 'products', views: 1820, updated: '2 hari lalu' },
  { id: 5, title: 'Kebijakan Privasi & Keamanan Data', category: 'policies', views: 543, updated: '3 hari lalu' },
]

function Package({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  )
}

export default function KnowledgePage() {
  const [sources, setSources] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [testQuery, setTestQuery] = useState('')
  const [testResults, setTestResults] = useState<any[]>([])

  useEffect(() => {
    crmApi.listKnowledgeSources().then(setSources)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    setTimeout(() => {
      setIsSearching(false)
    }, 500)
  }

  const handleTestSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setTestResults([
      { title: 'Contoh hasil pencarian RAG', snippet: 'Ini adalah hasil pencarian dari knowledge base...', score: 0.92 },
      { title: 'Artikel terkait lainnya', snippet: 'Informasi tambahan yang relevan dengan query...', score: 0.85 },
    ])
  }

  const filteredArticles = RECENT_ARTICLES.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (!selectedCategory || article.category === selectedCategory)
  )

  return (
    <main className="ocm-page">
      <OpenCrmSectionHeader 
        title="Knowledge Base" 
        subtitle="Pusat pengetahuan dan dokumentasi untuk RAG (Retrieval-Augmented Generation)." 
      />
      
      <div className="mb-8">
        <form onSubmit={handleSearch} className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari artikel, panduan, atau jawaban..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2" disabled={isSearching}>
            {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Cari'}
          </Button>
        </form>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" />
          Kategori Pengetahuan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {KNOWLEDGE_CATEGORIES.map(cat => {
            const Icon = cat.icon
            return (
              <Card 
                key={cat.id} 
                className={`p-5 cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 ${
                  selectedCategory === cat.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${cat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <Badge variant="secondary">{cat.count} artikel</Badge>
                </div>
                <h3 className="font-semibold text-sm mb-1">{cat.name}</h3>
                <p className="text-xs text-muted-foreground">Klik untuk melihat</p>
              </Card>
            )
          })}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Artikel Terbaru
        </h2>
        <div className="space-y-3">
          {filteredArticles.map(article => (
            <Card key={article.id} className="p-4 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs">{article.category}</Badge>
                    <span className="text-xs text-muted-foreground">{article.updated}</span>
                  </div>
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{article.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{article.views.toLocaleString()} views</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Tambah Sumber Teks
            </h3>
          </div>
          <form className="space-y-4" onSubmit={e=>e.preventDefault()}>
            <Input placeholder="Judul artikel..." required />
            <textarea className="ocm-textarea" placeholder="Konten artikel..." required rows={4}></textarea>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Simpan</Button>
              <Button type="button" variant="outline">Batal</Button>
            </div>
          </form>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Uji Pencarian RAG
            </h3>
          </div>
          <form className="space-y-4" onSubmit={handleTestSearch}>
            <Input 
              placeholder="Query pencarian..." 
              required 
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
            />
            <Button type="submit" className="w-full">Test Pencarian</Button>
          </form>
          {testResults.length > 0 && (
            <div className="mt-4 space-y-2">
              {testResults.map((result, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">{result.title}</span>
                    <Badge variant="success">{Math.round(result.score * 100)}%</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{result.snippet}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" />
          Sumber Knowledge
        </h2>
        <Card className="overflow-x-auto">
          <table className="ocm-table w-full text-left">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="p-4 font-semibold">Judul</th>
                <th className="p-4 font-semibold">Tipe</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sources.length > 0 ? sources.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">{s.title}</td>
                  <td className="p-4 text-muted-foreground uppercase text-xs">{s.type}</td>
                  <td className="p-4">
                    <Badge variant={s.status === 'ready' ? 'success' : 'warning'}>{s.status}</Badge>
                  </td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    <Database className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p>Belum ada sumber knowledge</p>
                    <p className="text-xs mt-1">Tambahkan sumber pertama Anda di atas</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </main>
  )
}
