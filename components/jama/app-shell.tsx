"use client"

import { useCallback, useState } from "react"
import { Landing } from "@/components/jama/landing"
import { StudentDashboard } from "@/components/jama/student-dashboard"
import { RestaurantDashboard } from "@/components/jama/restaurant-dashboard"
import { ViewSwitcher } from "@/components/jama/view-switcher"
import { ToastProvider, useToast } from "@/components/jama/toast"
import {
  generarCodigo,
  getMenuForRestaurant,
  PLATOS_SEMILLA,
  RESTAURANTES_SEMILLA,
  type EstadoPedido,
  type MetodoPago,
  type Pedido,
  type Plato,
  type RestaurantMenu,
  type Segundo,
} from "@/lib/jama-data"

export type Role = "alumno" | "restaurante"
export type View = "landing" | "alumno" | "restaurante"

function Shell() {
  const [view, setView] = useState<View>("landing")
  const [platos, setPlatos] = useState<Plato[]>(PLATOS_SEMILLA)
  const [restaurantMenus, setRestaurantMenus] = useState<Record<string, RestaurantMenu>>(
    RESTAURANTES_SEMILLA
  )
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [ingresos, setIngresos] = useState(0)
  const { notify } = useToast()

  const reservar = useCallback(
    (
      plato: Plato,
      entrada: string,
      segundo: Segundo,
      metodoPago: MetodoPago,
    ): Pedido => {
      const menu = getMenuForRestaurant(plato.restaurante)
      if (!menu) {
        notify({
          tone: "info",
          title: "Error",
          message: "No se encontró el menú del restaurante.",
        })
        return null as any
      }

      const pedido: Pedido = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        codigo: generarCodigo(),
        entrada,
        segundo: segundo.nombre,
        restaurante: plato.restaurante,
        precio: menu.precioTotal,
        hora: "Recojo Rápido",
        modalidad: "takeout",
        metodoPago,
        estado: "recibido",
        creado: Date.now(),
      }

      // Deduct stock from the restaurant's menu
      setRestaurantMenus((prev) => ({
        ...prev,
        [plato.restaurante]: {
          ...prev[plato.restaurante],
          segundos: prev[plato.restaurante].segundos.map((s) =>
            s.id === segundo.id ? { ...s, stock: Math.max(0, s.stock - 1) } : s,
          ),
        },
      }))

      // Add to global pedidos
      setPedidos((prev) => [...prev, pedido])

      // Update revenue
      setIngresos((prev) => prev + menu.precioTotal)

      notify({
        tone: "success",
        title: "¡Reserva confirmada!",
        message: `${entrada} + ${segundo.nombre} en ${plato.restaurante}. Código #${pedido.codigo}.`,
      })

      return pedido
    },
    [notify],
  )

  const editarEntradas = useCallback(
    (restaurante: string, nuevasEntradas: string[]) => {
      setRestaurantMenus((prev) => ({
        ...prev,
        [restaurante]: { ...prev[restaurante], entradas: nuevasEntradas },
      }))
      notify({
        tone: "success",
        title: "Entradas actualizadas",
        message: "Los cambios ya son visibles en el catálogo del estudiante.",
      })
    },
    [notify],
  )

  const editarSegundos = useCallback(
    (restaurante: string, nuevosSegundos: Segundo[]) => {
      setRestaurantMenus((prev) => ({
        ...prev,
        [restaurante]: { ...prev[restaurante], segundos: nuevosSegundos },
      }))
      notify({
        tone: "success",
        title: "Segundos actualizados",
        message: "Los cambios ya son visibles en el catálogo del estudiante.",
      })
    },
    [notify],
  )

  const avanzar = useCallback(
    (id: string, estado: EstadoPedido) => {
      setPedidos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, estado } : p)),
      )
      if (estado === "listo") {
        const pedido = pedidos.find((p) => p.id === id)
        notify({
          tone: "info",
          title: "Notificación enviada al alumno",
          message: pedido
            ? `Tu pedido ${pedido.plato} (#${pedido.codigo}) está listo para recoger.`
            : "El pedido está listo para recoger.",
        })
      }
    },
    [notify, pedidos],
  )

  const validar = useCallback((codigo: string): boolean => {
    let encontrado = false
    setPedidos((prev) => {
      const existe = prev.some((p) => p.codigo === codigo)
      encontrado = existe
      return existe ? prev.filter((p) => p.codigo !== codigo) : prev
    })
    return encontrado
  }, [])

  return (
    <>
      <ViewSwitcher view={view} onChange={setView} />
      <div className="pt-12">
        {view === "alumno" && (
          <StudentDashboard
            platos={platos}
            pedidos={pedidos}
            restaurantMenus={restaurantMenus}
            onReservar={reservar}
            onLogout={() => setView("landing")}
          />
        )}
        {view === "restaurante" && (
          <RestaurantDashboard
            restaurante="Café Univalle"
            menu={restaurantMenus["Café Univalle"]}
            pedidos={pedidos.filter((p) => p.restaurante === "Café Univalle")}
            ingresos={pedidos
              .filter((p) => p.restaurante === "Café Univalle")
              .reduce((sum, p) => sum + p.precio, 0)}
            onAvanzar={avanzar}
            onValidar={validar}
            onEditarEntradas={(entradas) => editarEntradas("Café Univalle", entradas)}
            onEditarSegundos={(segundos) => editarSegundos("Café Univalle", segundos)}
            onLogout={() => setView("landing")}
          />
        )}
        {view === "landing" && <Landing onLogin={(role) => setView(role)} />}
      </div>
    </>
  )
}

export function JamaApp() {
  return (
    <ToastProvider>
      <Shell />
    </ToastProvider>
  )
}
