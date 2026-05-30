import React from 'react'
import { Badge } from './ui/Badge'
import { LogOut } from 'lucide-react'
import { insforge, hasInsforgeEnv } from '../lib/insforge'

export function TopBar({ onLogout }: { onLogout: () => void }) {
  const handleLogout = async () => {
    if (hasInsforgeEnv) {
      await insforge.auth.signOut()
    }
    localStorage.removeItem('scalechat_user')
    localStorage.removeItem('scalechat_token')
    onLogout()
  }

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-xl flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {!hasInsforgeEnv && <Badge variant="warning">Demo Mode</Badge>}
      </div>
      <div className="flex items-center gap-4">
        <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
