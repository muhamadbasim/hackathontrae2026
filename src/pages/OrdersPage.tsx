import React, { useState } from 'react'
import { Search, Filter, Plus, Download, ChevronRight, Package, Clock, Truck, CheckCircle, XCircle, CreditCard, ShoppingBag, TrendingUp, AlertCircle } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { MOCK_ORDERS, ORDER_STATS, ORDER_STATUS_CONFIG, PAYMENT_STATUS_CONFIG } from '../data/ordersMockData'

export default function OrdersPage() {
  const [orders, setOrders] = useState(MOCK_ORDERS)
  const [activeTab, setActiveTab] = useState('Semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<typeof MOCK_ORDERS[0] | null>(null)

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery)
    
    const matchesTab = 
      activeTab === 'Semua' ||
      (activeTab === 'Pending' && order.orderStatus === 'pending') ||
      (activeTab === 'Diproses' && order.orderStatus === 'processing') ||
      (activeTab === 'Dikirim' && order.orderStatus === 'shipped') ||
      (activeTab === 'Selesai' && order.orderStatus === 'completed')
    
    return matchesSearch && matchesTab
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <main className="h-full flex flex-col bg-[#F8F9FA] overflow-hidden">
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Autonomous Leads CRM</span>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-gray-900">Orders</span>
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
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><Package className="w-5 h-5" /></button>
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
              <h1 className="text-lg font-bold text-gray-900">ORDERS</h1>
              <Badge variant="warning" className="text-[10px] px-2 py-0.5 bg-yellow-100 text-yellow-700 border-0">
                {ORDER_STATS.pendingPayment} Pending Payment
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2">
                <Download className="w-4 h-4" /> Export
              </button>
              <button className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" /> New Order
              </button>
            </div>
          </div>

          <div className="px-6 py-4 bg-white border-b border-gray-100 space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Cari order, customer, atau nomor pesanan..." 
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {[
                { label: 'Semua', count: orders.length },
                { label: 'Pending', count: orders.filter(o => o.orderStatus === 'pending').length },
                { label: 'Diproses', count: orders.filter(o => o.orderStatus === 'processing').length },
                { label: 'Dikirim', count: orders.filter(o => o.orderStatus === 'shipped').length },
                { label: 'Selesai', count: orders.filter(o => o.orderStatus === 'completed').length },
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

          <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
            <div className="space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <ShoppingBag className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-sm font-medium">Tidak ada pesanan</p>
                </div>
              ) : (
                filteredOrders.map(order => (
                  <Card 
                    key={order.id} 
                    className={`overflow-hidden border border-gray-100 hover:border-gray-200 transition-all cursor-pointer ${
                      selectedOrder?.id === order.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl ${order.avatarColor} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                            {order.customerAvatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-900">{order.customerName}</h3>
                              <span className="text-[10px] text-gray-400 font-mono">{order.orderNumber}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-gray-500">
                              <span>{order.customerPhone}</span>
                              <span>•</span>
                              <span>{order.date} {order.time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">{formatCurrency(order.grandTotal)}</div>
                          <div className="text-[10px] text-gray-500">{order.items} item</div>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 mb-3 truncate">{order.itemsSummary}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 ${ORDER_STATUS_CONFIG[order.orderStatus as keyof typeof ORDER_STATUS_CONFIG].color}`}>
                            {order.orderStatus === 'pending' && <Clock className="w-3 h-3" />}
                            {order.orderStatus === 'processing' && <AlertCircle className="w-3 h-3" />}
                            {order.orderStatus === 'shipped' && <Truck className="w-3 h-3" />}
                            {order.orderStatus === 'delivered' && <CheckCircle className="w-3 h-3" />}
                            {order.orderStatus === 'completed' && <CheckCircle className="w-3 h-3" />}
                            {order.orderStatus === 'cancelled' && <XCircle className="w-3 h-3" />}
                            {ORDER_STATUS_CONFIG[order.orderStatus as keyof typeof ORDER_STATUS_CONFIG].label}
                          </span>
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 ${PAYMENT_STATUS_CONFIG[order.paymentStatus as keyof typeof PAYMENT_STATUS_CONFIG].color}`}>
                            <CreditCard className="w-3 h-3" />
                            {order.paymentMethod} • {PAYMENT_STATUS_CONFIG[order.paymentStatus as keyof typeof PAYMENT_STATUS_CONFIG].label}
                          </span>
                        </div>
                        <button className="text-xs text-primary font-bold hover:underline">Detail →</button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="w-[340px] border-l border-gray-200 bg-white overflow-y-auto no-scrollbar">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-sm mb-4">RINGKASAN</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingBag className="w-4 h-4 text-gray-500" />
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">Total Orders</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{ORDER_STATS.totalOrders}</div>
              </div>
              <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-[10px] text-green-600 uppercase tracking-wider">Revenue</span>
                </div>
                <div className="text-lg font-bold text-green-700">{formatCurrency(ORDER_STATS.totalRevenue)}</div>
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <span className="text-[10px] text-yellow-600 uppercase tracking-wider">Pending</span>
                </div>
                <div className="text-2xl font-bold text-yellow-600">{ORDER_STATS.pendingPayment}</div>
              </div>
              <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-[10px] text-green-600 uppercase tracking-wider">Completed</span>
                </div>
                <div className="text-2xl font-bold text-green-600">{ORDER_STATS.completedOrders}</div>
              </div>
            </div>
          </div>

          {selectedOrder && (
            <div className="p-6">
              <h2 className="font-bold text-gray-900 text-sm mb-4">DETAIL ORDER</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl ${selectedOrder.avatarColor} flex items-center justify-center text-white text-sm font-bold`}>
                      {selectedOrder.customerAvatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{selectedOrder.customerName}</h3>
                      <p className="text-[10px] text-gray-500">{selectedOrder.customerPhone}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Order Number</span>
                      <span className="font-mono font-bold">{selectedOrder.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tanggal</span>
                      <span className="font-medium">{selectedOrder.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Waktu</span>
                      <span className="font-medium">{selectedOrder.time}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-orange-500" />
                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Items ({selectedOrder.items})</span>
                  </div>
                  <p className="text-xs text-orange-800">{selectedOrder.itemsSummary}</p>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500">Subtotal</span>
                    <span className="text-xs font-medium">{formatCurrency(selectedOrder.grandTotal - 15000)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500">Ongkos Kirim</span>
                    <span className="text-xs font-medium">{formatCurrency(15000)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-900">Total</span>
                      <span className="text-sm font-bold text-primary">{formatCurrency(selectedOrder.grandTotal)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="w-4 h-4 text-gray-500" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Payment</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Method</span>
                      <span className="text-xs font-bold">{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Status</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${PAYMENT_STATUS_CONFIG[selectedOrder.paymentStatus as keyof typeof PAYMENT_STATUS_CONFIG].color}`}>
                        {PAYMENT_STATUS_CONFIG[selectedOrder.paymentStatus as keyof typeof PAYMENT_STATUS_CONFIG].label}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Truck className="w-4 h-4 text-gray-500" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 ${ORDER_STATUS_CONFIG[selectedOrder.orderStatus as keyof typeof ORDER_STATUS_CONFIG].color}`}>
                      {ORDER_STATUS_CONFIG[selectedOrder.orderStatus as keyof typeof ORDER_STATUS_CONFIG].label}
                    </span>
                    <span className="text-[10px] text-gray-500">Last update: {selectedOrder.date}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
                    Edit Order
                  </button>
                  <button className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/90 transition-all">
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          )}

          {!selectedOrder && (
            <div className="p-6 flex flex-col items-center justify-center h-64 text-gray-400">
              <Package className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-xs text-center">Klik order di samping untuk melihat detail</p>
            </div>
          )}

          <div className="p-6 border-t border-gray-100">
            <h2 className="font-bold text-gray-900 text-sm mb-4">AKSI CEPAT</h2>
            <div className="space-y-2">
              <button className="w-full p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">Create Manual Order</div>
                  <div className="text-[10px] text-gray-500">Tambah pesanan baru</div>
                </div>
              </button>
              <button className="w-full p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                  <Download className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">Export Report</div>
                  <div className="text-[10px] text-gray-500">Download data orders</div>
                </div>
              </button>
              <button className="w-full p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">Analytics</div>
                  <div className="text-[10px] text-gray-500">Lihat statistik penjualan</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
