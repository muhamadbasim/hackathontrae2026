import { useState, useEffect } from 'react'
import { insforge, hasInsforgeEnv } from '../lib/insforge'

export function useInsforgeAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!hasInsforgeEnv) {
      const demoUser = localStorage.getItem('scalechat_user')
      if (demoUser) {
        setUser(JSON.parse(demoUser))
      }
      setLoading(false)
      return
    }

    insforge.auth.getCurrentUser().then(({ data, error }) => {
      if (data) {
        setUser(data)
        localStorage.setItem('scalechat_user', JSON.stringify(data))
      }
      setLoading(false)
    })
  }, [])

  return { user, loading, setUser }
}
