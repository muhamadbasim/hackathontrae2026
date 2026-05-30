import React, { useState } from 'react'
import { OpenCrmSectionHeader } from '../components/opencrm/shared'
import { Card } from '../components/ui/Card'
import { Textarea } from '../components/ui/Textarea'
import { Button } from '../components/ui/Button'

export default function AiPlaygroundPage() {
  const [prompt, setPrompt] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRun = () => {
    setLoading(true)
    setTimeout(() => {
      setOutput(`[Simulated Output for: "${prompt}"]\n\nAI Agent has processed the request based on the active persona and knowledge base.`)
      setLoading(false)
    }, 1000)
  }

  return (
    <main className="ocm-page">
      <OpenCrmSectionHeader title="AI Playground" subtitle="Uji coba prompt dan respon agent." />
      
      <div className="ocm-grid-2">
        <Card className="p-6">
          <h3 className="font-bold mb-4">Input Prompt</h3>
          <select className="ocm-select mb-4">
            <option>Campaign Analyst</option>
            <option>CRM Qualifier</option>
            <option>WhatsApp Reply Assistant</option>
          </select>
          <Textarea 
            placeholder="Ketik pesan pelanggan atau instruksi analisa di sini..." 
            value={prompt} 
            onChange={e => setPrompt(e.target.value)}
            className="mb-4 h-40"
          />
          <Button onClick={handleRun} disabled={loading || !prompt} className="ocm-btn-primary w-full">
            {loading ? 'Processing...' : 'Run Test'}
          </Button>
        </Card>
        
        <Card className="p-6 bg-muted/30">
          <h3 className="font-bold mb-4">Agent Output</h3>
          <div className="whitespace-pre-wrap font-mono text-sm">
            {output || <span className="text-muted-foreground">Output will appear here...</span>}
          </div>
        </Card>
      </div>
    </main>
  )
}
