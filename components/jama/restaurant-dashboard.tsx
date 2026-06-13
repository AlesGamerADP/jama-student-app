"use client"

import { useMemo, useState } from "react"
<<<<<<< HEAD
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
=======
import { CircleCheck as CheckCircle2, ChefHat, ClipboardList, Clock, Image as ImageIcon, Package, Pencil, Plus, ScanLine, Store, TrendingUp, Utensils, Wallet, X } from "lucide-react"
>>>>>>> main
import { Button } from "@/components/ui/button"
import { JamaLogo } from "@/components/jama/logo"
import { useToast } from "@/components/jama/toast"
import {
  formatPrecio,
  type EstadoPedido,
  type Pedido,
  type RestaurantMenu,
  type Segundo,
} from "@/lib/jama-data"

interface Props {
  restaurante: string
  menu: RestaurantMenu
  pedidos: Pedido[]
  ingresos: number
  onAvanzar: (id: string, estado: EstadoPedido) => void
  onValidar: (codigo: string) => boolean
<<<<<<< HEAD
  onEditarEntradas: (entradas: string[]) => void
  onEditarSegundos: (segundos: Segundo[]) => void
=======
  onEditarPlato: (
    id: number,
    cambios: { nombre: string; precio: number; stock: number },
  ) => void
  onAgregarPlato: (plato: Omit<Plato, "id">) => void
>>>>>>> main
  onLogout: () => void
}

