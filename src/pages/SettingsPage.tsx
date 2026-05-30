import React, { useState } from 'react'
import { OpenCrmSectionHeader } from '../components/opencrm/shared'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { WhatsAppQrGate } from '../components/WhatsAppQrGate'
import { hasInsforgeEnv } from '../lib/insforge'
import { 
  User, 
  MessageSquare, 
  Bot, 
  Users, 
  Bell, 
  Shield, 
  CreditCard,
  ChevronRight,
  Check,
  Eye,
  EyeOff,
  Save
} from 'lucide-react'

type SettingsTab = 'profile' | 'whatsapp' | 'ai' | 'team' | 'notifications' | 'security' | 'billing'

const TABS = [
  { id: 'profile' as const, label: 'Profile', icon: User },
  { id: 'whatsapp' as const, label: 'WhatsApp', icon: MessageSquare },
  { id: 'ai' as const, label: 'AI & Integrations', icon: Bot },
  { id: 'team' as const, label: 'Team', icon: Users },
  { id: 'notifications' as const, label: 'Notifications', icon: Bell },
  { id: 'security' as const, label: 'Security', icon: Shield },
  { id: 'billing' as const, label: 'Billing', icon: CreditCard },
]

export default function SettingsPage({ waStatus }: { waStatus: string }) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  const [showQrModal, setShowQrModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />
      case 'whatsapp':
        return <WhatsAppSettings waStatus={waStatus} showQrModal={showQrModal} setShowQrModal={setShowQrModal} />
      case 'ai':
        return <AiSettings />
      case 'team':
        return <TeamSettings />
      case 'notifications':
        return <NotificationSettings />
      case 'security':
        return <SecuritySettings showPassword={showPassword} setShowPassword={setShowPassword} />
      case 'billing':
        return <BillingSettings />
      default:
        return null
    }
  }

  return (
    <main className="ocm-page">
      <OpenCrmSectionHeader title="Settings" subtitle="Kelola akun dan konfigurasi sistem." />
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-64 shrink-0">
          <Card className="p-3">
            <nav className="space-y-1">
              {TABS.map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id 
                        ? 'bg-[#FEF2E8] text-primary shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-primary' : 'text-gray-400'}`} />
                    {tab.label}
                    <ChevronRight className={`w-4 h-4 ml-auto ${activeTab === tab.id ? 'opacity-100' : 'opacity-0'}`} />
                  </button>
                )
              })}
            </nav>
          </Card>
        </div>

        <div className="flex-1 min-w-0">
          {renderContent()}
        </div>
      </div>
    </main>
  )
}

function ProfileSettings() {
  const [saved, setSaved] = useState(false)
  
  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }
  
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-6">Profile Information</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              MB
            </div>
            <div>
              <Button variant="outline" size="sm">Change Photo</Button>
              <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Full Name</label>
              <Input defaultValue="Muhamad Basim" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <Input defaultValue="basim@example.com" type="email" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Phone Number</label>
              <Input defaultValue="+62 812 3456 7890" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Role</label>
              <Input defaultValue="Admin" disabled />
            </div>
          </div>
          
          <div className="pt-4">
            <label className="text-sm font-medium mb-2 block">Bio</label>
            <textarea 
              className="ocm-textarea w-full" 
              rows={3}
              defaultValue="WhatsApp CRM Platform Administrator"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} className="flex items-center gap-2">
              {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? 'Saved!' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Organization</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Company Name</label>
            <Input defaultValue="PT Autonomous Leads CRM Indonesia" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Website</label>
            <Input defaultValue="https://opencrm.id" type="url" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Industry</label>
            <select className="ocm-select">
              <option>Technology</option>
              <option>E-commerce</option>
              <option>Healthcare</option>
              <option>Finance</option>
              <option>Education</option>
              <option>Other</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  )
}

function WhatsAppSettings({ waStatus, showQrModal, setShowQrModal }: { waStatus: string, showQrModal: boolean, setShowQrModal: (v: boolean) => void }) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-6">WhatsApp Connection</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${waStatus === 'Connected' ? 'bg-green-500' : 'bg-red-500'}`} />
              <div>
                <div className="font-medium">Connection Status</div>
                <div className="text-sm text-muted-foreground">
                  {waStatus === 'Connected' ? 'Device is connected and ready' : 'Not connected'}
                </div>
              </div>
            </div>
            <Badge variant={waStatus === 'Connected' ? 'success' : 'danger'}>{waStatus}</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Worker URL</label>
              <Input defaultValue={import.meta.env.VITE_WA_WORKER_URL || 'http://localhost:3001'} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Session ID</label>
              <Input defaultValue="opencrm-demo-session" />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium">Auto Reconnect</div>
              <div className="text-sm text-muted-foreground">Automatically reconnect when connection is lost</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <Button 
            onClick={() => setShowQrModal(!showQrModal)} 
            variant={waStatus === 'Connected' ? 'outline' : 'default'}
            className="w-full md:w-auto"
          >
            {waStatus === 'Connected' ? 'Show QR Code' : 'Connect WhatsApp'}
          </Button>
        </div>
      </Card>

      {showQrModal && (
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">Scan QR Code</h3>
          <WhatsAppQrGate onConnected={() => setShowQrModal(false)} />
        </Card>
      )}

      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Message Settings</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Default Reply Delay (seconds)</label>
              <Input type="number" defaultValue="3" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Max Daily Messages</label>
              <Input type="number" defaultValue="1000" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Timezone</label>
            <select className="ocm-select">
              <option>Asia/Jakarta (GMT+7)</option>
              <option>Asia/Makassar (GMT+8)</option>
              <option>Asia/Jayapura (GMT+9)</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  )
}

