"use client"

import { useState } from "react"
import {
  AlertCircle,
  ArrowRight,
  Clock,
  CreditCard,
  Info,
  LayoutDashboard,
  QrCode,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Store,
  TrendingUp,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { JamaLogo } from "@/components/jama/logo"
import { useToast } from "@/components/jama/toast"
import { autenticar } from "@/lib/jama-data"
import type { Role } from "@/components/jama/app-shell"

function smoothScroll(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
}

export function Landing({ onLogin }: { onLogin: (role: Role) => void }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Audiences />
      <HowItWorks />
      <Portal onLogin={onLogin} />
      <Footer />
    </div>
  )
}

function Navbar() {
  return (
    <header className="sticky top-12 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <JamaLogo />
        <div className="hidden items-center gap-8 md:flex">
          <button
            onClick={() => smoothScroll("estudiantes")}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Para Estudiantes
          </button>
          <button
            onClick={() => smoothScroll("restaurantes")}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Para Restaurantes
          </button>
          <button
            onClick={() => smoothScroll("como-funciona")}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Cómo Funciona
          </button>
        </div>
        <Button
          onClick={() => smoothScroll("portal")}
          className="rounded-full font-semibold transition-transform hover:scale-[1.02]"
        >
          Iniciar Sesión
        </Button>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:py-24 lg:px-8">
        <div className="flex flex-col items-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground">
            <Sparkles className="size-4 text-primary" />
            Adiós a las filas del campus
          </span>
          <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Pide, paga y recoge tu almuerzo{" "}
            <span className="text-primary">sin perder tiempo</span>
          </h1>
          <p className="mt-6 max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
            JAMA conecta a estudiantes y restaurantes del campus. Reserva el
            Menú del Día y paga por adelantado para que tu comida esté lista
            cuando llegues — sin colas, sin esperas, sin desorden en hora pico.
          </p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              onClick={() => smoothScroll("portal")}
              className="rounded-full font-semibold transition-transform hover:scale-[1.02]"
            >
              <Users className="size-5" />
              Entrar como Alumno
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => smoothScroll("portal")}
              className="rounded-full border-2 font-semibold transition-transform hover:scale-[1.02]"
            >
              <Store className="size-5" />
              Entrar como Comercio
            </Button>
          </div>
          <div className="mt-10 flex items-center gap-6">
            <Stat value="12 min" label="ahorro promedio" />
            <span className="h-10 w-px bg-border" />
            <Stat value="+30" label="restaurantes" />
            <span className="h-10 w-px bg-border" />
            <Stat value="100%" label="pago seguro" />
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-black/10">
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop"
              alt="Estudiantes disfrutando su almuerzo en el campus"
              className="h-72 w-full object-cover sm:h-96"
              crossOrigin="anonymous"
            />
          </div>
          <div className="absolute -bottom-5 -left-4 flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-xl">
            <span className="flex size-10 items-center justify-center rounded-full bg-success/15 text-success">
              <QrCode className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-card-foreground">
                Ticket #JM-4082
              </p>
              <p className="text-xs text-muted-foreground">Listo para recoger</p>
            </div>
          </div>
          <div className="absolute -right-3 top-6 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-xl">
            <span className="flex size-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <CreditCard className="size-4" />
            </span>
            <p className="text-sm font-semibold text-card-foreground">
              Pago confirmado
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-extrabold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

function Audiences() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <article
          id="estudiantes"
          className="scroll-mt-20 rounded-3xl border border-border bg-card p-8 transition-shadow hover:shadow-xl hover:shadow-black/5"
        >
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Users className="size-6" />
          </span>
          <h2 className="mt-5 text-2xl font-bold text-card-foreground">
            Para Estudiantes
          </h2>
          <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
            Deja de perder tu tiempo libre y tu comodidad haciendo filas
            físicas. Reserva desde tu celular y recoge cuando te convenga.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Menú del Día con pre-pago seguro",
              "Elige tu horario exacto de recojo",
              "Ticket virtual con QR y código único",
              "Notificaciones cuando tu pedido esté listo",
            ].map((item) => (
              <Feature key={item} text={item} />
            ))}
          </ul>
        </article>

        <article
          id="restaurantes"
          className="scroll-mt-20 rounded-3xl border border-border bg-card p-8 transition-shadow hover:shadow-xl hover:shadow-black/5"
        >
          <span className="flex size-12 items-center justify-center rounded-2xl bg-accent/40 text-accent-foreground">
            <Store className="size-6" />
          </span>
          <h2 className="mt-5 text-2xl font-bold text-card-foreground">
            Para Restaurantes
          </h2>
          <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
            Elimina las demoras y el desorden en horas pico. Organiza tu cocina
            con una cola de despacho clara y recibe los pagos por adelantado.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Recepción automática de tickets",
              "Cola de despacho en tiempo real",
              "Validación de entrega por código",
              "Menos errores y filas más cortas",
            ].map((item) => (
              <Feature key={item} text={item} />
            ))}
          </ul>
        </article>
      </div>
    </section>
  )
}