export function RestaurantDashboard({
  restaurante,
  menu,
  pedidos,
  ingresos,
  onAvanzar,
  onValidar,
<<<<<<< HEAD
  onEditarEntradas,
  onEditarSegundos,
=======
  onEditarPlato,
  onAgregarPlato,
>>>>>>> main
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
              {restaurante}
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
<<<<<<< HEAD
          <MenuManager
            menu={menu}
            onEditarEntradas={onEditarEntradas}
            onEditarSegundos={onEditarSegundos}
          />
=======
          <MenuManager platos={platos} onEditarPlato={onEditarPlato} onAgregarPlato={onAgregarPlato} />
>>>>>>> main
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
<<<<<<< HEAD
          <p className="mt-1 font-bold text-foreground">
            {pedido.entrada ? `${pedido.entrada} + ${pedido.segundo}` : pedido.plato}
=======
          <h3 className="mt-0.5 text-lg font-bold text-card-foreground">
            {pedido.plato}
          </h3>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-xs font-semibold text-foreground">
          <Package className="size-3.5" />
          Para llevar
        </span>
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

/* ── Gestión de menús del día ───────────────────────────── */

function MenuManager({
  platos,
  onEditarPlato,
  onAgregarPlato,
}: {
  platos: Plato[]
  onEditarPlato: (
    id: number,
    cambios: { nombre: string; precio: number; stock: number },
  ) => void
  onAgregarPlato: (plato: Omit<Plato, "id">) => void
}) {
  const [editando, setEditando] = useState<number | null>(null)
  const [agregando, setAgregando] = useState(false)

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <Utensils className="size-5 text-primary" />
            Menús del Día cargados
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Edita el nombre, precio y stock. Los cambios se reflejan al instante en la
            vista del estudiante.
          </p>
        </div>
        <Button
          onClick={() => setAgregando(true)}
          className="rounded-xl font-semibold transition-transform hover:scale-[1.02]"
        >
          <Plus className="size-4" />
          Agregar Plato
        </Button>
      </div>

      {agregando && (
        <AddPlatoForm
          onCancel={() => setAgregando(false)}
          onSave={(nuevo) => {
            onAgregarPlato(nuevo)
            setAgregando(false)
          }}
        />
      )}

      <div className="mt-4 overflow-hidden rounded-3xl border border-border bg-card">
        {/* Encabezado tabla (desktop) */}
        <div className="hidden grid-cols-[1fr_120px_120px_110px] gap-4 border-b border-border bg-secondary/60 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:grid">
          <span>Plato</span>
          <span>Precio</span>
          <span>Stock</span>
          <span className="text-right">Acción</span>
        </div>

        <ul>
          {platos.map((plato) => {
            const info = stockInfo(plato.stock)
            return (
              <li
                key={plato.id}
                className="border-b border-border last:border-0"
              >
                {editando === plato.id ? (
                  <EditForm
                    plato={plato}
                    onCancel={() => setEditando(null)}
                    onSave={(cambios) => {
                      onEditarPlato(plato.id, cambios)
                      setEditando(null)
                    }}
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-2 px-5 py-4 sm:grid-cols-[1fr_120px_120px_110px] sm:items-center sm:gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={plato.imagen || "/placeholder.svg"}
                        alt={plato.nombre}
                        className="size-11 rounded-xl object-cover"
                        crossOrigin="anonymous"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-card-foreground">
                          {plato.nombre}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {plato.restaurante}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-foreground">
                      {formatPrecio(plato.precio)}
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        info.tone === "danger"
                          ? "text-destructive"
                          : info.tone === "warning"
                            ? "text-warning"
                            : "text-success"
                      }`}
                    >
                      {plato.stock} und.
                    </span>
                    <div className="sm:text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditando(plato.id)}
                        className="rounded-xl font-semibold transition-transform hover:scale-[1.02]"
                      >
                        <Pencil className="size-3.5" />
                        Editar
                      </Button>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function EditForm({
  plato,
  onCancel,
  onSave,
}: {
  plato: Plato
  onCancel: () => void
  onSave: (cambios: { nombre: string; precio: number; stock: number }) => void
}) {
  const [nombre, setNombre] = useState(plato.nombre)
  const [precio, setPrecio] = useState(String(plato.precio))
  const [stock, setStock] = useState(String(plato.stock))

  function guardar(e: React.FormEvent) {
    e.preventDefault()
    const precioNum = Number.parseFloat(precio)
    const stockNum = Number.parseInt(stock, 10)
    if (!nombre.trim() || Number.isNaN(precioNum) || Number.isNaN(stockNum))
      return
    onSave({
      nombre: nombre.trim(),
      precio: Math.max(0, precioNum),
      stock: Math.max(0, stockNum),
    })
  }

  return (
    <form
      onSubmit={guardar}
      className="grid gap-3 bg-primary/5 px-5 py-4 sm:grid-cols-[1fr_120px_120px_auto] sm:items-end"
    >
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-muted-foreground">
          Nombre del plato
        </span>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-muted-foreground">
          Precio (S/)
        </span>
        <input
          type="number"
          step="0.5"
          min="0"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-muted-foreground">
          Stock
        </span>
        <input
          type="number"
          min="0"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
        />
      </label>
      <div className="flex gap-2">
        <Button
          type="submit"
          size="sm"
          className="flex-1 rounded-xl font-semibold transition-transform hover:scale-[1.02]"
        >
          Guardar
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onCancel}
          className="rounded-xl font-semibold"
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}

function AddPlatoForm({
  onCancel,
  onSave,
}: {
  onCancel: () => void
  onSave: (plato: Omit<Plato, "id">) => void
}) {
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [precio, setPrecio] = useState("")
  const [stock, setStock] = useState("")
  const [restaurante, setRestaurante] = useState("")
  const [etiqueta, setEtiqueta] = useState("")
  const [imagen, setImagen] = useState("")
  const [imagenPreview, setImagenPreview] = useState<string | null>(null)

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string
      setImagen(base64)
      setImagenPreview(base64)
    }
    reader.readAsDataURL(file)
  }

  function guardar(e: React.FormEvent) {
    e.preventDefault()
    const precioNum = Number.parseFloat(precio)
    const stockNum = Number.parseInt(stock, 10)
    if (
      !nombre.trim() ||
      !restaurante.trim() ||
      Number.isNaN(precioNum) ||
      Number.isNaN(stockNum)
    )
      return
    onSave({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio: Math.max(0, precioNum),
      stock: Math.max(0, stockNum),
      restaurante: restaurante.trim(),
      etiqueta: etiqueta.trim() || "Nuevo",
      imagen: imagen || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop",
    })
  }

  return (
    <div className="mt-4 overflow-hidden rounded-3xl border border-primary/40 bg-primary/5 animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center justify-between border-b border-border bg-card px-5 py-4">
        <h3 className="flex items-center gap-2 text-lg font-bold text-card-foreground">
          <Plus className="size-5 text-primary" />
          Agregar nuevo plato
        </h3>
        <button
          onClick={onCancel}
          aria-label="Cerrar"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-5" />
        </button>
      </div>
      <form onSubmit={guardar} className="grid gap-4 p-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-card-foreground">
            Nombre del plato *
          </span>
          <input
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Ceviche Clásico"
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-card-foreground">
            Restaurante *
          </span>
          <input
            required
            value={restaurante}
            onChange={(e) => setRestaurante(e.target.value)}
            placeholder="Ej: Café Univalle"
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-card-foreground">
            Descripción
          </span>
          <input
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción breve del plato"
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-card-foreground">
            Precio (S/) *
          </span>
          <input
            required
            type="number"
            step="0.5"
            min="0"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            placeholder="12.00"
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-card-foreground">
            Stock inicial *
          </span>
          <input
            required
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="10"
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-card-foreground">
            Etiqueta
          </span>
          <input
            value={etiqueta}
            onChange={(e) => setEtiqueta(e.target.value)}
            placeholder="Ej: Más pedido, Saludable, Clásico"
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-card-foreground">
            Imagen del plato
          </span>
          <div className="flex items-center gap-3">
            {imagenPreview ? (
              <div className="relative">
                <img
                  src={imagenPreview}
                  alt="Vista previa"
                  className="size-16 rounded-xl object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagen("")
                    setImagenPreview(null)
                  }}
                  className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-white"
                >
                  <X className="size-3" />
                </button>
              </div>
            ) : (
              <span className="flex size-16 items-center justify-center rounded-xl border-2 border-dashed border-input bg-secondary">
                <ImageIcon className="size-6 text-muted-foreground" />
              </span>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="imagen-plato"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("imagen-plato")?.click()}
              className="rounded-xl"
            >
              <ImageIcon className="size-4" />
              {imagenPreview ? "Cambiar imagen" : "Subir imagen"}
            </Button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Selecciona una imagen de tu dispositivo (JPG, PNG, WebP)
          </p>
        </label>
        <div className="flex gap-3 md:col-span-2">
          <Button
            type="submit"
            className="flex-1 rounded-xl font-semibold transition-transform hover:scale-[1.02]"
          >
            <Plus className="size-4" />
            Agregar Plato
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="rounded-xl font-semibold"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}

/* ── Validador de recojo con escáner QR simulado ────────── */

function Validador({ onValidar }: { onValidar: (codigo: string) => boolean }) {
  const [codigo, setCodigo] = useState("")
  const [feedback, setFeedback] = useState<"idle" | "ok" | "error">("idle")
  const [scanner, setScanner] = useState(false)
  const { notify } = useToast()

  function procesar(valor: string) {
    const limpio = valor.trim().replace(/^#/, "").toUpperCase()
    if (!limpio) return false
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
    return ok
  }

  function validar(e: React.FormEvent) {
    e.preventDefault()
    procesar(codigo)
  }

  return (
    <aside className="h-fit rounded-3xl border border-border bg-card p-6 lg:sticky lg:top-32">
      <h2 className="flex items-center gap-2 text-lg font-bold text-card-foreground">
        <ScanLine className="size-5 text-primary" />
        Validar recojo
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Escanea el QR del estudiante o ingresa el código de entrega.
      </p>

      <Button
        onClick={() => setScanner(true)}
        size="lg"
        className="mt-4 w-full rounded-xl font-semibold transition-transform hover:scale-[1.02]"
      >
        <ScanLine className="size-5" />
        Abrir Escáner QR
      </Button>

      <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />o ingresa el código
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={validar} className="space-y-3">
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
          variant="outline"
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

      {scanner && (
        <ScannerModal
          onClose={() => setScanner(false)}
          onScan={() => procesar(codigo)}
          hasCodigo={codigo.trim().length > 0}
        />
      )}
    </aside>
  )
}

function ScannerModal({
  onClose,
  onScan,
  hasCodigo,
}: {
  onClose: () => void
  onScan: () => boolean
  hasCodigo: boolean
}) {
  const [leyendo, setLeyendo] = useState(false)
  const { notify } = useToast()

  function simularLectura() {
    setLeyendo(true)
    setTimeout(() => {
      setLeyendo(false)
      if (!hasCodigo) {
        notify({
          tone: "info",
          title: "Sin código de referencia",
          message:
            "Ingresa el código de entrega del estudiante para simular la lectura.",
        })
        return
      }
      const ok = onScan()
      if (ok) onClose()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-foreground/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h3 className="flex items-center gap-2 font-bold text-card-foreground">
            <ScanLine className="size-5 text-primary" />
            Escáner de QR
          </h3>
          <button
            onClick={onClose}
            aria-label="Cerrar escáner"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-5">
          {/* Visor de cámara simulado */}
          <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-2xl bg-foreground">
            <div className="absolute inset-0 grid place-items-center text-background/30">
              <ScanLine className="size-20" />
            </div>
            {/* Esquinas del marco */}
            <span className="absolute left-5 top-5 size-8 rounded-tl-lg border-l-2 border-t-2 border-primary" />
            <span className="absolute right-5 top-5 size-8 rounded-tr-lg border-r-2 border-t-2 border-primary" />
            <span className="absolute bottom-5 left-5 size-8 rounded-bl-lg border-b-2 border-l-2 border-primary" />
            <span className="absolute bottom-5 right-5 size-8 rounded-br-lg border-b-2 border-r-2 border-primary" />
            {/* Línea láser roja animada */}
            <span className="jama-laser absolute inset-x-6 h-0.5 bg-destructive shadow-[0_0_12px_2px_var(--destructive)]" />
          </div>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {leyendo
              ? "Leyendo código QR..."
              : "Apunta la cámara al ticket virtual del estudiante."}
>>>>>>> main
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
  menu: RestaurantMenu
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
    const nuevas = entradas.filter((_: string, i: number) => i !== index)
    setEntradas(nuevas)
    onEditarEntradas(nuevas)
  }

  function actualizarSegundo(id: number, nombre: string, stock: number) {
    const nuevos = segundos.map((s: Segundo) =>
      s.id === id ? { ...s, nombre, stock } : s,
    )
    setSegundos(nuevos)
    onEditarSegundos(nuevos)
    setEditandoSegundo(null)
  }

  function eliminarSegundo(id: number) {
    const nuevos = segundos.filter((s: Segundo) => s.id !== id)
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
          {entradas.map((entrada: string, index: number) => (
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
          {segundos.map((segundo: Segundo) => (
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
