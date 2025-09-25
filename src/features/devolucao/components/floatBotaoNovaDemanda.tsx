import { Button } from "@/_shared/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export const FloatBotaoNovaDemanda = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        asChild
        size="lg"
        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        aria-label="Criar nova demanda"
      >
        <Link href="/devolucao/criar">
          <Plus className="h-6 w-6" />
        </Link>
      </Button>
    </div>
  )
}