import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/_shared/components/ui/dialog'
import { Button } from '@/_shared/components/ui/button'
import { AlertTriangle } from 'lucide-react'

type ModalConfirmarInclusaoNotaProps = {
  itemCount: number
  isSubmitting: boolean
}

export default function ModalConfirmarInclusaoNota({
  itemCount,
  isSubmitting,
}: ModalConfirmarInclusaoNotaProps) {
  if (itemCount === 0) {
    return null
  }

  const itemText = itemCount > 1 ? 'Itens' : 'Item'
  const notaText = itemCount > 1 ? 'notas' : 'nota'

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={isSubmitting}>Adicionar {itemText} à Demanda</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <AlertTriangle className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle>Confirmar Inclusão</DialogTitle>
          </div>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Você está prestes a adicionar {itemCount} {notaText} fiscal(is) a esta
            demanda. Deseja continuar?
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button
            id="confirmar-inclusao-nota"
            variant="default"
            type="submit"
            form="adicionar-itens-em-demanda-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                Adicionando...
              </>
            ) : (
              'Confirmar Inclusão'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}