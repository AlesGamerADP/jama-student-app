"use client"

import { useCallback, useState } from "react"
import { Landing } from "@/components/jama/landing"
import { StudentDashboard } from "@/components/jama/student-dashboard"
import { RestaurantDashboard } from "@/components/jama/restaurant-dashboard"
import { ViewSwitcher } from "@/components/jama/view-switcher"
import { ToastProvider, useToast } from "@/components/jama/toast"
import {
  generarCodigo,
  PLATOS_SEMILLA,
  type EstadoPedido,
  type MetodoPago,
  type Modalidad,
  type Pedido,
  type Plato,
} from "@/lib/jama-data"

export type Role = "alumno" | "restaurante"
export type View = "landing" | "alumno" | "restaurante"

function Shell() {
  const [view, setView] = useState<View>("landing")
  const [platos, setPlatos] = useState<Plato[]>(PLATOS_SEMILLA)
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const { notify } = useToast()

  const reservar = useCallback(
    (
      plato: Plato,
      hora: string,
      modalidad: Modalidad,
      metodoPago: MetodoPago,
    ): Pedido => {
      const pedido: Pedido = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        codigo: generarCodigo(),
        platoId: plato.id,
        plato: plato.nombre,
        restaurante: plato.restaurante,
        precio: plato.precio,
        hora,
        modalidad,
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
      notify({
        tone: "success",
        title: "¡Reserva confirmada!",
        message: `${plato.nombre} — recojo ${hora}. Código #${pedido.codigo}.`,
      })
      return pedido
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
          pedidos={pedidos}
          onAvanzar={avanzar}
          onValidar={validar}
          onLogout={() => setView("landing")}
        />
      )}
      {view === "landing" && <Landing onLogin={(role) => setView(role)} />}
      <ViewSwitcher view={view} onChange={setView} />
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
