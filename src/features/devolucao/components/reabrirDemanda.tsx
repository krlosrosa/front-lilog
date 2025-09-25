import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/_shared/components/ui/dialog";
import { Button } from "@/_shared/components/ui/button";
import { useParams } from "next/navigation";
import { useReabrirDemanda } from "@/services/api/hooks/devolucao/devolucao";

export const ReabrirDemanda = () => {
  const { mutate: reabrirDemanda } = useReabrirDemanda();
  const { id } = useParams();

  const handleReabrirDemanda = () => {
    reabrirDemanda({
      demandaId: id as string,
    });
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button>
          Reabrir Demanda
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reabrir Demanda {id}</DialogTitle>
        </DialogHeader>
        <Button onClick={handleReabrirDemanda}>Reabrir Demanda</Button>
      </DialogContent>
    </Dialog>
  )
}