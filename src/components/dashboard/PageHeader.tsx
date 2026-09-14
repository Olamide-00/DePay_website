import type { LucideIcon } from 'lucide-react'

export default function PageHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon
  title: string
  subtitle: string
}) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-forest-900 text-leaf-400">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h1 className="font-display text-2xl font-semibold text-forest-950">{title}</h1>
        <p className="mt-0.5 text-sm text-ink-700">{subtitle}</p>
      </div>
    </div>
  )
}