function Feature({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
        <ShieldCheck className="size-3.5" />
      </span>
      <span className="text-sm text-card-foreground">{text}</span>
    </li>
  )
}

function HowItWorks() {
  const steps = [
    {
      icon: LayoutDashboard,
      title: "Explora el Menú del Día",
      text: "Revisa los platos disponibles del campus con stock en tiempo real.",
    },
    {
      icon: CreditCard,
      title: "Reserva y paga",
      text: "Elige tu horario de recojo y paga de forma segura por adelantado.",
    },
    {
      icon: QrCode,
      title: "Recibe tu ticket",
      text: "Genera un código QR único que el restaurante validará.",
    },
    {
      icon: ScanLine,
      title: "Recoge sin filas",
      text: "El comercio prepara tu pedido y lo valida al entregártelo.",
    },
  ]
  return (
    <section
      id="como-funciona"
      className="scroll-mt-20 bg-secondary/60 py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
            Cómo funciona JAMA
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            Un flujo simple que integra a estudiantes y restaurantes en un solo
            sistema.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="relative rounded-2xl border border-border bg-card p-6 transition-transform hover:scale-[1.02]"
            >
              <span className="absolute right-5 top-5 text-3xl font-extrabold text-border">
                {i + 1}
              </span>
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <s.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold text-card-foreground">
                {s.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Portal({ onLogin }: { onLogin: (role: Role) => void }) {
  const [tab, setTab] = useState<Role>("alumno")
  const [correo, setCorreo] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const { notify } = useToast()

  const demo =
    tab === "alumno"
      ? { correo: "alumno@univalle.edu", pass: "jama123" }
      : { correo: "comercio@jama.com", pass: "jama123" }

  function cambiarTab(nuevo: Role) {
    setTab(nuevo)
    setError(null)
    setCorreo("")
    setPassword("")
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = autenticar(correo, password, tab)
    if (!res.ok) {
      setError(res.error)
      return
    }
    setError(null)
    notify({
      tone: "success",
      title: `¡Bienvenido, ${res.cuenta.nombre}!`,
      message: "Inicio de sesión correcto.",
    })
    onLogin(tab)
  }

  function autollenar() {
    setCorreo(demo.correo)
    setPassword(demo.pass)
    setError(null)
  }

  return (
    <section id="portal" className="scroll-mt-20 py-16 lg:py-24">
      <div className="mx-auto max-w-md px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground">Portal de Acceso</h2>
          <p className="mt-2 text-muted-foreground">
            Ingresa según tu perfil para continuar.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-card shadow-xl shadow-black/5">
          <div className="grid grid-cols-2 gap-1 bg-secondary p-1.5">
            <TabButton active={tab === "alumno"} onClick={() => cambiarTab("alumno")}>
              <Users className="size-4" /> Portal Alumnos
            </TabButton>
            <TabButton
              active={tab === "restaurante"}
              onClick={() => cambiarTab("restaurante")}
            >
              <Store className="size-4" /> Portal Restaurantes
            </TabButton>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            <Field
              label={
                tab === "alumno" ? "Correo institucional" : "Correo de empresa"
              }
              placeholder={
                tab === "alumno"
                  ? "tucodigo@univalle.edu"
                  : "contacto@turestaurante.com"
              }
              type="email"
              value={correo}
              onChange={setCorreo}
            />
            <Field
              label="Contraseña"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={setPassword}
            />

            {error && (
              <p
                role="alert"
                className="flex items-center gap-2 rounded-xl bg-destructive/10 px-3 py-2.5 text-sm font-medium text-destructive"
              >
                <AlertCircle className="size-4 shrink-0" />
                {error}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-xl font-semibold transition-transform hover:scale-[1.02]"
            >
              {tab === "alumno"
                ? "Iniciar Sesión como Estudiante"
                : "Acceder al Panel de Control"}
              <ArrowRight className="size-4" />
            </Button>

            <button
              type="button"
              onClick={autollenar}
              className="flex w-full items-start gap-2 rounded-xl border border-dashed border-border bg-secondary/50 px-3 py-2.5 text-left text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              <Info className="size-4 shrink-0 text-primary" />
              <span>
                Cuenta de prueba: <strong>{demo.correo}</strong> · contraseña{" "}
                <strong>{demo.pass}</strong>. Toca para autocompletar.
              </span>
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

function TabButton({
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
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all ${
        active
          ? "bg-card text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  )
}

function Field({
  label,
  placeholder,
  type,
  value,
  onChange,
}: {
  label: string
  placeholder: string
  type: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-card-foreground">
        {label}
      </span>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
      />
    </label>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/60">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <JamaLogo />
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="size-4 text-primary" />
          Menos filas, más tiempo para ti.
        </p>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} JAMA
        </p>
      </div>
    </footer>
  )
}
