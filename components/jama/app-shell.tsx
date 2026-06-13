"use client"

import { useCallback, useEffect, useState } from "react"
import { Landing } from "@/components/jama/landing"
import { StudentDashboard } from "@/components/jama/student-dashboard"
import { RestaurantDashboard } from "@/components/jama/restaurant-dashboard"
import { ViewSwitcher } from "@/components/jama/view-switcher"
import { ToastProvider, useToast } from "@/components/jama/toast"
import {
  cargarPlatos,
  generarCodigo,
  generarIdPlato,
  guardarPlatos,
  PLATOS_SEMILLA,
  type EstadoPedido,
  type MetodoPago,
  type Pedido,
  type Plato,
} from "@/lib/jama-data"

export type Role = "alumno" | "restaurante"
export type View = "landing" | "alumno" | "restaurante"

function Shell() {
  const [view, setView] = useState<View>("landing")
  const [platos, setPlatos] = useState<Plato[]>(PLATOS_SEMILLA)
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [ingresos, setIngresos] = useState(0)
  const { notify } = useToast()

  useEffect(() => {
    setPlatos(cargarPlatos())
  }, [])

  useEffect(() => {
    guardarPlatos(platos)
  }, [platos])

  const reservar = useCallback(
    (plato: Plato, entrada: string, metodoPago: MetodoPago): Pedido => {
      const pedido: Pedido = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        codigo: generarCodigo(),
        platoId: plato.id,
        plato: plato.nombre,
        entrada,
        restaurante: plato.restaurante,
        precio: plato.precio,
        hora: "Recojo Rápido",
        modalidad: "takeout",
        metodoPago,
        estado: "recibido",
        creado: Date.now(),
      }
      // Resta -1 al stock del plato en el estado global
      setPlatos((prev) =>
        prev.map((p) =>
          p.id === plato.id ? { ...p, stock: Math.max(0, p.stock - 1) } : p,
        ),
      )
      // Agrega a la lista global de pedidos activos
      setPedidos((prev) => [...prev, pedido])
      // Suma el ingreso al total del día del restaurante
      setIngresos((prev) => prev + plato.precio)
      notify({
        tone: "success",
        title: "¡Reserva confirmada!",
        message: `${entrada} + ${plato.nombre} en ${plato.restaurante}. Código #${pedido.codigo}.`,
      })
      return pedido
    },
    [notify],
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

  const agregarPlato = useCallback(
    (nuevo: Omit<Plato, "id">) => {
      const plato: Plato = { ...nuevo, id: generarIdPlato() }
      setPlatos((prev) => [...prev, plato])
      notify({
        tone: "success",
        title: "Plato agregado",
        message: `"${nuevo.nombre}" ya está disponible para los estudiantes.`,
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
            onReservar={reservar}
            onLogout={() => setView("landing")}
          />
        )}
        {view === "restaurante" && (
          <RestaurantDashboard
            platos={platos}
            pedidos={pedidos}
            ingresos={ingresos}
            onAvanzar={avanzar}
            onValidar={validar}
            onEditarPlato={editarPlato}
            onAgregarPlato={agregarPlato}
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
