'use client'
import { useFieldArray } from "react-hook-form";
import { FormInput } from "@/_shared/components/hookForms/FormInput";
// Subcomponente responsável pelos itens de cada nota

export function NotaItens({ control, notaIndex }: { control: any; notaIndex: number }) {
  const { fields: itensFields } = useFieldArray({
    control,
    name: `notas.${notaIndex}.itens`,
  });

  return (
    <div className="space-y-2 pl-4">
      <h3 className="font-medium">Itens</h3>
      {itensFields.map((item: any, itemIndex: number) => (
        <div key={item.id} className="flex gap-2">
          <FormInput
            name={`notas.${notaIndex}.itens.${itemIndex}.sku`}
            label="SKU"
            defaultValue={item.sku}
          />
          <span>{item.descricao}</span>
        </div>
      ))}
    </div>
  );
}
