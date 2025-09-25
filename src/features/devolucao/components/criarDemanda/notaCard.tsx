import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/_shared/components/ui/card";
import { Badge } from "@/_shared/components/ui/badge";
import { FileText } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/_shared/components/ui/collapsible";
import { Button } from "@/_shared/components/ui/button";
import { Package } from "lucide-react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { TabelaItensRavex } from "./tabelaItens";
import { FormInput } from "@/_shared/components/hookForms/FormInput";
import { useFieldArray, useFormContext } from "react-hook-form";

export const NotaCard = () => {

  const { control } = useFormContext();


  const { fields } = useFieldArray({
    control,
    name: `notas`,
  });

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'DEVOLUCAO':
        return 'destructive';
      case 'DEVOLUCAO_PARCIAL':
        return 'secondary';
      case 'REENTREGA':
        return 'default';
      default:
        return 'outline';
    }
  };

  return (
    <div>
      {fields.map((nota: any, index) => {
        return (
          <div key={`${nota.notaFiscal}-${index}`} className="overflow-hidden mt-2">
            <Card className="overflow-hidden py-2 px-0">
              <CardHeader className="pb-0">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <FileText className="h-4 w-4" />
                      NF: {nota.notaFiscal}
                      <Badge variant={getTipoColor(nota.tipo)} className="text-xs">
                        {nota.tipo.replace('_', ' ')}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Operador: {nota.operador} • {nota.itens.length} item{nota.itens.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Motivo: {nota.motivoDevolucao}</p>
                  {nota.descMotivoDevolucao && (
                    <p className="text-muted-foreground text-xs mt-1">{nota.descMotivoDevolucao}</p>
                  )}
                </div>
                {nota.tipo === 'DEVOLUCAO_PARCIAL' && <div className="text-sm">
                  <FormInput name={`notas.${index}.notaFiscalParcial`} label="Nota Fiscal Parcial" />
                </div>}
              </CardHeader>

              <CardContent className="p-0">
                {/* Accordion para itens */}
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-between p-0 h-auto hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-2">
                        <Package className="h-3 w-3" />
                        <span className="text-sm font-medium">
                          Ver detalhes dos itens ({nota.itens.length})
                        </span>
                      </div>
                        <ChevronRight className="h-3 w-3" />
                    </Button>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="space-y-2">
                    <TabelaItensRavex nota={nota} index={index} />
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          </div>
        )
      })}
    </div>
  );
};
