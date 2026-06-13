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
  type MenuDelDia,
  type MetodoPago,
  type Pedido,
  type Segundo,
} from "@/lib/jama-data"

interface Props {
  menu: MenuDelDia
  pedidos: Pedido[]
  onReservar: (
    entrada: string,
    segundo: Segundo,
    hora: string,
    metodoPago: MetodoPago,
  ) => Pedido
  onLogout: () => void
}

export function StudentDashboard({
  menu,
  pedidos,
  onReservar,
  onLogout,
}: Props) {
  const [checkout, setCheckout] = useState<{
    hora: string
    entrada: string | null
    segundo: Segundo | null
  } | null>(null)
  const [ticket, setTicket] = useState<Pedido | null>(null)

  const misPedidos = useMemo(
    () => [...pedidos].sort((a, b) => b.creado - a.creado),
    [pedidos],
  )

  // Filtrar segundos disponibles (stock > 0)
  const segundosDisponibles = menu.segundos.filter((s) => s.stock > 0)

  function confirmar(metodo: MetodoPago) {
    if (!checkout || !checkout.entrada || !checkout.segundo) return
    const pedido = onReservar(
      checkout.entrada,
      checkout.segundo,
      checkout.hora,
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
              Elige entrada + segundo, paga por adelantado y recoge sin filas.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground">
            <ShoppingBag className="size-4 text-primary" />
            {misPedidos.length} pedido{misPedidos.length === 1 ? "" : "s"} activo
            {misPedidos.length === 1 ? "" : "s"}
          </span>
        </div>

        {/* Card para seleccionar Entrada + Segundo + Horario */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-card shadow-lg">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 px-6 py-4">
            <h2 className="font-bold text-foreground">
              Arma tu Menú Completo
            </h2>
            <p className="text-sm text-muted-foreground">
              Selecciona tu entrada y segundo favorito
            </p>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-3">
            {/* Selector de Entrada */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-semibold text-foreground">
                Elige tu Entrada
              </label>
              <select
                value={checkout?.entrada ?? ""}
                onChange={(e) =>
                  setCheckout((prev) =>
                    prev
                      ? { ...prev, entrada: e.target.value || null }
                      : {
                          hora: HORARIOS[0],
                          entrada: e.target.value || null,
                          segundo: null,
                        },
                  )
                }
                className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-shadow focus:ring-2 focus:ring-ring"
              >
                <option value="">Selecciona una entrada...</option>
                {menu.entradas.map((entrada) => (
                  <option key={entrada} value={entrada}>
                    {entrada}
                  </option>
                ))}
              </select>
            </div>

            {/* Selector de Segundo */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-semibold text-foreground">
                Elige tu Segundo
              </label>
              <select
                value={checkout?.segundo?.id ?? ""}
                onChange={(e) => {
                  const seg = segundosDisponibles.find(
                    (s) => s.id === Number(e.target.value),
                  )
                  setCheckout((prev) =>
                    prev
                      ? { ...prev, segundo: seg || null }
                      : {
                          hora: HORARIOS[0],
                          entrada: null,
                          segundo: seg || null,
                        },
                  )
                }}
                className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-shadow focus:ring-2 focus:ring-ring"
              >
                <option value="">Selecciona un segundo...</option>
                {segundosDisponibles.map((segundo) => (
                  <option key={segundo.id} value={segundo.id}>
                    {segundo.nombre} ({segundo.stock} disp.)
                  </option>
                ))}
              </select>
            </div>

            {/* Selector de Horario */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-semibold text-foreground">
                Horario de recojo
              </label>
              <select
                value={checkout?.hora ?? HORARIOS[0]}
                onChange={(e) =>
                  setCheckout((prev) =>
                    prev ? { ...prev, hora: e.target.value } : prev,
                  )
                }
                className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-shadow focus:ring-2 focus:ring-ring"
              >
                {HORARIOS.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Resumen y botón */}
          <div className="border-t border-border px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                {checkout?.entrada && checkout?.segundo ? (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {checkout.entrada}
                    </span>{" "}
                    +{" "}
                    <span className="font-semibold text-foreground">
                      {checkout.segundo.nombre}
                    </span>
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Completa los campos para continuar
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl font-extrabold text-foreground">
                  {formatPrecio(menu.precioTotal)}
                </p>
                <p className="text-xs text-muted-foreground">Menú completo</p>
              </div>
            </div>

            <Button
              onClick={() =>
                checkout?.entrada &&
                checkout?.segundo &&
                setCheckout(checkout)
              }
              disabled={!checkout?.entrada || !checkout?.segundo}
              size="lg"
              className="mt-4 w-full rounded-xl font-semibold transition-transform hover:scale-[1.02]"
            >
              Continuar al Pago
            </Button>
          </div>
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
                      {p.entrada} + {p.segundo}
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

      {checkout?.entrada && checkout?.segundo && (
        <CheckoutModal
          entrada={checkout.entrada}
          segundo={checkout.segundo}
          hora={checkout.hora}
          precioTotal={menu.precioTotal}
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
      </div>
    </header>
  )
}

function EstadoBadge({ estado }: { estado: Pedido["estado"] }) {
  const config: Record<
    Pedido["estado"],
    { bg: string; text: string; label: string }
  > = {
    recibido: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      label: "En cocina",
    },
    preparacion: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      label: "Preparando",
    },
    listo: {
      bg: "bg-green-100",
      text: "text-green-700",
      label: "¡Listo!",
    },
  }

  const { bg, text, label } = config[estado]

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${bg} ${text}`}>
      {label}
    </span>
  )
}

function CheckoutModal({
  entrada,
  segundo,
  hora,
  precioTotal,
  onClose,
  onConfirm,
}: {
  entrada: string
  segundo: { id: number; nombre: string; stock: number }
  hora: string
  precioTotal: number
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
      message: `${mensajes[metodo]} para ${entrada} + ${segundo.nombre}.`,
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
          <div className="flex flex-col gap-3 rounded-2xl bg-secondary p-4">
            <div>
              <p className="text-xs text-muted-foreground">Entrada</p>
              <p className="font-semibold text-card-foreground">{entrada}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Segundo</p>
              <p className="font-semibold text-card-foreground">
                {segundo.nombre}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Horario de recojo</p>
              <p className="font-semibold text-card-foreground">{hora}</p>
            </div>
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

          <Button
            onClick={pagar}
            disabled={procesando}
            size="lg"
            className="mt-5 w-full rounded-xl font-semibold transition-transform hover:scale-[1.02]"
          >
            <Lock className="size-5" />
            {procesando ? "Procesando..." : `Pagar ${formatPrecio(precioTotal)}`}
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
