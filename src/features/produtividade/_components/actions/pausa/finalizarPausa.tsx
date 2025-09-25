'use client'
import { z } from "zod"
import { FormInput } from "@/_shared/components/hookForms/FormInput";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { useProdutividadeControllerFinalizarPausaIndividual } from "@/services/api/hooks/produtividade/produtividade"
import { produtividadeControllerFinalizarPausaIndividualParams } from "@/services/api/schema/produtividade/produtividade.zod"
import { Button } from "@/_shared/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/_shared/components/ui/dialog";
import { createMutationOptions } from "@/_shared/lib/mutationOptions";
import { Form } from "@/_shared/components/hookForms/Form";

type FinalizarPausaIndividualBody = z.infer<typeof produtividadeControllerFinalizarPausaIndividualParams>;

export function FinalizarPausa() {
  const methods = useForm<FinalizarPausaIndividualBody>({
    resolver: zodResolver(produtividadeControllerFinalizarPausaIndividualParams),
  });
  const { mutate: finalizarPausa } = useProdutividadeControllerFinalizarPausaIndividual(createMutationOptions({
    successMessage: 'Pausa Finalizada com sucesso',
    errorMessage: 'Erro ao finalizar Pausa',
  }))

  const onSubmit = (data: FinalizarPausaIndividualBody) => {
    finalizarPausa(data);
  }
  return (
    <div className="w-full">
      <Dialog>
        <DialogTrigger className="w-full " asChild>
          <Button className="w-full" variant="outline">Finalizar Pausa</Button>
        </DialogTrigger>
        <DialogContent>
          <Form
            schema={produtividadeControllerFinalizarPausaIndividualParams}
            onSubmit={onSubmit}
          >
              <DialogHeader>
                <DialogTitle>Finalizar Pausa</DialogTitle>
                <DialogDescription>
                  Finalize a pausa do pallet selecionado.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <FormInput name="palletId" label="Pallet ID" type="string" />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}