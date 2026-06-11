"use client"

import { useMemo, useState } from "react"
import {
  CheckCircle2,
  ChefHat,
  ClipboardList,
  Clock,
  LogOut,
  Package,
  ScanLine,
  Store,
  Utensils,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { JamaLogo } from "@/components/jama/logo"
import { useToast } from "@/components/jama/toast"
import type { EstadoPedido, Pedido } from "@/lib/jama-data"

interface Props {
  pedidos: Pedido[]
  onAvanzar: (id: string, estado: EstadoPedido) => void
  onValidar: (codigo: string) => boolean
  onLogout: () => void
}

export function RestaurantDashboard({
  pedidos,
  onAvanzar,
  onValidar,
  onLogout,
}: Props) {
  const activos = useMemo(
    () => [...pedidos].sort((a, b) => a.creado - b.creado),
    [pedidos],
  )

  const stats = useMemo(
    () => ({
      total: activos.length,
      preparacion: activos.filter((p) => p.estado === "preparacion").length,
      listos: activos.filter((p) => p.estado === "listo").length,
    }),
    [activos],
  )

  return (
    <div className="min-h-screen bg-secondary/40">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <JamaLogo />
            <span className="hidden rounded-full bg-accent/40 px-3 py-1 text-xs font-semibold text-accent-foreground sm:inline">
              Panel del Restaurante
            </span>
          </div>
          <Button
            variant="outline"
            onClick={onLogout}
            className="rounded-full font-medium transition-transform hover:scale-[1.02]"
          >
            <LogOut className="size-4" />
            Cerrar Sesión
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground">Cocina en vivo</h1>
        <p className="mt-1 text-muted-foreground">
          Gestiona la cola de despacho y valida las entregas en tiempo real.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3 sm:max-w-lg">
          <StatCard icon={ClipboardList} label="En cola" value={stats.total} />
          <StatCard icon={ChefHat} label="Preparando" value={stats.preparacion} />
          <StatCard icon={CheckCircle2} label="Listos" value={stats.listos} />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
              <ClipboardList className="size-5 text-primary" />
              Cola de despacho
            </h2>
            {activos.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {activos.map((p) => (
                  <TicketCard key={p.id} pedido={p} onAvanzar={onAvanzar} />
                ))}
              </div>
            )}
          </section>

          <Validador onValidar={onValidar} />
        </div>
      </main>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ClipboardList
  label: string
  value: number
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <Icon className="size-5 text-primary" />
      <p className="mt-2 text-2xl font-extrabold text-card-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

function TicketCard({
  pedido,
  onAvanzar,
}: {
  pedido: Pedido
  onAvanzar: (id: string, estado: EstadoPedido) => void
}) {
  const bg = {
    recibido: "bg-card border-border",
    preparacion: "bg-warning/15 border-warning/40",
    listo: "bg-success/15 border-success/40",
  }[pedido.estado]

  return (
    <article
      className={`rounded-2xl border p-5 transition-all ${bg} animate-in fade-in slide-in-from-bottom-2`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            #{pedido.codigo}
          </p>
          <h3 className="mt-0.5 text-lg font-bold text-card-foreground">
            {pedido.plato}
          </h3>
        </div>
        <ModalPill modalidad={pedido.modalidad} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Store className="size-3.5" />
          {pedido.restaurante}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="size-3.5" />
          {pedido.hora}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button
          size="sm"
          variant={pedido.estado === "preparacion" ? "default" : "outline"}
          onClick={() => onAvanzar(pedido.id, "preparacion")}
          disabled={pedido.estado !== "recibido"}
          className="rounded-xl font-semibold transition-transform hover:scale-[1.02]"
        >
          <ChefHat className="size-4" />
          En Preparación
        </Button>
        <Button
          size="sm"
          onClick={() => onAvanzar(pedido.id, "listo")}
          disabled={pedido.estado === "listo"}
          className="rounded-xl bg-success font-semibold text-success-foreground transition-transform hover:scale-[1.02] hover:bg-success/90"
        >
          <CheckCircle2 className="size-4" />
          Listo
        </Button>
      </div>
    </article>
  )
}

function ModalPill({ modalidad }: { modalidad: Pedido["modalidad"] }) {
  const isDine = modalidad === "dine-in"
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-xs font-semibold text-foreground">
      {isDine ? <Utensils className="size-3.5" /> : <Package className="size-3.5" />}
      {isDine ? "En local" : "Para llevar"}
    </span>
  )
}

function Validador({
  onValidar,
}: {
  onValidar: (codigo: string) => boolean
}) {
  const [codigo, setCodigo] = useState("")
  const [feedback, setFeedback] = useState<"idle" | "ok" | "error">("idle")
  const { notify } = useToast()

  function validar(e: React.FormEvent) {
    e.preventDefault()
    const limpio = codigo.trim().replace(/^#/, "").toUpperCase()
    if (!limpio) return
    const ok = onValidar(limpio)
    if (ok) {
      setFeedback("ok")
      notify({
        tone: "success",
        title: "Entrega validada",
        message: `Pedido #${limpio} entregado. Comisión cobrada.`,
      })
      setCodigo("")
      setTimeout(() => setFeedback("idle"), 1800)
    } else {
      setFeedback("error")
      setTimeout(() => setFeedback("idle"), 1800)
    }
  }

  return (
    <aside className="h-fit rounded-3xl border border-border bg-card p-6 lg:sticky lg:top-24">
      <h2 className="flex items-center gap-2 text-lg font-bold text-card-foreground">
        <ScanLine className="size-5 text-primary" />
        Validar recojo
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Escanea o ingresa el código de entrega del estudiante.
      </p>

      <form onSubmit={validar} className="mt-4 space-y-3">
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-muted-foreground">
            #
          </span>
          <input
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="JM-4082"
            className={`w-full rounded-xl border bg-background py-3 pl-8 pr-4 font-mono text-foreground outline-none transition-all focus:ring-2 ${
              feedback === "error"
                ? "border-destructive focus:ring-destructive"
                : "border-input focus:ring-ring"
            }`}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="w-full rounded-xl font-semibold transition-transform hover:scale-[1.02]"
        >
          Validar Entrega
        </Button>
      </form>

      {feedback === "ok" && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-success/15 p-3 text-sm font-medium text-success animate-in fade-in zoom-in-95">
          <CheckCircle2 className="size-5" />
          ¡Entrega completada con éxito!
        </div>
      )}
      {feedback === "error" && (
        <div className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm font-medium text-destructive animate-in fade-in">
          Código no válido o ya entregado.
        </div>
      )}
    </aside>
  )
}

function EmptyState() {
  return (
    <div className="mt-4 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 p-12 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
        <ClipboardList className="size-6" />
      </span>
      <p className="mt-4 font-semibold text-foreground">Sin pedidos en cola</p>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        Los tickets de los estudiantes aparecerán aquí automáticamente cuando
        reserven.
      </p>
    </div>
  )
}
