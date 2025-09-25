import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/_shared/components/ui/dialog'
import { Button } from '@/_shared/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { useDeletarDemanda } from '@/services/api/hooks/devolucao/devolucao';
import { createMutationOptions } from '@/_shared/lib/mutationOptions';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

type ModalExcluirDemandaProps = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ModalExcluirDemanda({ id, open, onOpenChange }: ModalExcluirDemandaProps) {
  const router = useRouter();
  const { mutate: excluirDemanda, isPending } = useDeletarDemanda(
    createMutationOptions({
      onSuccessCallback: () => {
        toast.success(`Demanda ${id} excluída com sucesso`);
        onOpenChange(false);
        router.back();
      },
      onErrorCallback(error) {
        toast.error(error.message);
      },
    })
  );


  const handleExcluirDemanda = () => {
    excluirDemanda({ demandaId: id });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <DialogTitle>Excluir Demanda</DialogTitle>
          </div>
        </DialogHeader>
        <div className="py-4 text-sm text-muted-foreground">
          <p>
            Você tem certeza que deseja excluir esta demanda? Todos os dados
            associados a ela serão perdidos permanentemente.
          </p>
          <p className="mt-2 font-semibold text-destructive">
            Esta ação não pode ser desfeita.
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Cancelar
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleExcluirDemanda}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                Excluindo...
              </>
            ) : (
              'Sim, Excluir'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}