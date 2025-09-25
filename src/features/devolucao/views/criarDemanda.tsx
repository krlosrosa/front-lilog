'use client'
import z from "zod";
import { useState } from "react";
import { useAdicionarNovaDemandaViaRavex, useGetInfoByViagemIdRavex } from "@/services/api/hooks/devolucao/devolucao";
import { ViagemHeader } from "../components/criarDemanda/viagemHeader";
import { NotaCard } from "../components/criarDemanda/notaCard";
import { getInfoByViagemIdRavexResponse } from "@/services/api/schema/devolucao/devolucao.zod";
import { Form } from "@/_shared/components/hookForms/Form";
import { FormStateLogger } from "../../../_shared/components/hookForms/formState.errors";
import { createMutationOptions } from "@/_shared/lib/mutationOptions";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/_shared/stores/auth.store";
import { toast } from "react-toastify";
import { BuscaRavex } from "../components/buscaRavex";
import { Header } from "../components/header";
import { ErrorState } from "../components/errorState";


type GetInfoByViagemIdRavexParams = z.infer<typeof getInfoByViagemIdRavexResponse>;

export function CriarDemanda() {
  const router = useRouter();
  const { centerId } = useAuthStore();
  const [viagemId, setViagemId] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const { data, isLoading, error, refetch } = useGetInfoByViagemIdRavex(viagemId, {
    query: {
      enabled: false, // desativa a busca automática
    },
  });

  const { mutate: adicionarNovaDemandaViaRavex, isPending } = useAdicionarNovaDemandaViaRavex(
    createMutationOptions({
      onSuccessCallback: (data, variables, context) => {
        toast.success('Demanda adicionada com sucesso');
        router.push(`/devolucao/demanda/${data}`);
      },
      onErrorCallback(error, variables, context) {
        toast.error(error.message);
      },
    })
  );

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

  const onSubmit = (data: GetInfoByViagemIdRavexParams) => {
    adicionarNovaDemandaViaRavex({
      centerId: centerId ?? '',
      data: data,
    });
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="space-y-4 p-4 w-full max-w-full">
        <Header
          title="Criar Nova Demanda"
          subtitle="Busque informações da viagem Ravex para criar uma nova demanda de devolução"
        />
        <BuscaRavex
          viagemId={viagemId}
          setViagemId={setViagemId}
          handleKeyPress={handleKeyPress}
          handleBuscar={handleBuscar}
          isLoading={isLoading}
          isPending={isPending}
        />

        {isLoading && (<div>Loading</div>)}
        {error && hasSearched && (<ErrorState message={error.message} />)}

        {data && hasSearched && !isLoading && (
          <div className="w-full max-w-full overflow-x-hidden">
            <Form
              schema={getInfoByViagemIdRavexResponse} onSubmit={onSubmit}
              formOptions={{ defaultValues: data }}
              id="criar-demanda-form"
            >
              <div className="w-full max-w-full overflow-x-hidden space-y-4">
                <ViagemHeader/>
                <NotaCard /> 
                <FormStateLogger />
              </div>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
}
