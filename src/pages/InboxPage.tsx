import React, { useEffect, useState } from 'react'
import { OpenCrmSectionHeader } from '../components/opencrm/shared'
import { crmApi } from '../lib/api'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'

export default function InboxPage() {
  const [conversations, setConversations] = useState<any[]>([])

  useEffect(() => {
    crmApi.listConversations().then(setConversations)

    const handleNewMessage = (e: any) => {
      // In a real app, append message to the active conversation
      console.log('Inbox received:', e.detail)
    }
    window.addEventListener('wa:message', handleNewMessage)
    return () => window.removeEventListener('wa:message', handleNewMessage)
  }, [])

  return (
    <main className="ocm-page h-full flex flex-col">
      <OpenCrmSectionHeader title="Inbox" subtitle="Kelola percakapan pelanggan dari WhatsApp Baileys." />
      
      <div className="flex-1 flex gap-4 overflow-hidden">
        <Card className="w-1/3 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/30 font-bold flex justify-between items-center">
            Conversations
            <Badge>WhatsApp Baileys</Badge>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map(c => (
              <div key={c.id} className="p-4 border-b border-border hover:bg-muted/50 cursor-pointer transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm">{c.contact_id}</span>
                  <span className="text-[10px] text-muted-foreground">{c.status}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{c.last_message}</p>
              </div>
            ))}
          </div>
        </Card>
        
        <Card className="flex-1 flex flex-col">
          <div className="p-4 border-b border-border bg-muted/30 font-bold">Chat Window</div>
          <div className="flex-1 p-4 overflow-y-auto bg-muted/10">
            <p className="text-center text-sm text-muted-foreground mt-10">Select a conversation to view messages</p>
          </div>
        </Card>
        
        <Card className="w-1/4 hidden lg:flex flex-col">
          <div className="p-4 border-b border-border bg-muted/30 font-bold">Customer Context</div>
          <div className="p-4">
            <p className="text-sm text-muted-foreground">Context info appears here</p>
          </div>
        </Card>
      </div>
    </main>
  )
}
