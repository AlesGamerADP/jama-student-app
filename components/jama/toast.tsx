"use client"

import { createContext, useCallback, useContext, useState } from "react"
import { Bell, CheckCircle2, X } from "lucide-react"

type ToastTone = "info" | "success"
interface Toast {
  id: number
  title: string
  message: string
  tone: ToastTone
}

interface ToastCtx {
  notify: (t: Omit<Toast, "id">) => void
}

const Ctx = createContext<ToastCtx | null>(null)

export function useToast() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useToast must be used within ToastProvider")
  return ctx
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const notify = useCallback((t: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { ...t, id }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id))
    }, 4500)
  }, [])

  const dismiss = (id: number) =>
    setToasts((prev) => prev.filter((x) => x.id !== id))

  return (
    <Ctx.Provider value={{ notify }}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-lg shadow-black/5 animate-in slide-in-from-right-4 fade-in"
          >
            <span
              className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${
                t.tone === "success"
                  ? "bg-success/15 text-success"
                  : "bg-primary/15 text-primary"
              }`}
            >
              {t.tone === "success" ? (
                <CheckCircle2 className="size-4" />
              ) : (
                <Bell className="size-4" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-card-foreground">
                {t.title}
              </p>
              <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                {t.message}
              </p>
            </div>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Cerrar notificación"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}
