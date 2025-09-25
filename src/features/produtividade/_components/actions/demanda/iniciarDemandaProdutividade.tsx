'use client'
import { useProdutividadeControllerIniciarProdutividade } from "@/services/api/hooks/produtividade/produtividade";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/_shared/components/ui/dialog";
import { Button } from "@/_shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/_shared/components/ui/tabs";
import { EtapaUmAddPalete } from "./etapaUmAddPalete";
import { EtapaDoisAddPalete } from "./etapaDoisAddPalete";
import { useState } from "react";
import { ListarFuncionariosPorCentroZodDtoOutput } from "@/services/api/model";
import { createMutationOptions } from "@/_shared/lib/mutationOptions";
import { usePaletes } from "../../../_hooks/usePaletes";
import { Play, Package, Users, CheckCircle, Plus } from "lucide-react";
import { formatName } from "@/_shared/utils/formatName";
import { useFormContext } from "react-hook-form";
import { useAuthStore } from "@/_shared/stores/auth.store";
import { useDefinicaoStore } from "@/features/produtividade/stores/definicao.store";
type Funcionario = ListarFuncionariosPorCentroZodDtoOutput[number]


export function IniciarDemandaProdutividade() {
  const { paletes, add, remove, clear } = usePaletes();
  const [tab, setTab] = useState<'paletes' | 'funcionario'>('paletes');
  const [isOpen, setIsOpen] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState<Funcionario | null>(null);
  const { centerId } = useAuthStore()
  const { processo } = useDefinicaoStore()

  const { mutate: addProdutividade, isPending } = useProdutividadeControllerIniciarProdutividade(createMutationOptions({
    successMessage: 'Produtividade iniciada com sucesso!',
    errorMessage: 'Erro ao iniciar produtividade',
    onSuccessCallback: () => {
      setIsOpen(false);
    }
  }))

  const onSubmit = () => {
    const filteredPaletes = paletes.filter(p => p.trim() !== '');
    addProdutividade({
      centerId: centerId || '',
      data: {
        inicio: new Date().toISOString(),
        funcionarioId: funcionarioSelecionado?.id || '',
        paletesIds: filteredPaletes,
        processo: processo || 'SEPARACAO',
        turno: 'MANHA',
        obs: '',
        centerId: centerId || '',
      },
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 font-medium">
          <Play className="h-4 w-4" />
          Iniciar Demanda Produtividade
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-4/5 min-h-[90vh] max-h-[99vh] overflow-hidden">
        <DialogHeader className="space-y-3 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Play className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-lg font-semibold tracking-tight">
                Iniciar Nova Demanda
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Configure os paletes e funcionário para iniciar uma nova demanda de produtividade
              </DialogDescription>
            </div>
          </div>
          
          {/* Progress Indicator with Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
                tab === 'paletes' 
                  ? 'bg-primary/10 border-primary/30 text-primary' 
                  : paletes.length > 0 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-muted border-border text-muted-foreground'
              }`}>
                {paletes.length > 0 ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Package className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                  1. Paletes {paletes.length > 0 && `(${paletes.length})`}
                </span>
              </div>
              
              <div className={`w-8 h-0.5 rounded-full transition-colors ${
                paletes.length > 0 ? 'bg-primary' : 'bg-border'
              }`} />
              
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
                tab === 'funcionario' 
                  ? 'bg-primary/10 border-primary/30 text-primary' 
                  : funcionarioSelecionado 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-muted border-border text-muted-foreground'
              }`}>
                {funcionarioSelecionado ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Users className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                  2. Funcionário {funcionarioSelecionado && `(${formatName(funcionarioSelecionado.name)})`}
                </span>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2">
              {tab === 'funcionario' && (
                <Button 
                  type="button" 
                  onClick={() => setTab('paletes')} 
                  variant="outline" 
                  className="gap-2"
                >
                  Etapa Anterior
                </Button>
              )}
              {tab === 'paletes' && (
                <Button 
                  disabled={paletes.length === 0} 
                  type="button" 
                  onClick={() => setTab('funcionario')} 
                  className="gap-2"
                >
                  Próxima Etapa
                  <Plus className="h-4 w-4" />
                </Button>
              )}
              {tab === 'funcionario' && funcionarioSelecionado && (
                <Button 
                  type="button" 
                  onClick={onSubmit}
                  className="gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Finalizar Demanda
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue={tab} value={tab}>
            <TabsList hidden>
              <TabsTrigger value="paletes">Paletes</TabsTrigger>
              <TabsTrigger value="funcionario">Funcionário</TabsTrigger>
            </TabsList>
            
            <TabsContent value="paletes" className="mt-4">
              <EtapaUmAddPalete paletes={paletes} add={add} remove={remove} setTab={setTab} />
            </TabsContent>
            
            <TabsContent value="funcionario" className="mt-4">
              <EtapaDoisAddPalete 
                setTab={setTab} 
                handleAdicionarDemanda={onSubmit} 
                funcionarioSelecionado={funcionarioSelecionado} 
                setFuncionarioSelecionado={setFuncionarioSelecionado} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}