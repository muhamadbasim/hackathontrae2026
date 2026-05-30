import React, { useEffect, useState } from 'react'
import { Search, Filter, Plus, MoreHorizontal, User, Phone, Mail, MapPin, ChevronRight, Edit2, Trash2, Eye } from 'lucide-react'
import { OpenCrmSectionHeader } from '../components/opencrm/shared'
import { crmApi } from '../lib/api'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'

interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  address?: string
  lead_score: number
  tags: string[]
  status: 'active' | 'inactive' | 'lead' | 'customer'
  last_contact?: string
  total_spent?: number
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    crmApi.listContacts().then((data: any[]) => {
      const mapped = data.map((c: any) => ({
        id: c.id,
        name: c.name,
        phone: c.phone,
        email: c.email || '',
        address: c.address || '',
        lead_score: c.lead_score || 0,
        tags: c.tags || [],
        status: c.status || 'lead',
        last_contact: c.last_contact || '',
        total_spent: c.total_spent || 0
      }))
      setCustomers(mapped)
    })
  }, [])

  const filtered = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.phone.includes(search) ||
                          (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginatedCustomers = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      active: { label: 'Aktif', className: 'bg-green-50 text-green-600 border-green-200' },
      inactive: { label: 'Tidak Aktif', className: 'bg-gray-50 text-gray-600 border-gray-200' },
      lead: { label: 'Lead', className: 'bg-blue-50 text-blue-600 border-blue-200' },
      customer: { label: 'Pelanggan', className: 'bg-purple-50 text-purple-600 border-purple-200' }
    }
    const variant = variants[status] || variants.lead
    return <Badge className={`${variant.className} text-[10px] px-2 py-0.5`}>{variant.label}</Badge>
  }

  const getLeadScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
  }

  return (
    <main className="h-full flex flex-col bg-[#F8F9FA] overflow-hidden">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Autonomous Leads CRM</span>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-gray-900">Pelanggan</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari menu... ⌘K" 
              className="pl-9 pr-4 py-1.5 bg-gray-100 border-transparent rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-primary w-48 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
              <User className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
              <Plus className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">MB</div>
              <span className="text-sm font-medium">Muhamad Basim</span>
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pelanggan</h1>
              <p className="text-sm text-gray-500 mt-1">Kelola database prospek dan pelanggan Anda</p>
            </div>
            <div className="flex items-center gap-2">
              <Button className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button className="flex items-center gap-2 bg-primary">
                <Plus className="w-4 h-4" />
                Tambah Pelanggan
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total Pelanggan</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{customers.length}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Aktif</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{customers.filter(c => c.status === 'active' || c.status === 'customer').length}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Lead Baru</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{customers.filter(c => c.status === 'lead').length}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                  <User className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Rata-rata Skor</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {customers.length > 0 ? Math.round(customers.reduce((sum, c) => sum + c.lead_score, 0) / customers.length) : 0}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Cari nama, nomor telepon, atau email..." 
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {[
                  { value: 'all', label: 'Semua' },
                  { value: 'customer', label: 'Pelanggan' },
                  { value: 'lead', label: 'Lead' },
                  { value: 'active', label: 'Aktif' },
                  { value: 'inactive', label: 'Tidak Aktif' }
                ].map(filter => (
                  <button 
                    key={filter.value}
                    onClick={() => {
                      setStatusFilter(filter.value)
                      setCurrentPage(1)
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap border transition-all ${
                      statusFilter === filter.value 
                        ? 'bg-gray-900 text-white border-gray-900' 
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Customer Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Pelanggan</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kontak</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Lead Score</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Belanja</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tags</th>
                    <th className="text-right px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <User className="w-12 h-12 text-gray-300" />
                          <p className="text-sm text-gray-500">Tidak ada pelanggan ditemukan</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedCustomers.map((customer, index) => (
                      <tr key={customer.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                              {customer.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-gray-900">{customer.name}</p>
                              <p className="text-[10px] text-gray-400">ID: {customer.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Phone className="w-3 h-3" />
                              <span>{customer.phone}</span>
                            </div>
                            {customer.email && (
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Mail className="w-3 h-3" />
                                <span className="truncate max-w-[150px]">{customer.email}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {getStatusBadge(customer.status)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold ${getLeadScoreColor(customer.lead_score)}`}>
                              {customer.lead_score}
                            </span>
                            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${getLeadScoreColor(customer.lead_score).replace('text-', 'bg-')}`}
                                style={{ width: `${customer.lead_score}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm font-bold text-gray-900">
                            {formatCurrency(customer.total_spent || 0)}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {customer.tags.slice(0, 3).map((tag, i) => (
                              <Badge key={i} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 border-0">
                                {tag}
                              </Badge>
                            ))}
                            {customer.tags.length > 3 && (
                              <Badge className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 border-0">
                                +{customer.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors" title="Lihat Detail">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors" title="Edit">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-600 transition-colors" title="Hapus">
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors" title="Menu Lainnya">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between bg-white">
                <p className="text-xs text-gray-500">
                  Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filtered.length)} dari {filtered.length} pelanggan
                </p>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button 
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                        currentPage === page 
                          ? 'bg-gray-900 text-white border-gray-900' 
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </main>
  )
}
