'use client'
import { z } from "zod"
import { useProdutividadeControllerAddPausaGeral } from "@/services/api/hooks/produtividade/produtividade"
import { produtividadeControllerAddPausaGeralBody } from "@/services/api/schema/produtividade/produtividade.zod"
import { Button } from "@/_shared/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/_shared/components/ui/dialog";
import { FormSelectInput, SelectOption } from "@/_shared/components/hookForms/FormSelectInput";
import { createMutationOptions } from "@/_shared/lib/mutationOptions";
import { Form } from "@/_shared/components/hookForms/Form";
import { useFormContext } from "react-hook-form";

type AddPausaGeralBody = z.infer<typeof produtividadeControllerAddPausaGeralBody>;

const motivosBase: SelectOption[] = [
  { value: 'PAUSA_TERMICA', label: 'Pausa Térmica' },
  { value: 'HORARIO_REFEICAO', label: 'Horário de Refeição' },
  { value: 'TREINAMENTO_FEEDBACK', label: 'Treinamento / Feedback' }, 
]

const segmentos: SelectOption[] = [
  { value: 'SECA', label: 'Seco' },
  { value: 'REFR', label: 'Refrigerado' },
  { value: 'QUEIJO', label: 'Queijo' },
]


export function AddPausaGeral() {

  const { mutate: addPausaGeral } = useProdutividadeControllerAddPausaGeral(createMutationOptions({
    successMessage: 'Pausa Geral adicionada com sucesso',
    errorMessage: 'Erro ao adicionar Pausa Geral',
  }))
  const onSubmit = (data: AddPausaGeralBody) => {
    addPausaGeral({ data: data });
  }

  const MotivoSelect = () => {
    const { watch } = useFormContext<AddPausaGeralBody>()
    const currentSegment = watch('segmento')
    const motivosFiltrados: SelectOption[] = (currentSegment === 'SECA')
      ? motivosBase.filter(m => m.value !== 'PAUSA_TERMICA')
      : motivosBase
    return (
      <FormSelectInput 
        className="w-full" 
        name="motivo" 
        label="Motivo" 
        options={motivosFiltrados} 
      />
    )
  }


  return (
    <div className="w-full">
      <Dialog>
        <DialogTrigger className="w-full" asChild>
          <Button className="w-full" variant="outline">Pausa Geral</Button>
        </DialogTrigger>
        <DialogContent>
          <Form
            schema={produtividadeControllerAddPausaGeralBody}
            onSubmit={onSubmit}
          >
            <DialogHeader>
              <DialogTitle>Adicionar Pausa Geral</DialogTitle>
              <DialogDescription>
                Adicione uma pausa geral.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 w-full">
              <FormSelectInput 
                className="w-full" 
                name="segmento" 
                label="Segmento" 
                options={segmentos}
              />
              <MotivoSelect />
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