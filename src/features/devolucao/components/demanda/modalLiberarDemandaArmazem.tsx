import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/_shared/components/ui/dialog'
import { Button } from '@/_shared/components/ui/button'
import { Warehouse } from 'lucide-react'
import { useLiberarDemandaArmazem } from '@/services/api/hooks/devolucao/devolucao'
import { createMutationOptions } from '@/_shared/lib/mutationOptions'
import { toast } from 'react-toastify'
import { useQueryClient } from '@tanstack/react-query'

type ModalLiberarDemandaArmazemProps = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ModalLiberarDemandaArmazem({ id, open, onOpenChange }: ModalLiberarDemandaArmazemProps) {
  const queryClient = useQueryClient()

  const { mutate: liberarDemanda, isPending } = useLiberarDemandaArmazem(
    createMutationOptions({
      onSuccessCallback: () => {
        toast.success('Demanda liberada com sucesso!')
        queryClient.invalidateQueries({ queryKey: ['listarNotasDemanda', id] })
        onOpenChange(false)
      },
      onErrorCallback: (error) => {
        toast.error(error.message)
      },
    }),
  )

  const handleReabrirDemanda = () => {
    liberarDemanda({ demandaId: id })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Warehouse className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle>Liberar Demanda para o Armazém</DialogTitle>
          </div>
        </DialogHeader>
        <div className="py-4 text-sm text-muted-foreground">
          <p>
            Você tem certeza que deseja liberar esta demanda? A equipe do armazém
            será notificada para iniciar o processo de recebimento.
          </p>
          <p className="mt-2 font-semibold">
            Esta ação não poderá ser desfeita.
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Cancelar
            </Button>
          </DialogClose>
          <Button
            variant="default"
            onClick={handleReabrirDemanda}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                Liberando...
              </>
            ) : (
              'Sim, Liberar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}