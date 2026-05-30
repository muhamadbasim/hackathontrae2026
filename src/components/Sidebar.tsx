import React from 'react'
import { LogOut } from 'lucide-react'
import { OPENCRM_NAV_ITEMS, OPENCRM_GROUP_LABELS, isActivePath } from '../lib/opencrm-navigation'

export function Sidebar({ activePath, onNavigate, onLogout }: { activePath: string, onNavigate: (p: string) => void, onLogout?: () => void }) {
  const groups = ['operasional', 'data', 'outreach', 'otomasi'] as const

  return (
    <aside className="hidden md:flex h-full w-64 flex-col border-r border-gray-100 bg-white">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-orange-200">
          A
        </div>
        <div>
          <div className="font-bold text-[11px] text-gray-900 leading-tight">Autonomous Leads and</div>
          <div className="text-[10px] text-gray-500 font-semibold leading-tight">Customer Relationship Management</div>
          <div className="text-[10px] text-gray-400 font-medium">WhatsApp Agent</div>
        </div>
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
                      className={`w-full group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                        active 
                          ? 'bg-[#FEF2E8] text-primary shadow-sm' 
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${active ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'}`} />
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 space-y-3">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50 border border-gray-100">
          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            MB
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-gray-900 truncate">Muhamad Basim</div>
            <div className="text-[10px] text-gray-500">Admin</div>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 border border-red-100 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}
