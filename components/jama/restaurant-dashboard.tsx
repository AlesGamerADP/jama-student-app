"use client"

import { useMemo, useState } from "react"
import {
  CheckCircle2,
  ChefHat,
  ClipboardList,
  Clock,
  Package,
  Plus,
  Trash2,
  TrendingUp,
  Utensils,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { JamaLogo } from "@/components/jama/logo"
import { useToast } from "@/components/jama/toast"
import {
  formatPrecio,
  type EstadoPedido,
  type MenuDelDia,
  type Pedido,
  type Plato,
  type Segundo,
} from "@/lib/jama-data"

interface Props {
  menu: MenuDelDia
  platos: Plato[]
  pedidos: Pedido[]
  ingresos: number
  onAvanzar: (id: string, estado: EstadoPedido) => void
  onValidar: (codigo: string) => boolean
  onEditarPlato: (
    id: number,
    cambios: { nombre: string; precio: number; stock: number },
  ) => void
  onEditarEntradas: (entradas: string[]) => void
  onEditarSegundos: (segundos: Segundo[]) => void
  onLogout: () => void
}

export function RestaurantDashboard({
  menu,
  platos,
  pedidos,
  ingresos,
  onAvanzar,
  onValidar,
  onEditarPlato,
  onEditarEntradas,
  onEditarSegundos,
  onLogout,
}: Props) {
  const [tab, setTab] = useState<"cola" | "menus">("cola")

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
      <header className="sticky top-12 z-40 border-b border-border bg-background/80 backdrop-blur-md">
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
            Cerrar Sesión
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground">Cocina en vivo</h1>
        <p className="mt-1 text-muted-foreground">
          Gestiona el Menú del Día, la cola de despacho y valida entregas en tiempo
          real.
        </p>

        {/* KPIs: Ingresos del día + métricas de cola */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-primary/30 bg-primary p-5 text-primary-foreground shadow-lg shadow-primary/20 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <TrendingUp className="size-5" />
              <span className="text-sm font-medium">Ingresos de Hoy</span>
            </div>
            <p className="mt-2 text-3xl font-extrabold tabular-nums">
              {formatPrecio(ingresos)}
            </p>
            <p className="mt-1 text-xs text-primary-foreground/80">
              Suma automática de todas las compras del menú
            </p>
          </div>
          <StatCard icon={ClipboardList} label="En cola" value={stats.total} />
          <StatCard icon={ChefHat} label="Preparando" value={stats.preparacion} />
          <StatCard icon={CheckCircle2} label="Listos" value={stats.listos} />
        </div>

        {/* Pestañas internas */}
        <div className="mt-8 inline-flex rounded-full border border-border bg-card p-1">
          <TabBtn active={tab === "cola"} onClick={() => setTab("cola")}>
            <ClipboardList className="size-4" />
            Cola de Despacho
          </TabBtn>
          <TabBtn active={tab === "menus"} onClick={() => setTab("menus")}>
            <Utensils className="size-4" />
            Menú del Día
          </TabBtn>
        </div>

        {tab === "cola" ? (
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
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
        ) : (
          <MenuManager
            menu={menu}
            onEditarEntradas={onEditarEntradas}
            onEditarSegundos={onEditarSegundos}
          />
        )}
      </main>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className: string }>
  label: string
  value: number
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-extrabold text-foreground">{value}</p>
    </div>
  )
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  )
}

