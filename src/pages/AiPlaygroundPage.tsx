import React, { useState } from 'react'
import { OpenCrmSectionHeader } from '../components/opencrm/shared'
import { Card } from '../components/ui/Card'
import { Textarea } from '../components/ui/Textarea'
import { Button } from '../components/ui/Button'
import { 
  Bot, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Sparkles, 
  Zap, 
  Shield, 
  Lightbulb,
  BarChart3,
  Target,
  Workflow
} from 'lucide-react'

interface AIAgent {
  id: string
  name: string
  description: string
  icon: React.ElementType
  color: string
  bgColor: string
  capabilities: string[]
  status: 'active' | 'beta' | 'coming-soon'
}

const AI_AGENTS: AIAgent[] = [
  {
    id: 'campaign-analyst',
    name: 'Campaign Analyst',
    description: 'Analisis performa campaign iklan dan berikan rekomendasi optimasi berdasarkan data real-time.',
    icon: TrendingUp,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
    capabilities: ['Analisis ROAS', 'Budget Optimization', 'Trend Detection'],
    status: 'active'
  },
  {
    id: 'crm-qualifier',
    name: 'CRM Qualifier',
    description: 'Kualifikasi dan scoring leads berdasarkan data CRM dan histori interaksi pelanggan.',
    icon: Users,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 border-purple-200',
    capabilities: ['Lead Scoring', 'Intent Detection', 'Objection Analysis'],
    status: 'active'
  },
  {
    id: 'wa-assistant',
    name: 'WhatsApp Reply Assistant',
    description: 'Generate balasan chat yang natural dan sesuai konteks percakapan pelanggan.',
    icon: MessageSquare,
    color: 'text-green-600',
    bgColor: 'bg-green-50 border-green-200',
    capabilities: ['Smart Replies', 'Context Awareness', 'Multi-language'],
    status: 'active'
  },
  {
    id: 'creative-strategist',
    name: 'Creative Strategist',
    description: 'Buat variasi copy iklan yang compelling berdasarkan insight dari data CRM dan campaign.',
    icon: Sparkles,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 border-orange-200',
    capabilities: ['Copy Generation', 'A/B Variants', 'Hook Formulas'],
    status: 'active'
  },
  {
    id: 'objection-handler',
    name: 'Objection Handler',
    description: 'Identifikasi dan tangani objection pelanggan dengan script yang sudah teruji.',
    icon: Shield,
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200',
    capabilities: ['Objection Mapping', 'Response Templates', 'Escalation Logic'],
    status: 'beta'
  },
  {
    id: 'insight-generator',
    name: 'Insight Generator',
    description: 'Generate actionable insights dari data campaign dan CRM untuk pengambilan keputusan.',
    icon: Lightbulb,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 border-yellow-200',
    capabilities: ['Pattern Recognition', 'Recommendation Engine', 'Predictive Analytics'],
    status: 'active'
  },
  {
    id: 'kpi-monitor',
    name: 'KPI Monitor',
    description: 'Real-time monitoring metrik utama dan alert ketika threshold tercapai.',
    icon: BarChart3,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 border-indigo-200',
    capabilities: ['Real-time Dashboard', 'Alert System', 'Trend Analysis'],
    status: 'active'
  },
  {
    id: 'targeting-advisor',
    name: 'Targeting Advisor',
    description: 'Rekomendasikan audience targeting berdasarkan pola konversi terbaik.',
    icon: Target,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50 border-cyan-200',
    capabilities: ['Audience Insights', 'Lookalike Modeling', 'Segmentation'],
    status: 'coming-soon'
  },
  {
    id: 'workflow-orchestrator',
    name: 'Workflow Orchestrator',
    description: 'Koordinasikan dan otomatisasi alur kerja berdasarkan triggger dan kondisi tertentu.',
    icon: Workflow,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50 border-teal-200',
    capabilities: ['Workflow Design', 'Condition Builder', 'Automation Rules'],
    status: 'beta'
  }
]

