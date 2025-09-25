import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/_shared/components/ui/dialog'
import { Button } from '@/_shared/components/ui/button'
import { RotateCw } from 'lucide-react'
import { useReabrirDemanda } from '@/services/api/hooks/devolucao/devolucao'
import { createMutationOptions } from '@/_shared/lib/mutationOptions'
import { toast } from 'react-toastify'
import { useQueryClient } from '@tanstack/react-query'

type ModalReabrirDemandaProps = {
  demandaId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ModalReabrirDemanda({ demandaId, open, onOpenChange }: ModalReabrirDemandaProps) {
  const queryClient = useQueryClient()

  const { mutate: reabrirDemanda, isPending } = useReabrirDemanda(
    createMutationOptions({
      onSuccessCallback: () => {
        toast.success('Demanda reaberta com sucesso!')
        queryClient.invalidateQueries({ queryKey: ['listarNotasDemanda', demandaId] })
        onOpenChange(false)
      },
      onErrorCallback: (error) => {
        toast.error(error.message)
      },
    }),
  )

  const handleReabrirDemanda = () => {
    reabrirDemanda({ demandaId })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
              <RotateCw className="h-6 w-6 text-amber-500" />
            </div>
            <DialogTitle>Reabrir Demanda</DialogTitle>
          </div>
        </DialogHeader>
        <div className="py-4 text-sm text-muted-foreground">
          <p>
            Você tem certeza que deseja reabrir esta demanda? Esta ação deve
            ser usada para corrigir anomalias após a finalização do armazém.
          </p>
          <p className="mt-2 font-semibold">
            Lembre-se de comunicar a equipe sobre esta alteração.
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
                Reabrindo...
              </>
            ) : (
              'Sim, Reabrir'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}