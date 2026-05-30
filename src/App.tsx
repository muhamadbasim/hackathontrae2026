import React, { useState, useEffect } from 'react'
import { AuthGate } from './components/AuthGate'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { BottomNav } from './components/BottomNav'
import { useInsforgeAuth } from './hooks/useInsforgeAuth'
import { initDemoOrg } from './lib/organization'
import { waSocket } from './lib/waSocket'
import { hasInsforgeEnv, insforge } from './lib/insforge'

// Pages
import DashboardPage from './pages/DashboardPage'
import InboxPage from './pages/InboxPage'
import HandoverPage from './pages/HandoverPage'
import OrdersPage from './pages/OrdersPage'
import CustomersPage from './pages/CustomersPage'
import ProductsPage from './pages/ProductsPage'
import BroadcastPage from './pages/BroadcastPage'
import WorkflowPage from './pages/WorkflowPage'
import AiAgentsPage from './pages/AiAgentsPage'
import AiPlaygroundPage from './pages/AiPlaygroundPage'
import KnowledgePage from './pages/KnowledgePage'
import SettingsPage from './pages/SettingsPage'

type WhatsAppStatus = 'Loading' | 'Disconnected' | 'Connected'

function App() {
  const { user, loading, setUser } = useInsforgeAuth()
  const [activePath, setActivePath] = useState('/dashboard')
  const [waStatus, setWaStatus] = useState<WhatsAppStatus>('Loading')
  const [qrCode, setQrCode] = useState('')

  useEffect(() => {
    initDemoOrg()
  }, [])

  useEffect(() => {
    waSocket.connect()
    
    waSocket.on('status', (s: WhatsAppStatus) => setWaStatus(s))
    waSocket.on('qr', (qr: string) => setQrCode(qr))
    waSocket.on('message:new', (msg) => {
      console.log('New message:', msg)
      // Custom event for InboxPage to listen
      window.dispatchEvent(new CustomEvent('wa:message', { detail: msg }))
    })
    waSocket.on('alert:sent', (alert) => {
      console.log('Alert sent:', alert)
    })

    if (hasInsforgeEnv) {
      const channelName = 'crm:demo'
      
      const setupRealtime = async () => {
        try {
          await insforge.realtime.connect()
          await insforge.realtime.subscribe(channelName)
          
          insforge.realtime.on('postgres_changes', (payload) => {
            console.log('Realtime update:', payload)
          })
        } catch (err) {
          console.error('Realtime setup error:', err)
        }
      }

      setupRealtime()
      
      return () => {
        insforge.realtime.unsubscribe(channelName)
        insforge.realtime.disconnect()
        waSocket.disconnect()
      }
    }

    return () => {
      waSocket.disconnect()
    }
  }, [])

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-background">Loading...</div>
  }

  if (!user) {
    return <AuthGate onAuthSuccess={() => setUser(JSON.parse(localStorage.getItem('scalechat_user') || '{}'))} />
  }

  const renderPage = () => {
    const props = { waStatus, qrCode }
    switch (activePath) {
      case '/dashboard': return <DashboardPage {...props} />
      case '/chat': return <InboxPage {...props} />
      case '/handover': return <HandoverPage {...props} />
      case '/orders': return <OrdersPage {...props} />
      case '/customers': return <CustomersPage {...props} />
      case '/products': return <ProductsPage {...props} />
      case '/broadcast': return <BroadcastPage {...props} />
      case '/flows': return <WorkflowPage {...props} />
      case '/ai-agents': return <AiAgentsPage {...props} />
      case '/ai': return <AiPlaygroundPage {...props} />
      case '/knowledge': return <KnowledgePage {...props} />
      case '/settings': return <SettingsPage {...props} />
      default: return <DashboardPage {...props} />
    }
  }

  return (
    <div className="ocm-shell">
      <Sidebar activePath={activePath} onNavigate={setActivePath} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar onLogout={() => setUser(null)} />
        {renderPage()}
        <BottomNav activePath={activePath} onNavigate={setActivePath} />
      </div>
    </div>
  )
}

export default App
