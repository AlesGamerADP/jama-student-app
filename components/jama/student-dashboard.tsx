"use client"

import { useMemo, useState } from "react"
import {
  Apple,
  CreditCard,
  Lock,
  LogOut,
  Package,
  ShoppingBag,
  Smartphone,
  Store,
  Wallet,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { JamaLogo } from "@/components/jama/logo"
import { Ticket } from "@/components/jama/ticket"
import { useToast } from "@/components/jama/toast"
import {
  formatPrecio,
<<<<<<< HEAD
  getEntradosForRestaurant,
  getMenuForRestaurant,
=======
>>>>>>> main
  stockInfo,
  type MetodoPago,
  type Pedido,
  type Plato,
  type RestaurantMenu,
  type Segundo,
} from "@/lib/jama-data"

interface Props {
  platos: Plato[]
  pedidos: Pedido[]
  restaurantMenus: Record<string, RestaurantMenu>
  onReservar: (plato: Plato, entrada: string, segundo: Segundo, metodoPago: MetodoPago) => Pedido
  onLogout: () => void
}

export function StudentDashboard({
  platos,
  pedidos,
  restaurantMenus,
  onReservar,
  onLogout,
}: Props) {
<<<<<<< HEAD
  const [filtro, setFiltro] = useState<"Todos" | string>("Todos")
  const [selectedPlato, setSelectedPlato] = useState<Plato | null>(null)
  const [selectedEntrada, setSelectedEntrada] = useState<string>("")
  const [selectedSegundo, setSelectedSegundo] = useState<Segundo | null>(null)
  const [metodoPago, setMetodoPago] = useState<MetodoPago>("tarjeta")
  const [procesando, setProcesando] = useState(false)
=======
  const [checkout, setCheckout] = useState<Plato | null>(null)
>>>>>>> main
  const [ticket, setTicket] = useState<Pedido | null>(null)
  const { notify } = useToast()

  const misPedidos = useMemo(
    () => [...pedidos].sort((a, b) => b.creado - a.creado),
    [pedidos],
  )

<<<<<<< HEAD
  const platosEnFilas = useMemo(() => {
    const f = filtro === "Todos" ? platos : platos.filter((p) => p.restaurante === filtro)
    return f.sort((a, b) => a.id - b.id)
  }, [filtro, platos])

  const restaurantes = useMemo(
    () => ["Todos", ...new Set(platos.map((p) => p.restaurante))],
    [platos],
  )

  function confirmarReserva() {
    if (!selectedPlato || !selectedEntrada || !selectedSegundo) {
      notify({
        tone: "info",
        title: "Campos incompletos",
        message: "Debes seleccionar entrada y segundo.",
      })
      return
    }

    setProcesando(true)
    notify({
      tone: "info",
      title: "Procesando pago...",
      message: `Validando tu ${metodoPago === "tarjeta" ? "tarjeta" : "Yape/Plin"}.`,
    })

    setTimeout(() => {
      const pedido = onReservar(selectedPlato, selectedEntrada, selectedSegundo, metodoPago)
      setTicket(pedido)
      setSelectedPlato(null)
      setSelectedEntrada("")
      setSelectedSegundo(null)
      setProcesando(false)
    }, 1300)
  }

  if (ticket) {
    return (
      <main className="min-h-screen bg-background py-8">
        <div className="mx-auto max-w-md px-4 sm:px-6">
          <Ticket
            pedido={ticket}
            onClose={() => {
              setTicket(null)
              setFiltro("Todos")
            }}
          />
        </div>
      </main>
    )
=======
  function confirmar(metodo: MetodoPago) {
    if (!checkout) return
    const pedido = onReservar(checkout, "Inmediato", metodo)
    setCheckout(null)
    setTicket(pedido)
>>>>>>> main
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      <header className="sticky top-12 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <JamaLogo />
              <h1 className="text-xl font-bold text-foreground">Catálogo del Campus</h1>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={onLogout}
              className="rounded-full"
            >
              <LogOut className="size-4" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
            Filtrar por restaurante
          </h2>
          <div className="flex flex-wrap gap-2">
            {restaurantes.map((rest) => (
              <button
                key={rest}
                onClick={() => setFiltro(rest)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                  filtro === rest
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50"
                }`}
              >
                {rest}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {platosEnFilas.map((plato) => (
            <PlatoCard
              key={plato.id}
              plato={plato}
<<<<<<< HEAD
              onSelect={() => {
                setSelectedPlato(plato)
                setSelectedEntrada("")
                setSelectedSegundo(null)
              }}
=======
              onReservar={() => setCheckout(plato)}
>>>>>>> main
            />
          ))}
        </div>

        {selectedPlato && (
          <ReservaModal
            plato={selectedPlato}
            restaurantMenus={restaurantMenus}
            selectedEntrada={selectedEntrada}
            selectedSegundo={selectedSegundo}
            metodoPago={metodoPago}
            procesando={procesando}
            onEntradaChange={setSelectedEntrada}
            onSegundoChange={setSelectedSegundo}
            onMetodoPagoChange={setMetodoPago}
            onConfirmar={confirmarReserva}
            onClose={() => {
              setSelectedPlato(null)
              setSelectedEntrada("")
              setSelectedSegundo(null)
            }}
          />
        )}
<<<<<<< HEAD
=======
      </main>

      {checkout && (
        <CheckoutModal
          plato={checkout}
          onClose={() => setCheckout(null)}
          onConfirm={confirmar}
        />
      )}

      {ticket && <Ticket pedido={ticket} onClose={() => setTicket(null)} />}
    </div>
  )
}

function DashboardHeader({ onLogout }: { onLogout: () => void }) {
  return (
    <header className="sticky top-12 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <JamaLogo />
          <span className="hidden rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary sm:inline">
            Panel del Estudiante
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
>>>>>>> main
      </div>
    </main>
  )
}

<<<<<<< HEAD
function PlatoCard({ plato, onSelect }: { plato: Plato; onSelect: () => void }) {
=======
function PlatoCard({
  plato,
  onReservar,
}: {
  plato: Plato
  onReservar: () => void
}) {
>>>>>>> main
  const info = stockInfo(plato.stock)

  return (
    <article
      onClick={onSelect}
      className="flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all hover:shadow-lg hover:shadow-black/5 hover:scale-[1.02]"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={plato.imagen || "/placeholder.svg"}
          alt={plato.nombre}
          className="size-full object-cover transition-transform hover:scale-105"
          crossOrigin="anonymous"
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur">
          {plato.etiqueta}
        </span>
        <div className="absolute right-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-xs font-bold text-primary-foreground backdrop-blur">
          {plato.restaurante}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-bold text-card-foreground">{plato.nombre}</h3>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
          {plato.descripcion}
        </p>
<<<<<<< HEAD
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-bold text-foreground">{formatPrecio(plato.precio)}</span>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              info.tone === "success"
                ? "bg-success/10 text-success"
                : info.tone === "warning"
                  ? "bg-warning/10 text-warning"
                  : "bg-destructive/10 text-destructive"
            }`}
=======

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-accent/30 px-3 py-2 text-xs font-semibold text-accent-foreground">
          <Package className="size-4" />
          Modalidad: Recojo Rápido (Para Llevar)
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="text-xl font-extrabold text-foreground">
            {formatPrecio(plato.precio)}
          </span>
          <Button
            onClick={() => onReservar()}
            disabled={info.disabled}
            className="rounded-xl font-semibold transition-transform hover:scale-[1.02]"
>>>>>>> main
          >
            {info.label}
          </span>
        </div>
      </div>
    </article>
  )
}

function ReservaModal({
  plato,
<<<<<<< HEAD
  restaurantMenus,
  selectedEntrada,
  selectedSegundo,
  metodoPago,
  procesando,
  onEntradaChange,
  onSegundoChange,
  onMetodoPagoChange,
  onConfirmar,
=======
>>>>>>> main
  onClose,
}: {
  plato: Plato
<<<<<<< HEAD
  restaurantMenus: Record<string, RestaurantMenu>
  selectedEntrada: string
  selectedSegundo: Segundo | null
  metodoPago: MetodoPago
  procesando: boolean
  onEntradaChange: (entrada: string) => void
  onSegundoChange: (segundo: Segundo | null) => void
  onMetodoPagoChange: (metodo: MetodoPago) => void
  onConfirmar: () => void
=======
>>>>>>> main
  onClose: () => void
}) {
  const menu = getMenuForRestaurant(plato.restaurante)
  if (!menu) return null

  const entradas = menu.entradas
  const segundosDisponibles = menu.segundos.filter((s) => s.stock > 0)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 backdrop-blur-sm sm:items-center">
      <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl border border-border bg-card shadow-2xl animate-in fade-in slide-in-from-bottom-4">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card p-5">
          <h3 className="flex items-center gap-2 text-lg font-bold text-card-foreground">
            <ShoppingBag className="size-5 text-primary" />
            Armar tu menú
          </h3>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3 rounded-2xl bg-secondary p-3">
            <img
              src={plato.imagen || "/placeholder.svg"}
              alt={plato.nombre}
              className="size-12 rounded-xl object-cover"
              crossOrigin="anonymous"
            />
            <div className="min-w-0 flex-1">
<<<<<<< HEAD
              <p className="truncate font-semibold text-card-foreground">{plato.nombre}</p>
              <p className="text-xs text-muted-foreground">{plato.restaurante}</p>
=======
              <p className="truncate font-semibold text-card-foreground">
                {plato.nombre}
              </p>
              <p className="text-sm text-muted-foreground">
                {plato.restaurante}
              </p>
>>>>>>> main
            </div>
            <span className="font-bold text-foreground">{formatPrecio(plato.precio)}</span>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-muted-foreground">
              Elige tu entrada
            </label>
            <select
              value={selectedEntrada}
              onChange={(e) => onEntradaChange(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Selecciona una entrada...</option>
              {entradas.map((entrada) => (
                <option key={entrada} value={entrada}>
                  {entrada}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-muted-foreground">
              Elige tu segundo (plato fuerte)
            </label>
            <select
              value={selectedSegundo?.id || ""}
              onChange={(e) => {
                const id = parseInt(e.target.value)
                const segundo = segundosDisponibles.find((s) => s.id === id)
                onSegundoChange(segundo || null)
              }}
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Selecciona un segundo...</option>
              {segundosDisponibles.map((segundo) => (
                <option key={segundo.id} value={segundo.id}>
                  {segundo.nombre} ({segundo.stock} disponibles)
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl bg-secondary p-3 text-sm flex items-center gap-2">
            <Package className="size-4 text-primary" />
            <span className="font-semibold text-card-foreground">Modalidad: Recojo Rápido (Para Llevar)</span>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-card-foreground">Método de pago</p>
            <div className="grid grid-cols-2 gap-2">
              <MetodoTab
                active={metodoPago === "tarjeta"}
                onClick={() => onMetodoPagoChange("tarjeta")}
                icon={<CreditCard className="size-5" />}
                label="Tarjeta"
              />
              <MetodoTab
                active={metodoPago === "billetera"}
                onClick={() => onMetodoPagoChange("billetera")}
                icon={<Wallet className="size-5" />}
                label="Yape / Plin"
              />
            </div>
          </div>

          <Button
            onClick={onConfirmar}
            disabled={
              procesando || !selectedEntrada || !selectedSegundo
            }
            size="lg"
            className="w-full rounded-xl font-semibold transition-transform hover:scale-[1.02]"
          >
            <Lock className="size-5" />
            {procesando ? "Procesando..." : `Reservar y Pagar ${formatPrecio(plato.precio)}`}
          </Button>

          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
            <Lock className="size-3" />
            Transacción cifrada · Demo simulada
          </p>
        </div>
      </div>
    </div>
  )
}

function MetodoTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border px-3 py-2 text-center text-xs font-semibold transition-all ${
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-input bg-background text-muted-foreground hover:border-primary/50"
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
