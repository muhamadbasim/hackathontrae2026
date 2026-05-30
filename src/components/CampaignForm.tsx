import React, { useState, useEffect } from 'react'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { crmApi } from '../lib/api'

interface CampaignFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function CampaignForm({ onSuccess, onCancel }: CampaignFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    objective: 'Leads',
    spend: '',
    leads: '',
    status: 'Healthy',
    flag: ''
  })
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedConversations, setSelectedConversations] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      const convs = await crmApi.listConversations()
      setConversations(convs.filter(c => c.channel === 'whatsapp'))
    } catch (err) {
      console.error('Failed to load conversations', err)
    }
  }

  const handleConversationToggle = (conversationId: string) => {
    setSelectedConversations(prev => {
      if (prev.includes(conversationId)) {
        return prev.filter(id => id !== conversationId)
      } else {
        return [...prev, conversationId]
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const campaign = await crmApi.createCampaign({
        name: formData.name,
        objective: formData.objective,
        spend: formData.spend ? Number(formData.spend) : 0,
        leads: formData.leads ? Number(formData.leads) : 0,
        cpl: formData.spend && formData.leads && Number(formData.leads) > 0 
          ? Number(formData.spend) / Number(formData.leads) 
          : 0,
        qualified_rate: 0,
        status: formData.status,
        flag: formData.flag || null
      })

      if (selectedConversations.length > 0) {
        await Promise.all(
          selectedConversations.map(convId => 
            crmApi.linkCampaignConversation(campaign.id, convId)
          )
        )
      }

      onSuccess?.()
    } catch (err: any) {
      setError(err.message || 'Failed to create campaign')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <h3 className="font-bold mb-4">Create New Campaign</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Campaign Name</label>
          <Input
            placeholder="e.g., Promo Akhir Tahun"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Objective</label>
          <select
            className="w-full px-3 py-2 border border-border rounded-md bg-background"
            value={formData.objective}
            onChange={e => setFormData({ ...formData, objective: e.target.value })}
            required
          >
            <option value="Leads">Leads</option>
            <option value="Conversion">Conversion</option>
            <option value="Messages">Messages</option>
            <option value="Awareness">Awareness</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Budget (IDR)</label>
            <Input
              type="number"
              placeholder="0"
              value={formData.spend}
              onChange={e => setFormData({ ...formData, spend: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Leads</label>
            <Input
              type="number"
              placeholder="0"
              value={formData.leads}
              onChange={e => setFormData({ ...formData, leads: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            className="w-full px-3 py-2 border border-border rounded-md bg-background"
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="Healthy">Healthy</option>
            <option value="Warning">Warning</option>
            <option value="Monitor">Monitor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes / Flag</label>
          <Input
            placeholder="e.g., CPL naik 37%"
            value={formData.flag}
            onChange={e => setFormData({ ...formData, flag: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Link WhatsApp Conversations ({selectedConversations.length} selected)
          </label>
          <div className="border border-border rounded-md max-h-48 overflow-y-auto space-y-2 p-3">
            {conversations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No WhatsApp conversations available</p>
            ) : (
              conversations.map(conv => (
                <label key={conv.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedConversations.includes(conv.id)}
                    onChange={() => handleConversationToggle(conv.id)}
                    className="rounded border-border"
                  />
                  <span className="text-sm">
                    {conv.contact?.name || conv.contact_id || 'Unknown'} - 
                    <span className="text-muted-foreground ml-1">
                      {conv.last_message?.substring(0, 30)}
                      {(conv.last_message?.length || 0) > 30 ? '...' : ''}
                    </span>
                  </span>
                </label>
              ))
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Select WhatsApp chats to track with this campaign
          </p>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Creating...' : 'Create Campaign'}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}
