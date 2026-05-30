import React from 'react'
import { OPENCRM_NAV_ITEMS, OPENCRM_GROUP_LABELS, isActivePath } from '../lib/opencrm-navigation'

export function Sidebar({ activePath, onNavigate }: { activePath: string, onNavigate: (p: string) => void }) {
  const groups = ['operasional', 'data', 'outreach', 'otomasi'] as const

  return (
    <aside className="hidden md:flex h-full w-72 flex-col border-r border-border bg-card/80 text-card-foreground backdrop-blur-xl">
      <div className="p-6 font-bold text-xl tracking-tight text-primary flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">A</div>
        Autonomous CRM
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {groups.map(group => {
          const items = OPENCRM_NAV_ITEMS.filter(item => item.group === group)
          if (items.length === 0) return null
          
          return (
            <div key={group}>
              <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {OPENCRM_GROUP_LABELS[group]}
              </div>
              <div className="space-y-1">
                {items.map(item => {
                  const Icon = item.icon
                  const active = isActivePath(activePath, item.path)
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.path)}
                      className={`w-full group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        active ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