export default function AiPlaygroundPage() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRun = () => {
    if (!selectedAgent || !prompt) return
    setLoading(true)
    setTimeout(() => {
      const agent = AI_AGENTS.find(a => a.id === selectedAgent)
      setOutput(`[${agent?.name}]\n\nSimulated output for: "${prompt}"\n\nAI Agent has processed the request based on the active persona and knowledge base.`)
      setLoading(false)
    }, 1000)
  }

  const handleAgentClick = (agentId: string) => {
    setSelectedAgent(agentId)
  }

  return (
    <main className="ocm-page">
      <OpenCrmSectionHeader 
        title="AI Playground" 
        subtitle="Pilih agent AI untuk diuji coba dan lihat respons real-time." 
      />
      
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Available AI Agents</h2>
        <p className="text-sm text-gray-500">Klik agent untuk memilih, lalu masukkan prompt di panel testing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {AI_AGENTS.map((agent) => {
          const Icon = agent.icon
          const isSelected = selectedAgent === agent.id
          
          return (
            <button
              key={agent.id}
              onClick={() => handleAgentClick(agent.id)}
              className={`relative p-5 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-lg hover:-translate-y-1 ${
                isSelected 
                  ? `${agent.bgColor} border-current ring-2 ring-offset-2 ring-primary` 
                  : 'bg-white border-gray-100 hover:border-gray-200'
              }`}
            >
              {agent.status !== 'active' && (
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                  agent.status === 'beta' 
                    ? 'bg-orange-100 text-orange-600' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {agent.status === 'beta' ? 'Beta' : 'Coming Soon'}
                </div>
              )}
              
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 ${agent.bgColor}`}>
                <Icon className={`w-6 h-6 ${agent.color}`} />
              </div>
              
              <h3 className="font-bold text-gray-900 mb-2 pr-12">{agent.name}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{agent.description}</p>
              
              <div className="flex flex-wrap gap-1">
                {agent.capabilities.slice(0, 2).map((cap, idx) => (
                  <span 
                    key={idx}
                    className={`px-2 py-1 rounded-md text-[10px] font-medium ${agent.bgColor} ${agent.color}`}
                  >
                    {cap}
                  </span>
                ))}
                {agent.capabilities.length > 2 && (
                  <span className="px-2 py-1 rounded-md text-[10px] font-medium bg-gray-100 text-gray-500">
                    +{agent.capabilities.length - 2}
                  </span>
                )}
              </div>
              
              {isSelected && (
                <div className="absolute bottom-3 right-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${agent.bgColor}`}>
                    <Zap className={`w-4 h-4 ${agent.color}`} />
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>

      <div className="ocm-grid-2">
        <Card className="p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            Input Prompt
          </h3>
          
          {!selectedAgent ? (
            <div className="text-center py-8 text-gray-400">
              <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">Pilih agent di atas untuk memulai</p>
              <p className="text-sm mt-1">Klik salah satu kartu AI agent untuk memilih</p>
            </div>
          ) : (
            <>
              <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg mb-4 ${
                AI_AGENTS.find(a => a.id === selectedAgent)?.bgColor
              }`}>
                {React.createElement(
                  AI_AGENTS.find(a => a.id === selectedAgent)!.icon,
                  { className: `w-4 h-4 ${AI_AGENTS.find(a => a.id === selectedAgent)?.color}` }
                )}
                <span className="text-sm font-medium">
                  {AI_AGENTS.find(a => a.id === selectedAgent)?.name}
                </span>
              </div>
              
              <Textarea 
                placeholder="Ketik pesan pelanggan atau instruksi analisa di sini..." 
                value={prompt} 
                onChange={e => setPrompt(e.target.value)}
                className="mb-4 h-40"
              />
              <Button 
                onClick={handleRun} 
                disabled={loading || !prompt} 
                className="ocm-btn-primary w-full"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⚙️</span>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Run Test
                  </span>
                )}
              </Button>
            </>
          )}
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-gray-50 to-white">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Agent Output
          </h3>
          <div className="whitespace-pre-wrap font-mono text-sm min-h-[200px] flex items-center justify-center text-gray-400">
            {output || (
              <div className="text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">Output akan muncul di sini</p>
                <p className="text-sm mt-1">Jalankan test untuk melihat respons agent</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </main>
  )
}
