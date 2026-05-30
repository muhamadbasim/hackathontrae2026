import React, { useState } from 'react'
import { OpenCrmSectionHeader } from '../components/opencrm/shared'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { 
  Send,
  Users,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Calendar,
  Filter,
  Plus,
  MoreVertical,
  Mail,
  Phone,
  Megaphone
} from 'lucide-react'

interface Broadcast {
  id: string
  title: string
  status: 'sent' | 'scheduled' | 'draft' | 'failed'
  recipients: number
  delivered: number
  failed: number
  opened: number
  clicked: number
  createdAt: string
  type: 'promo' | 'announcement' | 'reminder' | 'update'
}

const MOCK_BROADCASTS: Broadcast[] = [
  {
    id: '1',
    title: 'Flash Sale 50% Off Weekend',
    status: 'sent',
    recipients: 1250,
    delivered: 1245,
    failed: 5,
    opened: 892,
    clicked: 234,
    createdAt: '2024-01-15 09:30',
    type: 'promo'
  },
  {
    id: '2',
    title: 'New Product Launch - skincare series',
    status: 'sent',
    recipients: 3200,
    delivered: 3195,
    failed: 5,
    opened: 2150,
    clicked: 890,
    createdAt: '2024-01-12 14:20',
    type: 'announcement'
  },
  {
    id: '3',
    title: 'Reminder: Cart Abandonment Promo',
    status: 'scheduled',
    recipients: 485,
    delivered: 0,
    failed: 0,
    opened: 0,
    clicked: 0,
    createdAt: '2024-01-18 16:00',
    type: 'reminder'
  },
  {
    id: '4',
    title: 'Happy New Year 2024 Greeting',
    status: 'sent',
    recipients: 2100,
    delivered: 2095,
    failed: 5,
    opened: 1800,
    clicked: 450,
    createdAt: '2024-01-01 00:00',
    type: 'update'
  },
  {
    id: '5',
    title: 'Weekend Special Offer',
    status: 'draft',
    recipients: 0,
    delivered: 0,
    failed: 0,
    opened: 0,
    clicked: 0,
    createdAt: '2024-01-18 10:30',
    type: 'promo'
  }
]

const STATS = [
  { label: 'Total Broadcast', value: '5', icon: Megaphone, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Total Recipients', value: '7,035', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
  { label: 'Avg. Open Rate', value: '78.5%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Avg. Click Rate', value: '22.4%', icon: MessageSquare, color: 'text-orange-600', bg: 'bg-orange-100' }
]

export default function BroadcastPage() {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>(MOCK_BROADCASTS)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'promo' as Broadcast['type'],
    scheduleDate: '',
    scheduleTime: ''
  })

  const filteredBroadcasts = filterStatus === 'all' 
    ? broadcasts 
    : broadcasts.filter(b => b.status === filterStatus)

  const getStatusBadge = (status: Broadcast['status']) => {
    const variants = {
      sent: 'success',
      scheduled: 'warning',
      draft: 'default',
      failed: 'danger'
    }
    const labels = {
      sent: 'Sent',
      scheduled: 'Scheduled',
      draft: 'Draft',
      failed: 'Failed'
    }
    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  const getTypeBadge = (type: Broadcast['type']) => {
    const colors = {
      promo: 'bg-pink-100 text-pink-700',
      announcement: 'bg-blue-100 text-blue-700',
      reminder: 'bg-yellow-100 text-yellow-700',
      update: 'bg-gray-100 text-gray-700'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type]}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    )
  }

  const handleCreateBroadcast = (e: React.FormEvent) => {
    e.preventDefault()
    const newBroadcast: Broadcast = {
      id: String(Date.now()),
      title: formData.title,
      status: formData.scheduleDate ? 'scheduled' : 'draft',
      recipients: 0,
      delivered: 0,
      failed: 0,
      opened: 0,
      clicked: 0,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      type: formData.type
    }
    setBroadcasts([newBroadcast, ...broadcasts])
    setShowCreateModal(false)
    setFormData({ title: '', message: '', type: 'promo', scheduleDate: '', scheduleTime: '' })
  }

  return (
    <main className="ocm-page">
      <OpenCrmSectionHeader 
        title="Broadcast" 
        subtitle="Kirim pesan massal ke audiens target dengan broadcast WhatsApp" 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </Card>
          )
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Input 
              placeholder="Cari broadcast..." 
              className="pl-10"
            />
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
        <div className="flex gap-2">
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="sent">Sent</option>
            <option value="scheduled">Scheduled</option>
            <option value="draft">Draft</option>
            <option value="failed">Failed</option>
          </select>
          <Button 
            className="ocm-btn-primary flex items-center gap-2"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4" />
            New Broadcast
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Broadcast</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Recipients</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Delivered</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Opened</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Clicked</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredBroadcasts.map((broadcast) => (
                <tr key={broadcast.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 mb-1">{broadcast.title}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {broadcast.recipients} recipients
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getTypeBadge(broadcast.type)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(broadcast.status)}
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    {broadcast.recipients.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-green-600 font-medium">
                        {broadcast.delivered.toLocaleString()}
                      </span>
                      {broadcast.failed > 0 && (
                        <span className="text-red-500 text-xs">
                          ({broadcast.failed} failed)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div>
                      <span className="text-blue-600 font-medium">
                        {broadcast.opened.toLocaleString()}
                      </span>
                      {broadcast.recipients > 0 && (
                        <span className="text-gray-400 text-xs ml-1">
                          ({((broadcast.opened / broadcast.recipients) * 100).toFixed(1)}%)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div>
                      <span className="text-purple-600 font-medium">
                        {broadcast.clicked.toLocaleString()}
                      </span>
                      {broadcast.recipients > 0 && (
                        <span className="text-gray-400 text-xs ml-1">
                          ({((broadcast.clicked / broadcast.recipients) * 100).toFixed(1)}%)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {broadcast.createdAt}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {broadcast.status === 'draft' && (
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Send className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Create New Broadcast</h2>
            </div>
            <form onSubmit={handleCreateBroadcast} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Broadcast Title</label>
                <Input 
                  placeholder="e.g., Flash Sale Weekend Promo"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Broadcast Type</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as Broadcast['type']})}
                >
                  <option value="promo">Promo</option>
                  <option value="announcement">Announcement</option>
                  <option value="reminder">Reminder</option>
                  <option value="update">Update</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea 
                  placeholder="Write your broadcast message here..."
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.message.length} characters
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Schedule Date (Optional)</label>
                  <Input 
                    type="date"
                    value={formData.scheduleDate}
                    onChange={(e) => setFormData({...formData, scheduleDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Schedule Time (Optional)</label>
                  <Input 
                    type="time"
                    value={formData.scheduleTime}
                    onChange={(e) => setFormData({...formData, scheduleTime: e.target.value})}
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Target Audience</p>
                    <p className="text-xs text-blue-700 mt-1">
                      This broadcast will be sent to all active subscribers (1,250 recipients)
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="flex-1 ocm-btn-primary"
                >
                  {formData.scheduleDate ? 'Schedule Broadcast' : 'Save as Draft'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </main>
  )
}