function AiSettings() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-6">AI Model Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Primary AI Provider</label>
            <select className="ocm-select">
              <option>OpenAI</option>
              <option>Anthropic Claude</option>
              <option>Google Gemini</option>
              <option>OpenRouter</option>
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Default Model</label>
            <select className="ocm-select">
              <option>GPT-4o</option>
              <option>GPT-4o-mini</option>
              <option>Claude 3.5 Sonnet</option>
              <option>Claude 3 Haiku</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Temperature</label>
            <input 
              type="range" 
              min="0" 
              max="2" 
              step="0.1" 
              defaultValue="0.7"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Precise (0.0)</span>
              <span>Creative (2.0)</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium">Streaming Responses</div>
              <div className="text-sm text-muted-foreground">Enable real-time streaming for AI responses</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-bold text-lg mb-6">API Keys</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">OpenAI API Key</label>
            <div className="relative">
              <Input 
                type="password" 
                defaultValue="sk-xxxx...xxxx" 
                className="pr-10"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Anthropic API Key</label>
            <div className="relative">
              <Input 
                type="password" 
                placeholder="sk-ant-xxxx..." 
                className="pr-10"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <EyeOff className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Integrations</h3>
        <div className="space-y-3">
          {[
            { name: 'Slack', status: 'Connected', color: 'purple' },
            { name: 'HubSpot', status: 'Not Connected', color: 'gray' },
            { name: 'Zapier', status: 'Not Connected', color: 'gray' },
            { name: 'Google Sheets', status: 'Connected', color: 'green' },
          ].map(integration => (
            <div key={integration.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-${integration.color}-100 flex items-center justify-center`}>
                  <div className={`w-6 h-6 rounded bg-${integration.color}-500`} />
                </div>
                <div>
                  <div className="font-medium">{integration.name}</div>
                  <div className="text-sm text-muted-foreground">{integration.status}</div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                {integration.status === 'Connected' ? 'Configure' : 'Connect'}
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function TeamSettings() {
  const teamMembers = [
    { name: 'Muhamad Basim', email: 'basim@example.com', role: 'Admin', avatar: 'MB', status: 'active' },
    { name: 'Ahmad Rizki', email: 'rizki@example.com', role: 'Agent', avatar: 'AR', status: 'active' },
    { name: 'Siti Nurhaliza', email: 'siti@example.com', role: 'Agent', avatar: 'SN', status: 'invited' },
    { name: 'Budi Santoso', email: 'budi@example.com', role: 'Viewer', avatar: 'BS', status: 'inactive' },
  ]

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">Team Members</h3>
          <Button size="sm">Invite Member</Button>
        </div>
        
        <div className="space-y-3">
          {teamMembers.map(member => (
            <div key={member.email} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">
                  {member.avatar}
                </div>
                <div>
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-muted-foreground">{member.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={member.role === 'Admin' ? 'default' : 'default'}>{member.role}</Badge>
                <Badge variant={member.status === 'active' ? 'success' : member.status === 'invited' ? 'warning' : 'default'}>
                  {member.status}
                </Badge>
                <Button variant="ghost" size="sm">...</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Roles & Permissions</h3>
        <div className="space-y-3">
          {[
            { role: 'Admin', description: 'Full access to all features and settings', count: 1 },
            { role: 'Agent', description: 'Can manage conversations and customers', count: 2 },
            { role: 'Viewer', description: 'Read-only access to dashboard and reports', count: 1 },
          ].map(item => (
            <div key={item.role} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">{item.role}</div>
                <div className="text-sm text-muted-foreground">{item.description}</div>
              </div>
              <Badge variant="default">{item.count} member{item.count > 1 ? 's' : ''}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function NotificationSettings() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-6">Email Notifications</h3>
        <div className="space-y-4">
          {[
            { label: 'New customer messages', description: 'Get notified when a new customer sends a message', enabled: true },
            { label: 'Campaign updates', description: 'Receive updates about your broadcast campaigns', enabled: true },
            { label: 'AI agent alerts', description: 'Get alerts when AI agents need attention', enabled: true },
            { label: 'System notifications', description: 'Important system updates and maintenance notices', enabled: false },
            { label: 'Weekly reports', description: 'Receive weekly performance summaries', enabled: true },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">{item.label}</div>
                <div className="text-sm text-muted-foreground">{item.description}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-bold text-lg mb-6">Push Notifications</h3>
        <div className="space-y-4">
          {[
            { label: 'Browser notifications', description: 'Show desktop notifications', enabled: true },
            { label: 'Sound alerts', description: 'Play sound for new messages', enabled: false },
            { label: 'Badge updates', description: 'Show unread count on app icon', enabled: true },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">{item.label}</div>
                <div className="text-sm text-muted-foreground">{item.description}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Quiet Hours</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium">Enable Quiet Hours</div>
              <div className="text-sm text-muted-foreground">Pause non-urgent notifications during set hours</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Start Time</label>
              <Input type="time" defaultValue="22:00" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">End Time</label>
              <Input type="time" defaultValue="08:00" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function SecuritySettings({ showPassword, setShowPassword }: { showPassword: boolean, setShowPassword: (v: boolean) => void }) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-6">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Current Password</label>
            <div className="relative">
              <Input type={showPassword ? 'text' : 'password'} className="pr-10" />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">New Password</label>
            <Input type={showPassword ? 'text' : 'password'} />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Confirm New Password</label>
            <Input type={showPassword ? 'text' : 'password'} />
          </div>
          <Button>Update Password</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-bold text-lg mb-6">Two-Factor Authentication</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium">Enable 2FA</div>
              <div className="text-sm text-muted-foreground">Add an extra layer of security to your account</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium">Backup Codes</div>
              <div className="text-sm text-muted-foreground">Generate backup codes for account recovery</div>
            </div>
            <Button variant="outline" size="sm">Generate</Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-bold text-lg mb-6">Active Sessions</h3>
        <div className="space-y-3">
          {[
            { device: 'Chrome on MacOS', location: 'Jakarta, Indonesia', current: true, lastActive: 'Now' },
            { device: 'Safari on iPhone', location: 'Jakarta, Indonesia', current: false, lastActive: '2 hours ago' },
            { device: 'Firefox on Windows', location: 'Bandung, Indonesia', current: false, lastActive: '3 days ago' },
          ].map((session, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{session.device}</span>
                  {session.current && <Badge variant="success" className="text-xs">Current</Badge>}
                </div>
                <div className="text-sm text-muted-foreground">
                  {session.location} • {session.lastActive}
                </div>
              </div>
              {!session.current && (
                <Button variant="ghost" size="sm" className="text-red-500">Revoke</Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 border-red-200 bg-red-50">
        <h3 className="font-bold text-lg mb-4 text-red-700">Danger Zone</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Export Data</div>
              <div className="text-sm text-red-600">Download all your data in JSON format</div>
            </div>
            <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-100">
              Export
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Delete Account</div>
              <div className="text-sm text-red-600">Permanently delete your account and all data</div>
            </div>
            <Button variant="danger" size="sm">
              Delete Account
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

function BillingSettings() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-lg">Current Plan</h3>
            <p className="text-sm text-muted-foreground">Manage your subscription and billing</p>
          </div>
          <Badge variant="default" className="bg-purple-600">Pro Plan</Badge>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-orange-500 rounded-xl p-6 text-white mb-6">
          <div className="text-sm opacity-80">Plan renews on</div>
          <div className="text-2xl font-bold">December 15, 2026</div>
          <div className="mt-4 flex items-center gap-4">
            <div>
              <div className="text-sm opacity-80">Messages used</div>
              <div className="text-xl font-bold">8,234 / 10,000</div>
            </div>
            <div>
              <div className="text-sm opacity-80">Team members</div>
              <div className="text-xl font-bold">4 / 10</div>
            </div>
          </div>
        </div>

        <Button className="w-full">Upgrade Plan</Button>
      </Card>

      <Card className="p-6">
        <h3 className="font-bold text-lg mb-6">Billing History</h3>
        <div className="space-y-3">
          {[
            { date: 'November 15, 2026', amount: 'Rp 299,000', status: 'Paid' },
            { date: 'October 15, 2026', amount: 'Rp 299,000', status: 'Paid' },
            { date: 'September 15, 2026', amount: 'Rp 299,000', status: 'Paid' },
          ].map((invoice, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">{invoice.date}</div>
                <div className="text-sm text-muted-foreground">Pro Plan</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium">{invoice.amount}</span>
                <Badge variant="success">{invoice.status}</Badge>
                <Button variant="ghost" size="sm">Download</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-bold text-lg mb-6">Payment Method</h3>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
              VISA
            </div>
            <div>
              <div className="font-medium">•••• •••• •••• 4242</div>
              <div className="text-sm text-muted-foreground">Expires 12/2027</div>
            </div>
          </div>
          <Button variant="outline" size="sm">Update</Button>
        </div>
      </Card>
    </div>
  )
}
