"use client"

import { useMemo, useState } from "react"
import {
  CircleCheck as CheckCircle2,
  ChefHat,
  ClipboardList,
  Package,
  Pencil,
  Plus,
  ScanLine,
  TrendingUp,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { JamaLogo } from "@/components/jama/logo"
import { useToast } from "@/components/jama/toast"
import {
  formatPrecio,
  stockInfo,
  type EstadoPedido,
  type Pedido,
  type Plato,
} from "@/lib/jama-data"

interface Props {
  platos: Plato[]
  pedidos: Pedido[]
  ingresos: number
  onAvanzar: (id: string, estado: EstadoPedido) => void
  onValidar: (codigo: string) => boolean
  onEditarPlato: (
    id: number,
    cambios: { nombre: string; precio: number; stock: number },
  ) => void
  onAgregarPlato: (plato: Omit<Plato, "id">) => void
  onLogout: () => void
}

const CAFE_UNIVALLE = "Café Univalle"

export function RestaurantDashboard({
  platos,
  pedidos,
  ingresos,
  onAvanzar,
  onValidar,
  onEditarPlato,
  onAgregarPlato,
  onLogout,
}: Props) {
  const [tab, setTab] = useState<"cola" | "menus">("cola")
  const [validarCodigo, setValidarCodigo] = useState("")
  const [editando, setEditando] = useState<number | null>(null)

  // Filtrar solo pedidos de Café Univalle
  const pedidosCafe = useMemo(
    () => pedidos.filter((p) => p.restaurante === CAFE_UNIVALLE),
    [pedidos],
  )

  // Filtrar solo platos de Café Univalle
  const platosCafe = useMemo(
    () => platos.filter((p) => p.restaurante === CAFE_UNIVALLE),
    [platos],
  )

  // Calcular ingresos solo de Café Univalle
  const ingresosCafe = useMemo(() => {
    return pedidosCafe.reduce((sum, p) => sum + p.precio, 0)
  }, [pedidosCafe])

  const activos = useMemo(
    () => [...pedidosCafe].sort((a, b) => a.creado - b.creado),
    [pedidosCafe],
  )

  const stats = useMemo(
    () => ({
      total: activos.length,
      preparacion: activos.filter((p) => p.estado === "preparacion").length,
      listos: activos.filter((p) => p.estado === "listo").length,
    }),
    [activos],
  )

  function validarTicket() {
    if (!validarCodigo.trim()) return
    if (onValidar(validarCodigo)) {
      onValidar(validarCodigo)
      setValidarCodigo("")
    }
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      <header className="sticky top-12 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <JamaLogo />
              <span className="hidden rounded-full bg-accent/40 px-3 py-1 text-xs font-semibold text-accent-foreground sm:inline">
                {CAFE_UNIVALLE}
              </span>
            </div>
            <Button size="sm" variant="ghost" onClick={onLogout} className="rounded-full">
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {/* KPI Card */}
        <div className="mb-6 rounded-3xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="size-5 text-primary" />
            <h2 className="text-sm font-semibold text-muted-foreground">Total del Día</h2>
          </div>
          <p className="text-3xl font-bold text-foreground">{formatPrecio(ingresosCafe)}</p>
          <p className="mt-1 text-xs text-muted-foreground">{pedidosCafe.length} pedidos procesados</p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">En cola</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{stats.total - stats.preparacion - stats.listos}</p>
              </div>
              <ClipboardList className="size-8 text-primary/40" />
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Preparando</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{stats.preparacion}</p>
              </div>
              <ChefHat className="size-8 text-warning/40" />
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Listos</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{stats.listos}</p>
              </div>
              <CheckCircle2 className="size-8 text-success/40" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-border">
          <button
            onClick={() => setTab("cola")}
            className={`px-4 py-3 font-medium text-sm transition-colors ${
              tab === "cola"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Cola de Despacho ({stats.total})
          </button>
          <button
            onClick={() => setTab("menus")}
            className={`px-4 py-3 font-medium text-sm transition-colors ${
              tab === "menus"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Mi Menú del Día
          </button>
        </div>

        {tab === "cola" && (
          <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-3">
              {/* Queue */}
              <div className="lg:col-span-2 space-y-3">
                {activos.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border bg-secondary/30 p-8 text-center">
                    <Package className="mx-auto size-12 text-muted-foreground/40" />
                    <p className="mt-2 text-sm text-muted-foreground">Sin pedidos por el momento</p>
                  </div>
                ) : (
                  activos.map((pedido) => (
                    <div
                      key={pedido.id}
                      className="rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-card-foreground">#{pedido.codigo}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {pedido.entrada} + {pedido.plato}
                          </p>
                        </div>
                        <span
                          className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
                            pedido.estado === "recibido"
                              ? "bg-info/10 text-info"
                              : pedido.estado === "preparacion"
                                ? "bg-warning/10 text-warning"
                                : "bg-success/10 text-success"
                          }`}
                        >
                          {pedido.estado === "recibido"
                            ? "Recibido"
                            : pedido.estado === "preparacion"
                              ? "En Preparación"
                              : "Listo"}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        {pedido.estado === "recibido" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onAvanzar(pedido.id, "preparacion")}
                            className="flex-1 text-xs"
                          >
                            Iniciar Preparación
                          </Button>
                        )}
                        {pedido.estado === "preparacion" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onAvanzar(pedido.id, "listo")}
                            className="flex-1 text-xs"
                          >
                            Marcar como Listo
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Validator */}
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <ScanLine className="size-4 text-primary" />
                  <h3 className="font-semibold text-card-foreground text-sm">Validar Entrega</h3>
                </div>
                <input
                  type="text"
                  placeholder="Escanea o ingresa código QR"
                  value={validarCodigo}
                  onChange={(e) => setValidarCodigo(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && validarTicket()}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring mb-2"
                />
                <Button
                  onClick={validarTicket}
                  size="sm"
                  className="w-full rounded-xl text-xs"
                >
                  Validar
                </Button>
              </div>
            </div>
          </div>
        )}

        {tab === "menus" && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Entradas */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <h3 className="font-semibold text-card-foreground mb-4">Entradas de Café Univalle</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Papa a la Huancaína</p>
                <p>Sopa Criolla</p>
                <p>Ensalada Rusa</p>
              </div>
            </div>

            {/* Segundos */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <h3 className="font-semibold text-card-foreground mb-4">Platos del Día</h3>
              <div className="space-y-3">
                {platosCafe.map((plato) => (
                  <div key={plato.id} className="flex items-center justify-between rounded-xl border border-input p-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-card-foreground text-sm">{plato.nombre}</p>
                      <p className="text-xs text-muted-foreground">{formatPrecio(plato.precio)} · Stock: {plato.stock}</p>
                    </div>
                    <Button size="sm" variant="ghost" className="text-primary">
                      <Pencil className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
