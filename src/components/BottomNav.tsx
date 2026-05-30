import React from 'react'
import { OPENCRM_NAV_ITEMS, isActivePath } from '../lib/opencrm-navigation'
import { Menu } from 'lucide-react'

export function BottomNav({ activePath, onNavigate }: { activePath: string, onNavigate: (p: string) => void }) {
  const preferred = ['/dashboard', '/chat', '/customers', '/flows']
  const items = OPENCRM_NAV_ITEMS.filter(item => preferred.includes(item.path))

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-border bg-card flex items-center justify-around px-2 z-50">
      {items.map(item => {
        const Icon = item.icon
        const active = isActivePath(activePath, item.path)
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.path)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${active ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        )
      })}
      <button className="flex flex-col items-center justify-center w-full h-full space-y-1 text-muted-foreground">
        <Menu className="w-5 h-5" />
        <span className="text-[10px] font-medium">Menu</span>
      </button>
    </nav>
  )
}
