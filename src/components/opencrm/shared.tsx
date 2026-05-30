import React from 'react'

export const OpenCrmSectionHeader = ({ title, subtitle, actions }: { title: string, subtitle?: string, actions?: React.ReactNode }) => (
  <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div>
      <h1 className="ocm-section-title">{title}</h1>
      {subtitle && <p className="ocm-section-subtitle mt-1">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
)
