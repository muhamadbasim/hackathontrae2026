import React, { useState } from 'react'
import { Card } from './ui/Card'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { waApi } from '../lib/api'

export function AlertSender() {
  const [number, setNumber] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await waApi.sendAlert({ number, message })
    if (res.success) {
      alert('Alert sent successfully!')
      setNumber('')
      setMessage('')
    } else {
      alert('Failed to send alert. Check worker connection.')
    }
    setLoading(false)
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold mb-4">Send Test Alert</h3>
      <form onSubmit={handleSend} className="flex gap-4">
        <Input 
          placeholder="Phone Number (e.g. 62812345678)" 
          value={number} 
          onChange={e => setNumber(e.target.value)} 
          required 
          className="max-w-[200px]"
        />
        <Input 
          placeholder="Alert Message" 
          value={message} 
          onChange={e => setMessage(e.target.value)} 
          required 
        />
        <Button type="submit" disabled={loading} className="ocm-btn-primary">
          {loading ? 'Sending...' : 'Send Alert'}
        </Button>
      </form>
    </Card>
  )
}
