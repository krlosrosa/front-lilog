'use client'
import { z } from "zod"
import { FormInput } from "@/_shared/components/hookForms/FormInput";
import { useProdutividadeControllerFinalizarPicking } from "@/services/api/hooks/produtividade/produtividade"
import { produtividadeControllerFinalizarPickingBody } from "@/services/api/schema/produtividade/produtividade.zod"
import { Button } from "@/_shared/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/_shared/components/ui/dialog";
import { createMutationOptions } from "@/_shared/lib/mutationOptions";
import { FormTextAreaInput } from "@/_shared/components/hookForms/FormTextAreaInput";
import { Form, FormRef } from "@/_shared/components/hookForms/Form";


const mergeFinalizarProdutividadeBody = produtividadeControllerFinalizarPickingBody.extend({
  palletId: z.string(),
})

type FinalizarProdutividadeBody = z.infer<typeof mergeFinalizarProdutividadeBody>;

export function FinalizarProdutividade() {

  const { mutate: finalizarProdutividade } = useProdutividadeControllerFinalizarPicking(createMutationOptions({
    successMessage: 'Produtividade finalizada com sucesso!',
    errorMessage: 'Erro ao finalizar produtividade',
  }))

  const onSubmit = (data: FinalizarProdutividadeBody) => {
    finalizarProdutividade({
      data: { observacao: data.observacao },
      palletId: data.palletId
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Finalizar Produtividade</Button>
      </DialogTrigger>
      <DialogContent>
        <Form
          schema={mergeFinalizarProdutividadeBody}
          onSubmit={onSubmit}
          
        >
          <DialogHeader>
            <DialogTitle>Finalizar Produtividade</DialogTitle>
            <DialogDescription>
              Finalize a produtividade da pallet selecionada.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <FormInput name="palletId" label="Pallet ID" type="string" />
            <FormTextAreaInput name="observacao" label="Observação" />
          </div>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}