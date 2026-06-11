"use client"

import { CheckCircle2, Clock, Package, Store, Utensils, X } from "lucide-react"
import { formatPrecio, type Pedido } from "@/lib/jama-data"

// Deterministic pseudo-QR grid generated from the delivery code.
function QrGrid({ seed }: { seed: string }) {
  const size = 21
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

  const isFinder = (r: number, c: number) => {
    const inBox = (br: number, bc: number) =>
      r >= br && r < br + 7 && c >= bc && c < bc + 7
    return inBox(0, 0) || inBox(0, size - 7) || inBox(size - 7, 0)
  }

  return (
    <div
      className="grid overflow-hidden rounded-lg bg-white p-2"
      style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      role="img"
      aria-label={`Código QR del pedido ${seed}`}
    >
      {cells.map((on, i) => {
        const r = Math.floor(i / size)
        const c = i % size
        const finder = isFinder(r, c)
        const fill = finder ? true : on
        return (
          <span
            key={i}
            className={fill ? "bg-foreground" : "bg-white"}
            style={{ aspectRatio: "1 / 1" }}
          />
        )
      })}
    </div>
  )
}

export function Ticket({
  pedido,
  onClose,
}: {
  pedido: Pedido
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card shadow-2xl animate-in fade-in zoom-in-95">
        <div className="relative bg-success p-5 text-success-foreground">
          <button
            onClick={onClose}
            aria-label="Cerrar ticket"
            className="absolute right-4 top-4 text-success-foreground/80 transition-colors hover:text-success-foreground"
          >
            <X className="size-5" />
          </button>
          <CheckCircle2 className="size-8" />
          <h3 className="mt-2 text-lg font-bold">¡Pago confirmado!</h3>
          <p className="text-sm opacity-90">Tu ticket virtual está listo.</p>
        </div>

        <div className="p-6">
          <div className="mx-auto w-44">
            <QrGrid seed={pedido.codigo} />
          </div>

          <div className="mt-5 text-center">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Código de entrega
            </p>
            <p className="text-3xl font-extrabold tracking-tight text-foreground">
              #{pedido.codigo}
            </p>
          </div>

          <div className="mt-5 space-y-2.5 rounded-2xl bg-secondary p-4 text-sm">
            <Row
              icon={<Utensils className="size-4" />}
              label="Plato"
              value={pedido.plato}
            />
            <Row
              icon={<Store className="size-4" />}
              label="Restaurante"
              value={pedido.restaurante}
            />
            <Row
              icon={<Clock className="size-4" />}
              label="Hora de recojo"
              value={pedido.hora}
            />
            <Row
              icon={<Package className="size-4" />}
              label="Modalidad"
              value={
                pedido.modalidad === "dine-in"
                  ? "Comer en el local"
                  : "Recojo rápido"
              }
            />
            <div className="flex items-center justify-between border-t border-border pt-2.5">
              <span className="font-medium text-muted-foreground">Total pagado</span>
              <span className="text-base font-extrabold text-foreground">
                {formatPrecio(pedido.precio)}
              </span>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Muestra este código al recoger tu pedido.
          </p>
        </div>
      </div>
    </div>
  )
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="truncate text-right font-semibold text-card-foreground">
        {value}
      </span>
    </div>
  )
}
