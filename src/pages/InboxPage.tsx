import React, { useState } from 'react'
import { Search, Filter, Plus, MoreHorizontal, Paperclip, Smile, Zap, FileText, Send, User, Bot, Check, ChevronRight } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from '../data/inboxMockData'

export default function InboxPage() {
  const [selectedConv, setSelectedConv] = useState(MOCK_CONVERSATIONS[0])
  const [activeTab, setActiveTab] = useState('Semua')

  return (
    <main className="h-full flex flex-col bg-[#F8F9FA] overflow-hidden">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Autonomous Leads CRM</span>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-gray-900">Inbox</span>
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
        {/* Left Column: Inbox List */}
        <div className="w-[380px] flex flex-col border-r border-gray-200 bg-white">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-gray-900">INBOX</h2>
              <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px] font-bold">7</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500"><Filter className="w-4 h-4" /></button>
              <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500"><Plus className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="px-4 mb-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Cari pelanggan... ⌘K" 
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="px-4 flex gap-2 mb-4 overflow-x-auto no-scrollbar">
            {['Semua WA', 'Official WABA', 'Baileys'].map(tab => (
              <button 
                key={tab}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border ${tab === 'Semua WA' ? 'bg-[#E6F7F4] text-[#0D9488] border-[#0D9488]' : 'bg-white text-gray-500 border-gray-200'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="px-4 grid grid-cols-5 gap-1 mb-4">
            {[
              { label: 'Semua', count: 7 },
              { label: 'AI', count: 0 },
              { label: 'Handover', count: 0 },
              { label: 'CS', count: 5 },
              { label: 'Unread', count: 5 }
            ].map(item => (
              <button 
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={`flex flex-col items-center py-2 rounded-lg border transition-all ${activeTab === item.label ? 'border-gray-900 bg-white' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
              >
                <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
                <span className="text-sm font-bold">{item.count}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto border-t border-gray-100">
            {MOCK_CONVERSATIONS.map(conv => (
              <div 
                key={conv.id}
                onClick={() => setSelectedConv(conv)}
                className={`p-4 flex gap-3 cursor-pointer border-b border-gray-50 transition-colors relative ${selectedConv.id === conv.id ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
              >
                {selectedConv.id === conv.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                <div className={`w-10 h-10 rounded-full ${conv.color} shrink-0 flex items-center justify-center text-white text-xs font-bold`}>
                  {conv.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h3 className="text-sm font-bold text-gray-900 truncate">{conv.name}</h3>
                    <span className="text-[10px] text-gray-400 font-medium">{conv.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mb-1.5">{conv.lastMessage}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold">
                      <User className="w-3 h-3" /> {conv.status}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-orange-50 text-orange-600 text-[10px] font-bold">
                      {conv.channel}
                    </span>
                    <span className="text-[10px] text-gray-400">Percakapan</span>
                    {conv.unreadCount > 0 && (
                      <div className="ml-auto w-4 h-4 rounded-full bg-primary flex items-center justify-center text-[10px] text-white font-bold">
                        {conv.unreadCount}
                      </div>
                    )}
                    {conv.unreadCount === 0 && conv.id === '1' && (
                      <div className="ml-auto">
                        <div className="w-4 h-4 rounded-full border border-teal-500 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div className="p-4 text-center text-[10px] text-gray-400">
              Menampilkan {MOCK_CONVERSATIONS.length} dari {MOCK_CONVERSATIONS.length} percakapan
              <br />
              Semua percakapan sudah dimuat.
            </div>
          </div>
        </div>

        {/* Middle Column: Chat Window */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${selectedConv.color} flex items-center justify-center text-white text-xs font-bold`}>
                {selectedConv.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900">{selectedConv.name}</h3>
                  <Badge variant="default" className="text-[10px] px-2 py-0">Repeat x0</Badge>
                  <Badge variant="success" className="text-[10px] px-2 py-0 bg-green-50 text-green-600">Lifetime Rp 0</Badge>
                </div>
                <div className="text-[10px] text-gray-500 flex items-center gap-2">
                  <span>{selectedConv.phone}</span>
                  <span>• WhatsApp - Jakarta WIB</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 border border-yellow-200 bg-yellow-50 text-yellow-700 rounded-lg text-xs font-bold flex items-center gap-1.5">
                <Zap className="w-3 h-3 fill-yellow-500" /> AI Mode
              </button>
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold flex items-center gap-1.5">
                <Zap className="w-3 h-3" /> Takeover
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg border border-gray-200 text-teal-600"><Check className="w-4 h-4" /></button>
              <button className="p-2 hover:bg-gray-100 rounded-lg border border-gray-200"><User className="w-4 h-4 text-gray-500" /></button>
              <button className="p-2 hover:bg-gray-100 rounded-lg border border-gray-200"><MoreHorizontal className="w-4 h-4 text-gray-500" /></button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#FDFDFD]">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Awal Percakapan yang Dimuat</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <div className="flex justify-center">
              <span className="px-3 py-1 bg-white border border-gray-100 rounded-full text-[10px] font-bold text-gray-500">Hari Ini</span>
            </div>

            {MOCK_MESSAGES.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[70%] rounded-2xl p-4 text-sm shadow-sm relative ${
                  msg.sender === 'customer' 
                    ? 'bg-white border border-gray-100 text-gray-800 rounded-tl-none' 
                    : 'bg-[#FEF2E8] text-[#9A3412] rounded-tr-none'
                }`}>
                  {msg.text}
                  <div className={`absolute bottom-[-20px] ${msg.sender === 'customer' ? 'left-0' : 'right-0'} flex items-center gap-1 text-[10px] text-gray-400`}>
                    {msg.time} {msg.sender === 'agent' && <Check className="w-3 h-3" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Suggest Area */}
          <div className="p-4 border-t border-gray-100 bg-[#FDFDFD]">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">AI SUGGEST</span>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl mb-4">
              <p className="text-sm text-gray-400 italic">AI sedang handle, ketik untuk takeover...</p>
            </div>

            {/* Input Area */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden focus-within:ring-1 focus-within:ring-primary">
              <textarea 
                placeholder="Ketik pesan..." 
                className="w-full p-4 text-sm focus:outline-none resize-none h-24 no-scrollbar"
              />
              <div className="px-4 py-3 bg-white flex items-center justify-between border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><Paperclip className="w-5 h-5" /></button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><Smile className="w-5 h-5" /></button>
                  <button className="px-3 py-1.5 hover:bg-gray-100 rounded-lg text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Zap className="w-4 h-4" /> Template
                  </button>
                  <button className="px-3 py-1.5 hover:bg-gray-100 rounded-lg text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <FileText className="w-4 h-4" /> Invoice
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-gray-400 font-medium">0/4096</span>
                  <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                    <Send className="w-4 h-4 fill-white" /> Kirim
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Details */}
        <div className="w-[320px] flex flex-col border-l border-gray-200 bg-white overflow-y-auto no-scrollbar">
          <div className="p-8 flex flex-col items-center border-b border-gray-50">
            <div className={`w-20 h-20 rounded-full ${selectedConv.color} flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg`}>
              {selectedConv.avatar}
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">{selectedConv.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{selectedConv.phone}</p>
            <div className="flex gap-2">
              <Badge variant="default" className="text-[10px] px-2 py-1">Repeat x0</Badge>
              <Badge variant="success" className="text-[10px] px-2 py-1 bg-green-50 text-green-600">Lifetime Rp 0</Badge>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* AI Summary Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">AI SUMMARY</span>
              </div>
              <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
                <p className="text-xs leading-relaxed text-orange-800">
                  Pesan customer terakhir: "Kami dari corporate ingin order hampers 100 box. Bisa invoice resmi?".
                  Rekomendasi: gali kebutuhan customer dan dorong ke tahap cart.
                </p>
              </div>
            </div>

            {/* Live Signals Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">LIVE SIGNALS</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Sentiment</span>
                  <span className="text-xs font-bold text-teal-600">Netral</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Intent</span>
                  <span className="text-xs font-bold text-gray-900">Belum terdeteksi</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Buying Stage</span>
                  <span className="text-xs font-bold text-gray-900">Awareness</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Churn Risk</span>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-orange-500">Sedang - 42%</span>
                    <div className="w-24 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div className="w-[42%] h-full bg-orange-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pipeline Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">PIPELINE - OPEN CART</span>
              </div>
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                <p className="text-[10px] text-gray-400 italic">Belum ada open cart aktif.</p>
              </div>
            </div>

            {/* Backend Gap Notes */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bot className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">BACKEND GAP NOTES</span>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                  <p className="text-[10px] text-gray-400">Intent belum tersedia lengkap, fallback ke label default.</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                  <p className="text-[10px] text-gray-400">AI summary menggunakan fallback heuristic karena context summary belum tersedia.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
