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
