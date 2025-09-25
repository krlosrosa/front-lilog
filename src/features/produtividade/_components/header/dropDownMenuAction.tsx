import { Pause, MoreVertical, PlayCircle, Trash2 } from "lucide-react";
import { AddPausa, FinalizarPausa, AddPausaGeral, FinalizarPausaGeral } from "../actions";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/_shared/components/ui/dropdown-menu";
import { Button } from "@/_shared/components/ui/button";
import { Action } from "../../types/actionDropDown.type";
import { DeletarDemanda } from "../actions/demanda/deletarDemadna";

export function DropDownMenuAction() {
  const actions: Action[] = [
    {
      id: 'addPausa',
      label: 'Iniciar Pausa',
      icon: <Pause className="mr-2 h-4 w-4" />,
      component: <AddPausa />,
      isPrimary: false, // Não é um botão principal
    },
    {
      id: 'finalizarPausa',
      label: 'Finalizar Pausa',
      icon: <PlayCircle className="mr-2 h-4 w-4" />,
      component: <FinalizarPausa />,
      isPrimary: false,
    },
    {
      id: 'addPausaGeral',
      label: 'Iniciar Pausa Geral',
      icon: <Pause className="mr-2 h-4 w-4" />,
      component: <AddPausaGeral />,
      isPrimary: false, // Não é um botão principal
    },
    {
      id: 'finalizarPausaGeral',
      label: 'Finalizar Pausa Geral',
      icon: <PlayCircle className="mr-2 h-4 w-4" />,
      component: <FinalizarPausaGeral />,
      isPrimary: false,
    },
    {
      id: 'deletarDemanda',
      label: 'Deletar Demanda',
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      component: <DeletarDemanda />,
      isPrimary: false,
    },
    // Adicione TODAS as outras ações aqui...
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 flex flex-col gap-1">
        {actions.map((action) => (
          <DropdownMenuItem
            key={action.id}
            className="gap-2 cursor-pointer w-full"
            onSelect={(e) => e.preventDefault()}
            asChild
          >
            {action.component}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}