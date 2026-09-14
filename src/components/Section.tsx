import type { ReactNode } from 'react'

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="eyebrow">
      <span className="h-1.5 w-1.5 rounded-full bg-leaf-500" />
      {children}
    </span>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = 'left',
}: {
  eyebrow: string
  title: ReactNode
  body?: string
  align?: 'left' | 'center'
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 text-balance font-display text-3xl font-semibold leading-tight text-forest-950 sm:text-4xl">
        {title}
      </h2>
      {body && <p className="mt-4 text-base leading-relaxed text-ink-700">{body}</p>}
    </div>
  )
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-mono text-2xl font-semibold text-forest-950 sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs text-ink-500">{label}</p>
    </div>
  )
}
