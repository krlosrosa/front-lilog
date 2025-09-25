import { ListarNotasDemandaResponseZodDto } from "@/services/api/model";
import { Card, CardContent, CardHeader, CardTitle } from "@/_shared/components/ui/card";
import { Button } from "@/_shared/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/_shared/components/ui/tooltip";
import { Truck, Layers, CheckCircle2, FileText, CalendarDays, Plus, MoreVertical, Trash2, Warehouse, RotateCw } from "lucide-react";
import { formatDate } from "../../utils/formatData";
import { booleanBadge } from "../../utils/booleanBadge";
import { Badge } from "@/_shared/components/ui/badge";
import { useRouter } from "next/navigation";
import ModalExcluirDemanda from "./modalExcluirDemanda";
import ModalLiberarDemandaArmazem from "./modalLiberarDemandaArmazem";
import ModalReabrirDemanda from "./modalReabrirDemandaArmazem";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/_shared/components/ui/dropdown-menu";

type SummaryProps = {
  id: string;
  data: ListarNotasDemandaResponseZodDto;
};
export const Summary = ({ id, data }: SummaryProps) => {
  const router = useRouter();
  const [isExcluirOpen, setIsExcluirOpen] = useState(false);
  const [isLiberarOpen, setIsLiberarOpen] = useState(false);
  const [isReabrirOpen, setIsReabrirOpen] = useState(false);

  const handleAddNota = () => {
    router.push(`/devolucao/demanda/${id}/adicionar`);
  }

  const handleFinalizarDemanda = () => {
    router.push(`/devolucao/demanda/${id}/finalizar`);
  }

  return (
    <>
      <Card className="">
        <CardHeader className="py-0 px-2 m-0 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm">Resumo da Demanda</CardTitle>
            <Badge>{data.status}</Badge>
            {data.cargaSegregada && (
              <div className="hidden sm:inline-flex">
                <Badge className="text-black bg-red-300">Carga Segregada</Badge>
              </div>
            )}
          </div>
          <TooltipProvider>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="sm"
                    className="h-7 px-2"
                    aria-label="Adicionar Nota"
                    onClick={handleAddNota}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="ml-1 hidden md:inline">Adicionar Nota</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Adicionar Nota</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="sm"
                    variant="default"
                    className="h-7 px-2"
                    aria-label="Finalizar Demanda"
                    onClick={handleFinalizarDemanda}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="ml-1 hidden md:inline">Finalizar Demanda</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Finalizar Demanda</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 px-2"
                    aria-label="Liberar para Armazém"
                    onClick={() => setIsLiberarOpen(true)}
                  >
                    <Warehouse className="h-4 w-4" />
                    <span className="ml-1 hidden md:inline">
                      Liberar p/ Armazém
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Liberar para Armazém
                </TooltipContent>
              </Tooltip>

              <DropdownMenu modal={false}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2"
                        aria-label="Mais opções"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Mais Opções</TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsReabrirOpen(true)}>
                    <RotateCw className="mr-2 h-4 w-4" />
                    <span>Reabrir Demanda</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIsExcluirOpen(true)}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Excluir Demanda</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TooltipProvider>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-2 px-2 py-0 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-muted-foreground" />
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Placa</p>
              <p className="text-sm font-medium">{data.placa}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-muted-foreground" />
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Transportadora</p>
              <p className="text-sm font-medium">{data.transportadora}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Motorista</p>
              <p className="text-sm font-medium">{data.motorista}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Criado em</p>
              <p className="text-sm font-medium">{formatDate(data.criadoEm)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Retorno Palete</p>
              <div>{booleanBadge(data.retornoPalete)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Qtde Paletes</p>
              <p className="text-sm font-medium">{data.quantidadePaletes ?? '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <ModalExcluirDemanda id={id} open={isExcluirOpen} onOpenChange={setIsExcluirOpen} />
      <ModalLiberarDemandaArmazem id={id} open={isLiberarOpen} onOpenChange={setIsLiberarOpen} />
      <ModalReabrirDemanda demandaId={id} open={isReabrirOpen} onOpenChange={setIsReabrirOpen} />
    </>
  );
};