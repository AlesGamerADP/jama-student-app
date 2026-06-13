"use client"

import { useCallback, useState } from "react"
import { Landing } from "@/components/jama/landing"
import { StudentDashboard } from "@/components/jama/student-dashboard"
import { RestaurantDashboard } from "@/components/jama/restaurant-dashboard"
import { ViewSwitcher } from "@/components/jama/view-switcher"
import { ToastProvider, useToast } from "@/components/jama/toast"
import {
  generarCodigo,
  MENU_DEL_DIA_SEMILLA,
  PLATOS_SEMILLA,
  type EstadoPedido,
  type MenuDelDia,
  type MetodoPago,
  type Pedido,
  type Plato,
  type Segundo,
} from "@/lib/jama-data"

export type Role = "alumno" | "restaurante"
export type View = "landing" | "alumno" | "restaurante"

function Shell() {
  const [view, setView] = useState<View>("landing")
  const [platos, setPlatos] = useState<Plato[]>(PLATOS_SEMILLA)
  const [menu, setMenu] = useState<MenuDelDia>(MENU_DEL_DIA_SEMILLA)
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [ingresos, setIngresos] = useState(0)
  const { notify } = useToast()

  const reservar = useCallback(
    (
      entrada: string,
      segundo: Segundo,
      hora: string,
      metodoPago: MetodoPago,
    ): Pedido => {
      const pedido: Pedido = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        codigo: generarCodigo(),
        entrada,
        segundo: segundo.nombre,
        restaurante: "Café Univalle",
        precio: menu.precioTotal,
        hora,
        modalidad: "takeout",
        metodoPago,
        estado: "recibido",
        creado: Date.now(),
      }
      // Resta -1 al stock del segundo elegido
      setMenu((prev) => ({
        ...prev,
        segundos: prev.segundos.map((s) =>
          s.id === segundo.id ? { ...s, stock: Math.max(0, s.stock - 1) } : s,
        ),
      }))
      // Agrega el pedido a la lista global
      setPedidos((prev) => [...prev, pedido])
      // Suma el ingreso
      setIngresos((prev) => prev + menu.precioTotal)
      notify({
        tone: "success",
        title: "¡Reserva confirmada!",
        message: `${entrada} + ${segundo.nombre} — recojo ${hora}. Código #${pedido.codigo}.`,
      })
      return pedido
    },
    [menu, notify],
  )

  const editarPlato = useCallback(
    (id: number, cambios: { nombre: string; precio: number; stock: number }) => {
      setPlatos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...cambios } : p)),
      )
      notify({
        tone: "success",
        title: "Menú actualizado",
        message: `Los cambios en "${cambios.nombre}" ya son visibles para los estudiantes.`,
      })
    },
    [notify],
  )

  const editarEntradas = useCallback(
    (nuevasEntradas: string[]) => {
      setMenu((prev) => ({ ...prev, entradas: nuevasEntradas }))
      notify({
        tone: "success",
        title: "Entradas actualizadas",
        message: "Los cambios ya son visibles en el catálogo del estudiante.",
      })
    },
    [notify],
  )

  const editarSegundos = useCallback(
    (nuevosSegundos: Segundo[]) => {
      setMenu((prev) => ({ ...prev, segundos: nuevosSegundos }))
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
            menu={menu}
            pedidos={pedidos}
            onReservar={reservar}
            onLogout={() => setView("landing")}
          />
        )}
        {view === "restaurante" && (
          <RestaurantDashboard
            menu={menu}
            platos={platos}
            pedidos={pedidos}
            ingresos={ingresos}
            onAvanzar={avanzar}
            onValidar={validar}
            onEditarPlato={editarPlato}
            onEditarEntradas={editarEntradas}
            onEditarSegundos={editarSegundos}
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
