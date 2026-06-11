"use client"

import { useMemo, useState } from "react"
import {
  Apple,
  Clock,
  CreditCard,
  Lock,
  LogOut,
  Package,
  ShoppingBag,
  Smartphone,
  Store,
  Utensils,
  Wallet,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { JamaLogo } from "@/components/jama/logo"
import { Ticket } from "@/components/jama/ticket"
import { useToast } from "@/components/jama/toast"
import {
  formatPrecio,
  HORARIOS,
  stockInfo,
  type MetodoPago,
  type Modalidad,
  type Pedido,
  type Plato,
} from "@/lib/jama-data"

interface Props {
  platos: Plato[]
  pedidos: Pedido[]
  onReservar: (
    plato: Plato,
    hora: string,
    modalidad: Modalidad,
    metodoPago: MetodoPago,
  ) => Pedido
  onLogout: () => void
}

export function StudentDashboard({
  platos,
  pedidos,
  onReservar,
  onLogout,
}: Props) {
  const [checkout, setCheckout] = useState<{
    plato: Plato
    hora: string
    modalidad: Modalidad
  } | null>(null)
  const [ticket, setTicket] = useState<Pedido | null>(null)

  const misPedidos = useMemo(
    () => [...pedidos].sort((a, b) => b.creado - a.creado),
    [pedidos],
  )

  function confirmar(metodo: MetodoPago) {
    if (!checkout) return
    const pedido = onReservar(
      checkout.plato,
      checkout.hora,
      checkout.modalidad,
      metodo,
    )
    setCheckout(null)
    setTicket(pedido)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onLogout={onLogout} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Menú del Día</h1>
            <p className="mt-1 text-muted-foreground">
              Reserva, paga por adelantado y recoge sin filas.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground">
            <ShoppingBag className="size-4 text-primary" />
            {misPedidos.length} pedido{misPedidos.length === 1 ? "" : "s"} activo
            {misPedidos.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {platos.map((plato) => (
            <PlatoCard
              key={plato.id}
              plato={plato}
              onReservar={(hora, modalidad) =>
                setCheckout({ plato, hora, modalidad })
              }
            />
          ))}
        </div>

        {misPedidos.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-foreground">Mis pedidos</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {misPedidos.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setTicket(p)}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-transform hover:scale-[1.02]"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-card-foreground">
                      {p.plato}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {p.hora} · #{p.codigo}
                    </p>
                  </div>
                  <EstadoBadge estado={p.estado} />
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      {checkout && (
        <CheckoutModal
          plato={checkout.plato}
          hora={checkout.hora}
          modalidad={checkout.modalidad}
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
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
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
      </div>
    </header>
  )
}

function PlatoCard({
  plato,
  onReservar,
}: {
  plato: Plato
  onReservar: (hora: string, modalidad: Modalidad) => void
}) {
  const [hora, setHora] = useState(HORARIOS[0])
  const [modalidad, setModalidad] = useState<Modalidad>("dine-in")
  const info = stockInfo(plato.stock)

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow hover:shadow-xl hover:shadow-black/5">
      <div className="relative h-44 overflow-hidden">
        <img
          src={plato.imagen || "/placeholder.svg"}
          alt={plato.nombre}
          className="size-full object-cover transition-transform duration-300 hover:scale-105"
          crossOrigin="anonymous"
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur">
          {plato.etiqueta}
        </span>
        <StockBadge tone={info.tone} label={info.label} stock={plato.stock} />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Store className="size-3.5" />
          {plato.restaurante}
        </div>
        <h3 className="mt-1 text-lg font-bold text-card-foreground">
          {plato.nombre}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {plato.descripcion}
        </p>

        <div className="mt-4 space-y-3">
          <label className="block">
            <span className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Clock className="size-3.5" /> Horario de recojo
            </span>
            <select
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              disabled={info.disabled}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-shadow focus:ring-2 focus:ring-ring disabled:opacity-50"
            >
              {HORARIOS.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </label>

          <div>
            <span className="mb-1 block text-xs font-medium text-muted-foreground">
              Modalidad
            </span>
            <div className="grid grid-cols-2 gap-2">
              <ModalToggle
                active={modalidad === "dine-in"}
                onClick={() => setModalidad("dine-in")}
                icon={<Utensils className="size-4" />}
                label="En el local"
                disabled={info.disabled}
              />
              <ModalToggle
                active={modalidad === "takeout"}
                onClick={() => setModalidad("takeout")}
                icon={<Package className="size-4" />}
                label="Para llevar"
                disabled={info.disabled}
              />
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="text-xl font-extrabold text-foreground">
            {formatPrecio(plato.precio)}
          </span>
          <Button
            onClick={() => onReservar(hora, modalidad)}
            disabled={info.disabled}
            className="rounded-xl font-semibold transition-transform hover:scale-[1.02]"
          >
            {info.disabled ? "Agotado" : "Reservar y Pagar"}
          </Button>
        </div>
      </div>
    </article>
  )
}

function StockBadge({
  tone,
  label,
  stock,
}: {
  tone: "success" | "warning" | "danger"
  label: string
  stock: number
}) {
  const styles = {
    success: "bg-success text-success-foreground",
    warning: "bg-warning text-warning-foreground",
    danger: "bg-destructive text-white",
  }[tone]
  return (
    <span
      className={`absolute right-3 top-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${styles}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {label}
      {tone !== "danger" && (
        <span className="opacity-80">· {stock} und.</span>
      )}
    </span>
  )
}

function ModalToggle({
  active,
  onClick,
  icon,
  label,
  disabled,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  disabled: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-xs font-semibold transition-all disabled:opacity-50 ${
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

function EstadoBadge({ estado }: { estado: Pedido["estado"] }) {
  const map = {
    recibido: { label: "Recibido", cls: "bg-secondary text-secondary-foreground" },
    preparacion: { label: "En preparación", cls: "bg-warning text-warning-foreground" },
    listo: { label: "Listo", cls: "bg-success text-success-foreground" },
  }[estado]
  return (
    <span
      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${map.cls}`}
    >
      {map.label}
    </span>
  )
}

function CheckoutModal({
  plato,
  hora,
  modalidad,
  onClose,
  onConfirm,
}: {
  plato: Plato
  hora: string
  modalidad: Modalidad
  onClose: () => void
  onConfirm: (metodo: MetodoPago) => void
}) {
  const [metodo, setMetodo] = useState<MetodoPago>("tarjeta")
  const [procesando, setProcesando] = useState(false)
  const { notify } = useToast()

  const mensajes: Record<MetodoPago, string> = {
    tarjeta: "Validando tu tarjeta",
    billetera: "Confirmando pago Yape/Plin",
    express: "Autorizando pago express",
  }

  function pagar() {
    setProcesando(true)
    notify({
      tone: "info",
      title: "Procesando pago...",
      message: `${mensajes[metodo]} para ${plato.nombre}.`,
    })
    setTimeout(() => onConfirm(metodo), 1300)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 backdrop-blur-sm sm:items-center">
      <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl border border-border bg-card shadow-2xl animate-in fade-in slide-in-from-bottom-4">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card p-5">
          <h3 className="flex items-center gap-2 text-lg font-bold text-card-foreground">
            <Lock className="size-5 text-primary" />
            Pago seguro
          </h3>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-3 rounded-2xl bg-secondary p-3">
            <img
              src={plato.imagen || "/placeholder.svg"}
              alt={plato.nombre}
              className="size-14 rounded-xl object-cover"
              crossOrigin="anonymous"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-card-foreground">
                {plato.nombre}
              </p>
              <p className="text-sm text-muted-foreground">
                {plato.restaurante} · {hora}
              </p>
            </div>
            <span className="font-bold text-foreground">
              {formatPrecio(plato.precio)}
            </span>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold text-card-foreground">
              Elige tu método de pago
            </p>
            <div className="grid grid-cols-3 gap-2">
              <MetodoTab
                active={metodo === "tarjeta"}
                onClick={() => setMetodo("tarjeta")}
                icon={<CreditCard className="size-5" />}
                label="Tarjeta"
              />
              <MetodoTab
                active={metodo === "billetera"}
                onClick={() => setMetodo("billetera")}
                icon={<Wallet className="size-5" />}
                label="Yape / Plin"
              />
              <MetodoTab
                active={metodo === "express"}
                onClick={() => setMetodo("express")}
                icon={<Apple className="size-5" />}
                label="Apple / G Pay"
              />
            </div>
          </div>

          <div className="mt-4">
            {metodo === "tarjeta" && <PanelTarjeta />}
            {metodo === "billetera" && <PanelBilletera />}
            {metodo === "express" && <PanelExpress />}
          </div>

          <div className="mt-4 flex items-center justify-between rounded-2xl border border-dashed border-border p-3 text-sm">
            <span className="text-muted-foreground">Modalidad</span>
            <span className="font-semibold text-card-foreground">
              {modalidad === "dine-in" ? "Comer en el local" : "Recojo rápido"}
            </span>
          </div>

          <Button
            onClick={pagar}
            disabled={procesando}
            size="lg"
            className="mt-5 w-full rounded-xl font-semibold transition-transform hover:scale-[1.02]"
          >
            <Lock className="size-5" />
            {procesando
              ? "Procesando..."
              : `Pagar ${formatPrecio(plato.precio)}`}
          </Button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
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
      className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border px-2 py-3 text-center text-xs font-semibold transition-all ${
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

function PanelTarjeta() {
  return (
    <div className="space-y-3 rounded-2xl border border-border bg-background p-4 animate-in fade-in">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-card-foreground">
          Tarjeta de crédito / débito
        </span>
        <span className="flex gap-1">
          <span className="rounded bg-[oklch(0.45_0.12_265)] px-1.5 py-0.5 text-[10px] font-bold text-white">
            VISA
          </span>
          <span className="rounded bg-warning px-1.5 py-0.5 text-[10px] font-bold text-warning-foreground">
            MC
          </span>
        </span>
      </div>
      <FakeField label="Número de tarjeta" value="4082  ····  ····  7311" />
      <div className="grid grid-cols-2 gap-3">
        <FakeField label="Vence" value="08/29" />
        <FakeField label="CVV" value="···" />
      </div>
    </div>
  )
}

function PanelBilletera() {
  return (
    <div className="rounded-2xl border border-border bg-background p-4 text-center animate-in fade-in">
      <p className="flex items-center justify-center gap-1.5 text-sm font-medium text-card-foreground">
        <Smartphone className="size-4 text-primary" />
        Escanea con Yape o Plin
      </p>
      <div className="mx-auto mt-3 w-32">
        <MiniQr seed="YAPE-JAMA-PAGO" />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        O envía al número
      </p>
      <p className="font-mono text-lg font-bold text-foreground">987 654 321</p>
    </div>
  )
}

function PanelExpress() {
  return (
    <div className="space-y-2 rounded-2xl border border-border bg-background p-4 animate-in fade-in">
      <p className="text-center text-sm text-muted-foreground">
        Paga en un toque con tu billetera del dispositivo.
      </p>
      <div className="flex items-center justify-center gap-2 rounded-xl bg-foreground py-3 text-background">
        <Apple className="size-5" />
        <span className="font-semibold">Apple Pay</span>
      </div>
      <div className="flex items-center justify-center gap-2 rounded-xl border border-input py-3 text-foreground">
        <Smartphone className="size-5 text-primary" />
        <span className="font-semibold">Google Pay</span>
      </div>
    </div>
  )
}

function MiniQr({ seed }: { seed: string }) {
  const size = 13
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i)
    h |= 0
  }
  const cells: boolean[] = []
  let state = Math.abs(h) || 1
  for (let i = 0; i < size * size; i++) {
    state = (state * 1103515245 + 12345) & 0x7fffffff
    cells.push((state >> 8) % 2 === 0)
  }
  return (
    <div
      className="grid overflow-hidden rounded-md bg-white p-1.5"
      style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      role="img"
      aria-label="Código QR de pago simulado"
    >
      {cells.map((on, i) => (
        <span
          key={i}
          className={on ? "bg-foreground" : "bg-white"}
          style={{ aspectRatio: "1 / 1" }}
        />
      ))}
    </div>
  )
}

function FakeField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-input bg-card px-4 py-2.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-mono text-sm text-foreground">{value}</p>
    </div>
  )
}
