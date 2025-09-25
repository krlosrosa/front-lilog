'use client'
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/_shared/stores/auth.store";
import { useState } from "react";
import { useAdicionarItensEmDemandaViaRavex, useGetInfoByViagemIdRavex, useListarNotasDemanda } from "@/services/api/hooks/devolucao/devolucao";
import { Card, CardContent, CardHeader, CardTitle } from "@/_shared/components/ui/card";
import { Button } from "@/_shared/components/ui/button";
import { Input } from "@/_shared/components/ui/input";
import { Label } from "@/_shared/components/ui/label";
import { AlertTriangle, Search } from "lucide-react";
import { getInfoByViagemIdRavexResponse } from "@/services/api/schema/devolucao/devolucao.zod";
import { Form } from "@/_shared/components/hookForms/Form";
import { NotaCard } from "../components/criarDemanda/notaCard";
import { FormStateLogger } from "../../../_shared/components/hookForms/formState.errors";
import { createMutationOptions } from "@/_shared/lib/mutationOptions";
import { toast } from "react-toastify";
import ResumoAdicionarNota from "../components/adicionarNota/resumoAdicionarNota";
import { Header } from "../components/header";
import ModalConfirmarInclusaoNota from "../components/adicionarNota/modalConfirmarInclusaoNota";
import { useFormErrors } from "@/_shared/hooks/useFormErrors";

export function AdicionarItemADemanda() {
  const errors = useFormErrors();
  const { id } = useParams();
  const router = useRouter();
  const { centerId } = useAuthStore();
  const [viagemId, setViagemId] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const { data, isLoading, error, refetch } = useGetInfoByViagemIdRavex(viagemId, {
    query: {
      enabled: false, // desativa a busca automática
    },
  });

  const { mutate: adicionarItensEmDemandaViaRavex, isPending } = useAdicionarItensEmDemandaViaRavex(
    createMutationOptions({
      onSuccessCallback: () => {
        router.push(`/devolucao/demanda/${id as string}`);
      },
      onErrorCallback(error) {
        toast.error(error.message);
      },
    })
  )

  const handleBuscar = () => {
    if (!viagemId.trim()) return;
    refetch();
    setHasSearched(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBuscar();
    }
  };

  const handleAdicionarItensEmDemandaViaRavex = () => {
    if (errors) {
      toast.error("Erros de validação do formulário");
      return;
    };
    if (!data?.notas) return;
    adicionarItensEmDemandaViaRavex({
      centerId: centerId ?? '',
      demandaId: id as string,
      data: data?.notas.map((item) => ({
        ...item,
        idViagemRavex: viagemId,
      })),
    });
  }

  return (
    <div className="space-y-4 p-4">
      <Header title={`Adicionar Item à Demanda #${id}`} subtitle="Adicione itens à demanda selecionada" />
      <ResumoAdicionarNota demandaId={id as string}/>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Search className="h-4 w-4" />
            Buscar Viagem Ravex
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="viagemId" className="text-sm">ID da Viagem</Label>
              <Input
                id="viagemId"
                value={viagemId}
                onChange={(e) => setViagemId(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite o ID da viagem Ravex"
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleBuscar}
                disabled={!viagemId.trim() || isLoading}
                className="h-10"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Buscar
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Estados de Loading e Error */}
      {isLoading && (
        <div className="flex items-center justify-center min-h-48">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground">Buscando informações da viagem...</p>
          </div>
        </div>
      )}

      {error && hasSearched && (
        <div className="flex flex-col items-center justify-center min-h-48 space-y-4">
          <AlertTriangle className="h-12 w-12 text-red-500" />
          <div className="text-center">
            <h2 className="text-lg font-semibold">Erro ao buscar viagem</h2>
            <p className="text-sm text-muted-foreground">
              Não foi possível encontrar informações para a viagem {viagemId}
            </p>
          </div>
        </div>
      )}
      {data && hasSearched && !isLoading && (
        <Form
          schema={getInfoByViagemIdRavexResponse}
          onSubmit={handleAdicionarItensEmDemandaViaRavex}
          onInvalid={() => toast.error('Erros de validação do formulário, verifique os erros no final da página')}
          formOptions={{ defaultValues: data, mode: 'onSubmit' }}
          id="adicionar-itens-em-demanda-form"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Resultado da Busca</CardTitle>
              {data.notas && data.notas.length > 0 && (
                <ModalConfirmarInclusaoNota
                  itemCount={data.notas.length}
                  isSubmitting={isPending}
                />
              )}
            </CardHeader>
            <CardContent>
              {data.notas && data.notas.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Foram encontradas {data.notas.length} nota(s) fiscal(is)
                    para a viagem informada.
                  </p>
                  <NotaCard />
                  <FormStateLogger />
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  <p>Nenhuma nota fiscal encontrada para esta viagem.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </Form>
      )}
    </div>
  )
}
