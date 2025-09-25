'use client'
import { z } from "zod"
import { FormInput } from "@/_shared/components/hookForms/FormInput";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { useProdutividadeControllerFinalizarPausaGeral } from "@/services/api/hooks/produtividade/produtividade"
import { produtividadeControllerFinalizarPausaGeralBody } from "@/services/api/schema/produtividade/produtividade.zod"
import { Button } from "@/_shared/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/_shared/components/ui/dialog";
import { createMutationOptions } from "@/_shared/lib/mutationOptions";
import { Form } from "@/_shared/components/hookForms/Form";
import { useDefinicaoStore } from "@/features/produtividade/stores/definicao.store";
import { useAuthStore } from "@/_shared/stores/auth.store";
import { useState } from "react";

type FinalizarPausaGeralBody = z.infer<typeof produtividadeControllerFinalizarPausaGeralBody>;

export function FinalizarPausaGeral() {
  const { centerId } = useAuthStore()
  const { processo } = useDefinicaoStore()
  const [segmento, setSegmento] = useState<string>('')
  const methods = useForm<FinalizarPausaGeralBody>({
    resolver: zodResolver(produtividadeControllerFinalizarPausaGeralBody),
    defaultValues: {
      centerId: centerId || '',
      processo: processo || '',
      segmento: segmento || '',
    }
  });
  const { mutate: finalizarPausaGeral } = useProdutividadeControllerFinalizarPausaGeral(createMutationOptions({
    successMessage: 'Pausa Geral Finalizada com sucesso',
    errorMessage: 'Erro ao finalizar Pausa Geral',
  }))
  const onSubmit = (data: FinalizarPausaGeralBody) => {
    finalizarPausaGeral({ data: data });
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" variant="outline">Finalizar Pausa Geral</Button>
      </DialogTrigger>
      <DialogContent>
        <Form
          schema={produtividadeControllerFinalizarPausaGeralBody}
          onSubmit={onSubmit}
        >
          <DialogHeader>
            <DialogTitle>Finalizar Pausa Geral</DialogTitle>
            <DialogDescription>
              Finalize a pausa geral.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <FormInput name="turno" label="Turno" type="string" />
            <FormInput name="segmento" label="Segmento" type="string" />
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
  )
}