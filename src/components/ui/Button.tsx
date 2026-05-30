import React from 'react'

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({ className = '', ...props }, ref) => (
  <button ref={ref} className={`ocm-btn ${className}`} {...props} />
))
Button.displayName = 'Button'
