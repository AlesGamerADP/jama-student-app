export type Modalidad = "dine-in" | "takeout"
export type EstadoPedido = "recibido" | "preparacion" | "listo"
export type MetodoPago = "tarjeta" | "billetera"

export interface Plato {
  id: number
  restaurante: string
  nombre: string
  descripcion: string
  precio: number
  stock: number
  imagen: string
  etiqueta: string
}

export interface Pedido {
  id: string
  codigo: string
  platoId: number
  plato: string
  entrada: string
  restaurante: string
  precio: number
  hora: string
  modalidad: Modalidad
  metodoPago: MetodoPago
  estado: EstadoPedido
  creado: number
}

export const METODOS_PAGO: { id: MetodoPago; label: string }[] = [
  { id: "tarjeta", label: "Tarjeta" },
  { id: "billetera", label: "Yape / Plin" },
]

export const metodoLabel = (m: MetodoPago) =>
  METODOS_PAGO.find((x) => x.id === m)?.label ?? "Tarjeta"

export type Role = "alumno" | "restaurante"

interface Cuenta {
  correo: string
  password: string
  rol: Role
  nombre: string
}

export const CUENTAS: Cuenta[] = [
  {
    correo: "alumno@univalle.edu",
    password: "jama123",
    rol: "alumno",
    nombre: "Estudiante Demo",
  },
  {
    correo: "comercio@jama.com",
    password: "jama123",
    rol: "restaurante",
    nombre: "Café Univalle",
  },
]

export function autenticar(
  correo: string,
  password: string,
  rol: Role,
): { ok: true; cuenta: Cuenta } | { ok: false; error: string } {
  const cuenta = CUENTAS.find(
    (c) => c.correo.toLowerCase() === correo.trim().toLowerCase(),
  )
  if (!cuenta) return { ok: false, error: "No existe una cuenta con ese correo." }
  if (cuenta.password !== password)
    return { ok: false, error: "Contraseña incorrecta." }
  if (cuenta.rol !== rol)
    return {
      ok: false,
      error: `Esta cuenta es de ${cuenta.rol === "alumno" ? "estudiante" : "restaurante"}. Cambia de portal.`,
    }
  return { ok: true, cuenta }
}

export const HORARIOS = [
  "12:00 - 12:30",
  "12:30 - 13:00",
  "13:00 - 13:30",
  "13:30 - 14:00",
  "14:00 - 14:30",
]

export interface RestaurantMenu {
  restaurante: string
  entradas: string[]
  segundos: Plato[]
}

export const RESTAURANT_ENTRADAS: Record<string, string[]> = {
  "Café Univalle": [
    "Papa a la Huancaína",
    "Sopa Criolla",
    "Ensalada Rusa",
  ],
  "Sazón Campus": [
    "Ceviche de Mariscos",
    "Papa Rellena",
  ],
  "Verde Bowl": [
    "Ensalada Verde",
    "Tabla de Quesos",
  ],
  "Burger Lab": [
    "Papas Rústicas",
    "Aros de Cebolla",
  ],
}

export const getEntradas = (restaurante: string): string[] => {
  return RESTAURANT_ENTRADAS[restaurante] || []
}

export const PLATOS_SEMILLA: Plato[] = [
  {
    id: 1,
    restaurante: "Café Univalle",
    nombre: "Arroz con Pollo",
    descripcion: "Arroz verde de culantro, presa de pollo y ensalada criolla.",
    precio: 12.0,
    stock: 10,
    etiqueta: "Más pedido",
    imagen:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    restaurante: "Sazón Campus",
    nombre: "Lomo Saltado",
    descripcion: "Lomo salteado al wok con papas fritas y arroz blanco.",
    precio: 15.0,
    stock: 10,
    etiqueta: "Clásico peruano",
    imagen:
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    restaurante: "Verde Bowl",
    nombre: "Bowl Mediterráneo",
    descripcion: "Quinua, garbanzos, palta, hummus y vegetales frescos.",
    precio: 14.0,
    stock: 3,
    etiqueta: "Saludable",
    imagen:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    restaurante: "Café Univalle",
    nombre: "Ají de Gallina",
    descripcion: "Crema de gallina con ají amarillo, papa y arroz.",
    precio: 13.0,
    stock: 6,
    etiqueta: "Casero",
    imagen:
      "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 5,
    restaurante: "Burger Lab",
    nombre: "Burger Doble Cheddar",
    descripcion: "Doble carne, cheddar fundido, papas rústicas y bebida.",
    precio: 16.0,
    stock: 0,
    etiqueta: "Premium",
    imagen:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 6,
    restaurante: "Sazón Campus",
    nombre: "Tallarín Saltado",
    descripcion: "Fideos salteados con verduras y pollo en salsa de la casa.",
    precio: 12.5,
    stock: 8,
    etiqueta: "Recargado",
    imagen:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800&auto=format&fit=crop",
  },
]

export function formatPrecio(valor: number) {
  return `S/ ${valor.toFixed(2)}`
}

export function generarCodigo() {
  const n = Math.floor(1000 + Math.random() * 9000)
  return `JM-${n}`
}

export const stockInfo = (stock: number) => {
  if (stock <= 0)
    return { label: "Agotado", tone: "danger" as const, disabled: true }
  if (stock <= 3)
    return { label: "¡Pocas unidades!", tone: "warning" as const, disabled: false }
  return { label: "Disponible", tone: "success" as const, disabled: false }
}

const STORAGE_KEY = "jama_platos"

export function cargarPlatos(): Plato[] {
  if (typeof window === "undefined") return PLATOS_SEMILLA
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as Plato[]
  } catch {
    // ignore parse errors
  }
  return PLATOS_SEMILLA
}

export function guardarPlatos(platos: Plato[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(platos))
  } catch {
    // ignore storage errors
  }
}

export function generarIdPlato(): number {
  return Date.now()
}
