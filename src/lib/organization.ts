export const demoOrg = {
  id: 'demo-org',
  name: 'Demo Business',
  slug: 'demo-business',
  appId: 'demo-app'
}

export function initDemoOrg() {
  localStorage.setItem('scalechat_org_id', demoOrg.id)
  localStorage.setItem('scalechat_org_slug', demoOrg.slug)
  localStorage.setItem('scalechat_org_name', demoOrg.name)
  localStorage.setItem('scalechat_app_id', demoOrg.appId)
  document.cookie = `scalechat_org_slug=${demoOrg.slug}; path=/`
  document.cookie = `scalechat_app_id=${demoOrg.appId}; path=/`
}
