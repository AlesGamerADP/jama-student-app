"use client"

import { LayoutGrid, Store, Users } from "lucide-react"
import type { View } from "@/components/jama/app-shell"

const TABS: { id: View; label: string; icon: typeof Users }[] = [
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
    <div className="fixed bottom-4 left-1/2 z-[60] -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-full border border-border bg-card/95 p-1.5 shadow-2xl shadow-black/20 backdrop-blur-md">
        <span className="hidden pl-2 pr-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:inline">
          Demo
        </span>
        {TABS.map((tab) => {
          const active = view === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              aria-pressed={active}
              className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-all ${
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <tab.icon className="size-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