function TicketCard({
  pedido,
  onAvanzar,
}: {
  pedido: Pedido
  onAvanzar: (id: string, estado: EstadoPedido) => void
}) {
  const estadoConfig: Record<
    Pedido["estado"],
    { bg: string; next: Pedido["estado"]; label: string }
  > = {
    recibido: {
      bg: "bg-blue-100",
      next: "preparacion",
      label: "Recibido",
    },
    preparacion: {
      bg: "bg-yellow-100",
      next: "listo",
      label: "Preparando",
    },
    listo: {
      bg: "bg-green-100",
      next: "listo",
      label: "¡Listo!",
    },
  }

  const config = estadoConfig[pedido.estado]

  return (
    <div
      className={`rounded-2xl border border-border p-4 ${config.bg} space-y-3`}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-muted-foreground">
            #{pedido.codigo}
          </p>
          <p className="mt-1 font-bold text-foreground">
            {pedido.entrada ? `${pedido.entrada} + ${pedido.segundo}` : pedido.plato}
          </p>
          <p className="text-xs text-muted-foreground">{pedido.hora}</p>
        </div>
        <span className="flex-shrink-0 rounded-full bg-background/50 px-2.5 py-1 text-xs font-semibold text-foreground">
          {config.label}
        </span>
      </div>

      {pedido.estado !== "listo" && (
        <Button
          onClick={() => onAvanzar(pedido.id, config.next)}
          size="sm"
          className="w-full rounded-xl"
        >
          Avanzar a{" "}
          {config.next === "preparacion"
            ? "Preparación"
            : "Listo"}
        </Button>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-secondary/20 py-12">
      <Package className="size-12 text-muted-foreground/40" />
      <p className="mt-3 text-sm font-medium text-muted-foreground">
        No hay pedidos en la cola
      </p>
      <p className="text-xs text-muted-foreground">
        Los pedidos de los estudiantes aparecerán aquí
      </p>
    </div>
  )
}

function Validador({ onValidar }: { onValidar: (codigo: string) => boolean }) {
  const [codigo, setCodigo] = useState("")
  const [resultado, setResultado] = useState<"ok" | "error" | null>(null)
  const { notify } = useToast()

  function validar() {
    const ok = onValidar(codigo.toUpperCase())
    setResultado(ok ? "ok" : "error")
    setCodigo("")
    if (ok) {
      notify({
        tone: "success",
        title: "Pedido entregado",
        message: "El estudiante ha recogido su orden exitosamente.",
      })
    } else {
      notify({
        tone: "info",
        title: "Código inválido",
        message: "El código no coincide con ningún pedido activo.",
      })
    }
    setTimeout(() => setResultado(null), 2000)
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="font-bold text-foreground">Validar entrega</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Ingresa el código del estudiante para confirmar la entrega
      </p>

      <div className="mt-4 space-y-3">
        <input
          type="text"
          placeholder="ej: JM-1234"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && validar()}
          className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm font-mono text-foreground outline-none transition-shadow focus:ring-2 focus:ring-ring"
        />

        <Button
          onClick={validar}
          disabled={!codigo || resultado !== null}
          size="sm"
          className="w-full rounded-xl"
        >
          Validar entrega
        </Button>
      </div>

      {resultado === "ok" && (
        <p className="mt-3 flex items-center gap-1.5 rounded-xl bg-success/20 p-2.5 text-xs font-medium text-success">
          <CheckCircle2 className="size-4" />
          ¡Pedido entregado correctamente!
        </p>
      )}
      {resultado === "error" && (
        <p className="mt-3 flex items-center gap-1.5 rounded-xl bg-destructive/20 p-2.5 text-xs font-medium text-destructive">
          <X className="size-4" />
          Código no válido
        </p>
      )}
    </div>
  )
}

function MenuManager({
  menu,
  onEditarEntradas,
  onEditarSegundos,
}: {
  menu: MenuDelDia
  onEditarEntradas: (entradas: string[]) => void
  onEditarSegundos: (segundos: Segundo[]) => void
}) {
  const [entradas, setEntradas] = useState(menu.entradas)
  const [nuevaEntrada, setNuevaEntrada] = useState("")
  const [segundos, setSegundos] = useState(menu.segundos)
  const [editandoSegundo, setEditandoSegundo] = useState<number | null>(null)
  const { notify } = useToast()

  function agregarEntrada() {
    if (!nuevaEntrada.trim()) return
    const nuevas = [...entradas, nuevaEntrada.trim()]
    setEntradas(nuevas)
    setNuevaEntrada("")
    onEditarEntradas(nuevas)
  }

  function eliminarEntrada(index: number) {
    const nuevas = entradas.filter((_, i) => i !== index)
    setEntradas(nuevas)
    onEditarEntradas(nuevas)
  }

  function actualizarSegundo(id: number, nombre: string, stock: number) {
    const nuevos = segundos.map((s) =>
      s.id === id ? { ...s, nombre, stock } : s,
    )
    setSegundos(nuevos)
    onEditarSegundos(nuevos)
    setEditandoSegundo(null)
  }

  function eliminarSegundo(id: number) {
    const nuevos = segundos.filter((s) => s.id !== id)
    setSegundos(nuevos)
    onEditarSegundos(nuevos)
  }

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-2">
      {/* Entradas */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-lg font-bold text-foreground">Entradas disponibles</h3>
        <p className="text-sm text-muted-foreground">
          Los estudiantes elegirán una para su menú
        </p>

        <div className="mt-4 space-y-2">
          {entradas.map((entrada, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-2 rounded-xl border border-input bg-background px-3 py-2.5"
            >
              <span className="text-sm text-foreground">{entrada}</span>
              <button
                onClick={() => eliminarEntrada(index)}
                className="text-muted-foreground transition-colors hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Ej: Papa a la Huancaína"
            value={nuevaEntrada}
            onChange={(e) => setNuevaEntrada(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && agregarEntrada()}
            className="flex-1 rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-shadow focus:ring-2 focus:ring-ring"
          />
          <Button
            onClick={agregarEntrada}
            disabled={!nuevaEntrada.trim()}
            size="sm"
            className="rounded-xl"
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>

      {/* Segundos */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-lg font-bold text-foreground">Segundos disponibles</h3>
        <p className="text-sm text-muted-foreground">
          Gestiona el nombre y stock de cada plato fuerte
        </p>

        <div className="mt-4 space-y-3">
          {segundos.map((segundo) => (
            <div
              key={segundo.id}
              className="flex items-center justify-between gap-2 rounded-xl border border-input bg-background px-3 py-2.5"
            >
              {editandoSegundo === segundo.id ? (
                <div className="flex flex-1 gap-2">
                  <input
                    type="text"
                    defaultValue={segundo.nombre}
                    onBlur={(e) =>
                      actualizarSegundo(segundo.id, e.target.value, segundo.stock)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        actualizarSegundo(
                          segundo.id,
                          (e.target as HTMLInputElement).value,
                          segundo.stock,
                        )
                      }
                    }}
                    className="flex-1 rounded-lg border border-primary bg-primary/10 px-2 py-1 text-sm text-foreground outline-none"
                    autoFocus
                  />
                  <input
                    type="number"
                    defaultValue={segundo.stock}
                    onBlur={(e) =>
                      actualizarSegundo(
                        segundo.id,
                        segundo.nombre,
                        Number(e.target.value),
                      )
                    }
                    className="w-16 rounded-lg border border-primary bg-primary/10 px-2 py-1 text-sm text-foreground outline-none"
                  />
                </div>
              ) : (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {segundo.nombre}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {segundo.stock} disponibles
                    </p>
                  </div>
                  <button
                    onClick={() => setEditandoSegundo(segundo.id)}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Utensils className="size-4" />
                  </button>
                  <button
                    onClick={() => eliminarSegundo(segundo.id)}
                    className="text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
