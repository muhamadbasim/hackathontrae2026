import { createClient } from '@insforge/sdk'

export const hasInsforgeEnv = Boolean(
  import.meta.env.VITE_INSFORGE_BASE_URL &&
  import.meta.env.VITE_INSFORGE_ANON_KEY &&
  !String(import.meta.env.VITE_INSFORGE_BASE_URL).includes('your-project')
)

export const insforge = createClient({
  baseUrl: import.meta.env.VITE_INSFORGE_BASE_URL || 'https://demo.insforge.app',
  anonKey: import.meta.env.VITE_INSFORGE_ANON_KEY || 'demo-key',
})
