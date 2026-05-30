import React from 'react'

export const Badge = ({ children, variant = 'default', className = '' }: { children: React.ReactNode, variant?: 'default'|'success'|'warning'|'danger', className?: string }) => {
  const variants = {
    default: 'bg-muted text-muted-foreground',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-orange-100 text-orange-800',
    danger: 'bg-red-100 text-red-800'
  }
  return <span className={`ocm-tag ${variants[variant]} ${className}`}>{children}</span>
}
