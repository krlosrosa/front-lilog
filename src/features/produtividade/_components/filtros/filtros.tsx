import { Button } from "@/_shared/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/_shared/components/ui/dropdown-menu";
import { Input } from "@/_shared/components/ui/input";
import { MoreVertical } from "lucide-react";

export function Filtros() {
  return (
    <div className="my-2 flex gap-2">
      <Input placeholder="Pesquisar" className="w-full border border-gray-300 rounded-md p-2" />
      <FiltroStatus/>
      <FiltroEmpresa/>
      <FiltroSegmento/>
    </div>
  )
}

function FiltroEmpresa(){
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="default">
            Empresa
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>Lactalis</DropdownMenuItem>
          <DropdownMenuItem>Itambé</DropdownMenuItem>
          <DropdownMenuItem>DPA</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function FiltroSegmento(){
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="default">
            Segmento
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>Seco</DropdownMenuItem>
          <DropdownMenuItem>Refrigerado</DropdownMenuItem>
          <DropdownMenuItem>Queijo</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function FiltroStatus(){
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="default">
            Status
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>Em Andamento</DropdownMenuItem>
          <DropdownMenuItem>Em Pausa</DropdownMenuItem>
          <DropdownMenuItem>Finalizado</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}