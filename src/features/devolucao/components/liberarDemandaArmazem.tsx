import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/_shared/components/ui/dialog";
import { Button } from "@/_shared/components/ui/button";
import { useParams } from "next/navigation";
import { useLiberarDemandaArmazem } from "@/services/api/hooks/devolucao/devolucao";

export const LiberarDemandaArmazem = () => {

  const { mutate: liberarDemandaArmazem } = useLiberarDemandaArmazem();

  const handleLiberarDemandaArmazem = () => {
    liberarDemandaArmazem({
      demandaId: id as string,
    });
  }

  const { id } = useParams();
  return (
    <Dialog>
      <DialogTrigger>
        <Button>
          Liberar Demanda Armazém
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Liberar Demanda Armazém {id}</DialogTitle>
        </DialogHeader>
        <Button onClick={handleLiberarDemandaArmazem}>Liberar Demanda Armazém</Button>
      </DialogContent>
    </Dialog>
  )
}