import { UtensilsCrossed } from "lucide-react"

export function JamaLogo({
  className = "",
  invert = false,
}: {
  className?: string
  invert?: boolean
}) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <UtensilsCrossed className="size-5" />
      </span>
      <span
        className={`text-2xl font-extrabold tracking-tight ${
          invert ? "text-primary-foreground" : "text-foreground"
        }`}
      >
        JAMA
      </span>
    </span>
  )
}
