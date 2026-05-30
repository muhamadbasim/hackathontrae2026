import React, { useState } from 'react'
import { insforge, hasInsforgeEnv } from '../lib/insforge'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { Input } from './ui/Input'

export function AuthGate({ onAuthSuccess }: { onAuthSuccess: () => void }) {
  const [mode, setMode] = useState<'login'|'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const handleDemo = () => {
    localStorage.setItem('scalechat_user', JSON.stringify({ id: 'demo-user', email: 'demo@opencrm.local', profile: { name: 'Demo Admin' } }))
    onAuthSuccess()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'login') {
      const { data, error } = await insforge.auth.signInWithPassword({ email, password })
      if (!error && data.user) {
        localStorage.setItem('scalechat_user', JSON.stringify(data.user))
        localStorage.setItem('scalechat_token', data.accessToken || '')
        onAuthSuccess()
      } else {
        alert(error?.message || 'Login failed')
      }
    } else {
      const { data, error } = await insforge.auth.signUp({ email, password, name })
      if (!error && data.user) {
        localStorage.setItem('scalechat_user', JSON.stringify(data.user))
        localStorage.setItem('scalechat_token', data.accessToken || '')
        onAuthSuccess()
      } else {
        alert(error?.message || 'Register failed')
      }
    }
  }

  if (!hasInsforgeEnv) {
    return (
      <div className="flex h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md p-6">
          <h2 className="text-2xl font-bold mb-4">Setup Required</h2>
          <p className="text-muted-foreground mb-6">InsForge environment variables are missing. You can continue in demo mode.</p>
          <Button className="w-full ocm-btn-primary" onClick={handleDemo}>Continue in Demo Mode</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">{mode === 'login' ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
          )}
          <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <Button type="submit" className="w-full ocm-btn-primary">{mode === 'login' ? 'Sign In' : 'Sign Up'}</Button>
        </form>
        <div className="mt-4 text-center">
          <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-sm text-primary hover:underline">
            {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
          </button>
        </div>
      </Card>
    </div>
  )
}
