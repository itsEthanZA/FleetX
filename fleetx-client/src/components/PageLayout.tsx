import type { ReactNode } from 'react'
import Sidebar from './Sidebar'

export default function PageLayout({ title, subtitle, actions, children }: { title: string; subtitle?: string; actions?: ReactNode; children: ReactNode }) {
  return <div className="app-shell"><Sidebar /><main className="main-content"><header className="page-header"><div><p className="eyebrow">FLEET MANAGEMENT</p><h1>{title}</h1>{subtitle && <p className="muted">{subtitle}</p>}</div>{actions}</header>{children}</main></div>
}
