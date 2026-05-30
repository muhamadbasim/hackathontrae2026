import {
  LayoutDashboard,
  MessagesSquare,
  Shuffle,
  ShoppingCart,
  Users,
  Package,
  Megaphone,
  Network,
  Bot,
  WandSparkles,
  BookOpen,
  Settings,
} from 'lucide-react'

export type OpenCrmNavGroup = 'operasional' | 'data' | 'outreach' | 'otomasi'

export const OPENCRM_GROUP_LABELS: Record<OpenCrmNavGroup, string> = {
  operasional: 'Operasional',
  data: 'Data',
  outreach: 'Outreach',
  otomasi: 'Otomasi',
}

export const OPENCRM_NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', group: 'operasional', icon: LayoutDashboard },
  { id: 'inbox', label: 'Inbox', path: '/chat', group: 'operasional', icon: MessagesSquare },
  { id: 'handover', label: 'Handover', path: '/handover', group: 'operasional', icon: Shuffle },
  { id: 'orders', label: 'Orders', path: '/orders', group: 'operasional', icon: ShoppingCart },
  { id: 'customers', label: 'Pelanggan', path: '/customers', group: 'data', icon: Users },
  { id: 'products', label: 'Products', path: '/products', group: 'data', icon: Package },
  { id: 'broadcast', label: 'Broadcast', path: '/broadcast', group: 'outreach', icon: Megaphone },
  { id: 'workflow', label: 'Workflow', path: '/flows', group: 'otomasi', icon: Network },
  { id: 'ai-agents', label: 'AI Agents', path: '/ai-agents', group: 'otomasi', icon: Bot },
  { id: 'ai-playground', label: 'AI Playground', path: '/ai', group: 'otomasi', icon: WandSparkles },
  { id: 'knowledge', label: 'Knowledge Base', path: '/knowledge', group: 'otomasi', icon: BookOpen },
  { id: 'settings', label: 'Settings', path: '/settings', group: 'otomasi', icon: Settings },
] as const

export const OPENCRM_ALLOWED_PATHS = [
  '/dashboard',
  '/chat',
  '/handover',
  '/orders',
  '/customers',
  '/products',
  '/broadcast',
  '/flows',
  '/ai-agents',
  '/ai',
  '/knowledge',
  '/settings',
]

export function isActivePath(pathname: string, itemPath: string) {
  return pathname === itemPath || pathname.startsWith(`${itemPath}/`)
}
