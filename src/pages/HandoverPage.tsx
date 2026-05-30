import React, { useState } from 'react'
import { Search, Filter, Plus, Clock, Check, X, User, Bot, AlertTriangle, ChevronRight, ArrowRight, Zap } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { MOCK_HANDOVER_REQUESTS, HANDOVER_STATS } from '../data/handoverMockData'

export default function HandoverPage() {
  const [requests, setRequests] = useState(MOCK_HANDOVER_REQUESTS)
  const [activeTab, setActiveTab] = useState('Semua')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         req.conversationId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === 'Semua' || 
                      (activeTab === 'Pending' && req.status === 'pending') ||
                      (activeTab === 'Approved' && req.status === 'approved') ||
                      (activeTab === 'Rejected' && req.status === 'rejected')
    return matchesSearch && matchesTab
  })

  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' as const, assignedTo: 'Anda', assignedToAvatar: 'AN' } : r))
  }

  const handleReject = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' as const } : r))
  }

  return (
    <main className="h-full flex flex-col bg-[#F8F9FA] overflow-hidden">
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Autonomous Leads CRM</span>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-gray-900">Handover Queue</span>
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
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><Bot className="w-5 h-5" /></button>
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><Plus className="w-5 h-5" /></button>
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">MB</div>
              <span className="text-sm font-medium">Muhamad Basim</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold text-gray-900">HANDOVER QUEUE</h1>
              <Badge variant="warning" className="text-[10px] px-2 py-0.5 bg-yellow-100 text-yellow-700 border-0">{HANDOVER_STATS.pending} Pending</Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Avg. Wait: <span className="font-bold text-gray-900">{HANDOVER_STATS.avgWaitTime}</span></span>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><Filter className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="px-6 py-4 bg-white border-b border-gray-100">
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Cari percakapan..." 
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {[
                { label: 'Semua', count: requests.length },
                { label: 'Pending', count: requests.filter(r => r.status === 'pending').length },
                { label: 'Approved', count: requests.filter(r => r.status === 'approved').length },
                { label: 'Rejected', count: requests.filter(r => r.status === 'rejected').length },
              ].map(tab => (
                <button 
                  key={tab.label}
                  onClick={() => setActiveTab(tab.label)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === tab.label 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
            {filteredRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <User className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-sm font-medium">Tidak ada permintaan handover</p>
              </div>
            ) : (
              filteredRequests.map(req => (
                <Card key={req.id} className="overflow-hidden border border-gray-100 hover:border-gray-200 transition-all">
                  <div className={`p-4 border-b border-gray-50 flex items-center justify-between ${
                    req.priority === 'urgent' ? 'bg-red-50' : 
                    req.priority === 'high' ? 'bg-orange-50' : 'bg-white'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${req.avatarColor} flex items-center justify-center text-white text-xs font-bold`}>
                        {req.customerAvatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900">{req.customerName}</h3>
                          <span className="text-[10px] text-gray-400 font-mono">{req.conversationId}</span>
                          {req.priority === 'urgent' && (
                            <Badge variant="danger" className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-600 border-0 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Urgent
                            </Badge>
                          )}
                          {req.priority === 'high' && (
                            <Badge variant="warning" className="text-[10px] px-1.5 py-0.5 bg-orange-100 text-orange-600 border-0">
                              High
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                          <span>{req.customerPhone}</span>
                          <span>•</span>
                          <Clock className="w-3 h-3" />
                          <span>{req.waitingTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={`text-[10px] px-2 py-0.5 ${
                          req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          req.status === 'approved' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-500'
                        } border-0`}
                      >
                        {req.status === 'pending' ? '⏳ Pending' :
                         req.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                      </Badge>
                      {req.status === 'pending' ? (
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><Filter className="w-4 h-4" /></button>
                      ) : req.status === 'approved' && req.assignedTo ? (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-[8px] font-bold">
                            {req.assignedToAvatar}
                          </div>
                          <span className="text-xs font-bold text-green-700">{req.assignedTo}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-gray-700 mb-1">ALASAN HANDOVER</p>
                        <p className="text-sm text-gray-600">{req.reason}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                        <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">AI SUMMARY</span>
                      </div>
                      <p className="text-xs text-orange-800">{req.aiSummary}</p>
                    </div>

                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-3.5 h-3.5 text-gray-500" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">LAST MESSAGE</span>
                      </div>
                      <p className="text-xs text-gray-600 italic">"{req.lastMessage}"</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {req.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {req.status === 'pending' && (
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                      <button 
                        onClick={() => handleReject(req.id)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 transition-all flex items-center gap-2"
                      >
                        <X className="w-4 h-4" /> Tolak
                      </button>
                      <button 
                        onClick={() => handleApprove(req.id)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary/90 transition-all flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" /> Terima & Ambil
                      </button>
                    </div>
                  )}

                  {req.status === 'approved' && (
                    <div className="px-4 py-3 bg-green-50 border-t border-green-100 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-green-700">
                        <Check className="w-4 h-4" />
                        <span className="font-bold">Diterima oleh {req.assignedTo}</span>
                      </div>
                      <button className="px-3 py-1.5 rounded-lg text-xs font-bold text-primary hover:bg-white transition-all flex items-center gap-2">
                        Buka Percakapan <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {req.status === 'rejected' && (
                    <div className="px-4 py-3 bg-gray-100 border-t border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <X className="w-4 h-4" />
                        <span className="font-bold">Ditolak</span>
                      </div>
                      <button className="text-xs text-gray-500 hover:text-gray-700 underline">Lihat Log</button>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>

        <div className="w-[320px] border-l border-gray-200 bg-white overflow-y-auto no-scrollbar">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-sm mb-4">STATISTIK</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-xl text-center">
                <div className="text-2xl font-bold text-yellow-600">{HANDOVER_STATS.pending}</div>
                <div className="text-[10px] text-yellow-700 font-medium uppercase tracking-wider">Pending</div>
              </div>
              <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-center">
                <div className="text-2xl font-bold text-green-600">{HANDOVER_STATS.approved}</div>
                <div className="text-[10px] text-green-700 font-medium uppercase tracking-wider">Approved</div>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-center">
                <div className="text-2xl font-bold text-gray-600">{HANDOVER_STATS.rejected}</div>
                <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Rejected</div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-center">
                <div className="text-2xl font-bold text-blue-600">{HANDOVER_STATS.avgWaitTime}</div>
                <div className="text-[10px] text-blue-700 font-medium uppercase tracking-wider">Avg. Wait</div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h2 className="font-bold text-gray-900 text-sm mb-4">AKSI CEPAT</h2>
            <div className="space-y-2">
              <button className="w-full p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">Ambil Semua Pending</div>
                  <div className="text-[10px] text-gray-500">Assign semua ke saya</div>
                </div>
              </button>
              <button className="w-full p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">Tutup Session Selesai</div>
                  <div className="text-[10px] text-gray-500">Clear approved yang old</div>
                </div>
              </button>
              <button className="w-full p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                  <X className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">Reject Semua Spam</div>
                  <div className="text-[10px] text-gray-500">Bulk reject flagged</div>
                </div>
              </button>
            </div>
          </div>

          <div className="p-6 border-t border-gray-100">
            <h2 className="font-bold text-gray-900 text-sm mb-4">TIP & PANDUAN</h2>
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-blue-500 fill-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-blue-800 mb-1">AI Handover Best Practice</p>
                  <p className="text-[10px] text-blue-700 leading-relaxed">
                    Handovers yang berhasil biasanya memiliki konteks yang jelas dan alasan yang spesifik. 
                    Pastikan AI summary informatif sebelum meng-assign.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
