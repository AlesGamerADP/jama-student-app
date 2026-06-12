"use client"

import { LayoutGrid, Store, Users } from "lucide-react"
import type { View } from "@/components/jama/app-shell"

const TABS: { id: View; label: string; icon: typeof LayoutGrid }[] = [
  { id: "landing", label: "Landing", icon: LayoutGrid },
  { id: "alumno", label: "Estudiante", icon: Users },
  { id: "restaurante", label: "Restaurante", icon: Store },
]

export function ViewSwitcher({
  view,
  onChange,
}: {
  view: View
  onChange: (v: View) => void
}) {
  return (
    <div className="fixed inset-x-0 top-0 z-[60] border-b border-border bg-foreground text-background">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <span className="hidden text-xs font-semibold uppercase tracking-wide text-background/60 sm:block">
          Demo · Cambio rápido de vista
        </span>
        <div
          role="tablist"
          aria-label="Cambiar de vista"
          className="flex items-center gap-1 rounded-full bg-background/10 p-1"
        >
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = view === id
            return (
              <button
                key={id}
                role="tab"
                aria-selected={active}
                onClick={() => onChange(id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-background/80 hover:bg-background/10"
                }`}
              >
                <Icon className="size-4" />
                {label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
