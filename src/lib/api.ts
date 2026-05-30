import { insforge, hasInsforgeEnv } from './insforge'
import * as fallback from '../data/demoFallbackData'

const workerUrl = import.meta.env.VITE_WA_WORKER_URL || 'http://localhost:3001'

export const crmApi = {
  getDashboardMetrics: async () => {
    if (hasInsforgeEnv) {
      try {
        const { data, error } = await insforge.database.from('campaigns').select()
        if (!error && data) {
          const spend = data.reduce((sum, c) => sum + (Number(c.spend) || 0), 0)
          const leads = data.reduce((sum, c) => sum + (Number(c.leads) || 0), 0)
          const cpl = leads > 0 ? spend / leads : 0
          const qualifiedRate = data.length > 0 ? data.reduce((sum, c) => sum + (Number(c.qualified_rate) || 0), 0) / data.length : 0
          return { spend, leads, cpl, qualifiedRate, activeCampaigns: data.length, alerts: 0 }
        }
      } catch (err) {
        console.warn('Insforge fetch failed, using fallback', err)
      }
    }
    return {
      spend: 12850000,
      leads: 482,
      cpl: 26659,
      qualifiedRate: 0.42,
      activeCampaigns: fallback.campaignsData.length,
      alerts: 3
    }
  },
  createCampaign: async (campaign: {
    name: string;
    objective: string;
    spend?: number;
    leads?: number;
    cpl?: number;
    qualified_rate?: number;
    status?: string;
    flag?: string;
  }) => {
    if (hasInsforgeEnv) {
      try {
        const { data, error } = await insforge.database.from('campaigns').insert([campaign]).select()
        if (!error && data && data.length > 0) return data[0]
      } catch (err) {
        console.error('Failed to create campaign', err)
        throw err
      }
    }
    const newCampaign = {
      id: crypto.randomUUID(),
      ...campaign,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    fallback.campaignsData.push(newCampaign)
    return newCampaign
  },
  updateCampaign: async (id: string, updates: Partial<{
    name: string;
    objective: string;
    spend: number;
    leads: number;
    cpl: number;
    qualified_rate: number;
    status: string;
    flag: string;
  }>) => {
    if (hasInsforgeEnv) {
      try {
        const { data, error } = await insforge.database.from('campaigns').update(updates).eq('id', id).select()
        if (!error && data && data.length > 0) return data[0]
      } catch (err) {
        console.error('Failed to update campaign', err)
        throw err
      }
    }
    const idx = fallback.campaignsData.findIndex(c => c.id === id)
    if (idx !== -1) {
      fallback.campaignsData[idx] = { ...fallback.campaignsData[idx], ...updates, updated_at: new Date().toISOString() }
      return fallback.campaignsData[idx]
    }
    throw new Error('Campaign not found')
  },
  linkCampaignConversation: async (campaignId: string, conversationId: string, notes?: string) => {
    if (hasInsforgeEnv) {
      try {
        const { data, error } = await insforge.database.from('campaign_conversations').insert([{
          campaign_id: campaignId,
          conversation_id: conversationId,
          linked_by: 'manual',
          notes: notes || null
        }]).select()
        if (!error && data && data.length > 0) return data[0]
      } catch (err) {
        console.error('Failed to link campaign conversation', err)
        throw err
      }
    }
    return { id: crypto.randomUUID(), campaign_id: campaignId, conversation_id: conversationId, linked_by: 'manual', notes }
  },
  unlinkCampaignConversation: async (campaignId: string, conversationId: string) => {
    if (hasInsforgeEnv) {
      try {
        await insforge.database.from('campaign_conversations')
          .delete()
          .eq('campaign_id', campaignId)
          .eq('conversation_id', conversationId)
        return true
      } catch (err) {
        console.error('Failed to unlink campaign conversation', err)
        throw err
      }
    }
    return true
  },
  getCampaignConversations: async (campaignId: string) => {
    if (hasInsforgeEnv) {
      try {
        const { data, error } = await insforge.database
          .from('campaign_conversations')
          .select('*, conversations(*, contacts(*))')
          .eq('campaign_id', campaignId)
        if (!error && data) return data
      } catch (err) {
        console.error('Failed to get campaign conversations', err)
      }
    }
    return []
  },
  listCampaigns: async () => {
    if (hasInsforgeEnv) {
      const { data, error } = await insforge.database.from('campaigns').select()
      if (!error && data && data.length > 0) return data
    }
    return fallback.campaignsData
  },
  listConversations: async () => {
    if (hasInsforgeEnv) {
      const { data, error } = await insforge.database.from('conversations').select()
      if (!error && data && data.length > 0) return data
    }
    return fallback.conversationsData
  },
  listContacts: async () => {
    if (hasInsforgeEnv) {
      const { data, error } = await insforge.database.from('contacts').select()
      if (!error && data && data.length > 0) return data
    }
    return fallback.contactsData
  },
  listOrders: async () => {
    if (hasInsforgeEnv) {
      const { data, error } = await insforge.database.from('orders').select()
      if (!error && data && data.length > 0) return data
    }
    return fallback.ordersData
  },
  listProducts: async () => {
    if (hasInsforgeEnv) {
      const { data, error } = await insforge.database.from('products').select()
      if (!error && data && data.length > 0) return data
    }
    return fallback.productsData
  },
  listHandoverRequests: async () => {
    if (hasInsforgeEnv) {
      const { data, error } = await insforge.database.from('handover_requests').select()
      if (!error && data && data.length > 0) return data
    }
    return fallback.handoverRequestsData
  },
  listBroadcastJobs: async () => {
    if (hasInsforgeEnv) {
      const { data, error } = await insforge.database.from('broadcast_jobs').select()
      if (!error && data && data.length > 0) return data
    }
    return fallback.broadcastJobsData
  },
  listFlows: async () => {
    if (hasInsforgeEnv) {
      const { data, error } = await insforge.database.from('automation_flows').select()
      if (!error && data && data.length > 0) return data
    }
    return fallback.flowsData
  },
  listAiAgents: async () => {
    if (hasInsforgeEnv) {
      const { data, error } = await insforge.database.from('ai_agents').select()
      if (!error && data && data.length > 0) return data
    }
    return fallback.aiAgentsData
  },
  listKnowledgeSources: async () => {
    if (hasInsforgeEnv) {
      const { data, error } = await insforge.database.from('knowledge_sources').select()
      if (!error && data && data.length > 0) return data
    }
    return fallback.knowledgeSourcesData
  }
}

export const waApi = {
  getStatus: async () => {
    try {
      const res = await fetch(`${workerUrl}/status`)
      if (res.ok) return await res.json()
    } catch (e) {
      console.warn('Worker unreachable')
    }
    return { status: 'Disconnected' }
  },
  sendAlert: async ({ number, message }: { number: string; message: string }) => {
    try {
      const res = await fetch(`${workerUrl}/alert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number, message })
      })
      if (res.ok) return await res.json()
    } catch (e) {
      console.warn('Alert send failed')
    }
    return { success: false }
  }
}
