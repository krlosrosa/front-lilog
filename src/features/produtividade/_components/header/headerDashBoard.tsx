
import { FinalizarProdutividade } from "../actions/demanda/finalizarProdutividade";
import { Badge } from "@/_shared/components/ui/badge";
import { DropDownMenuAction } from "./dropDownMenuAction";
import { IniciarDemandaProdutividadeWithSheet } from "../actions/demanda/iniciarDemandaProdutividadeWithSheet";
import { useDefinicaoStore } from "../../stores/definicao.store";
import { Button } from "@/_shared/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from 'date-fns'

type Props = {
  setOpen: (open: boolean) => void
}

export function HeaderDashBoard({ setOpen }: Props) {
  const { processo, dataTrabalho } = useDefinicaoStore()

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-2 gap-4">
      <div>
        <div className="flex items-center justify-end gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard de Produtividade
          </h1>
          <div className="flex items-center gap-2">
            <Badge className="text-xs lowercase items-center justify-center">{processo}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground">
            Visão geral dos processos logísticos
          </p>

          <Badge variant="outline" className="text-xs lowercase items-center justify-center">
            {dataTrabalho ? format(new Date(dataTrabalho), 'dd/MM/yyyy') : 'Sem data'}
          </Badge>
        </div>
      </div>
      <div className="flex gap-2 w-full md:w-auto items-center">
        <IniciarDemandaProdutividadeWithSheet />
        <FinalizarProdutividade />
        <DropDownMenuAction />
        <Button size='icon' variant="outline" onClick={() => setOpen(true)}><CalendarIcon /></Button>
      </div>
    </div>
  )
}