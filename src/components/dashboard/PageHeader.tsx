import type { LucideIcon } from "lucide-react";

export default function PageHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <div className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-forest-900 to-forest-950 text-leaf-400 shadow-lg shadow-forest-900/20 ring-1 ring-inset ring-white/10">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-3 -top-3 h-10 w-10 rounded-full bg-leaf-500/30 blur-xl"
        />
        <Icon className="relative h-5 w-5" />
      </div>
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-forest-950">
          {title}
        </h1>
        <p className="mt-0.5 text-sm text-ink-700">{subtitle}</p>
      </div>
    </div>
  );
}
