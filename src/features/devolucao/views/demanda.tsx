'use client'
import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

import { useListarNotasDemanda } from "@/services/api/hooks/devolucao/devolucao";
import type { ListarNotasDemandaResponseZodDto, ListarNotasDemandaResponseZodDtoNotasItem } from "@/services/api/model";

import { Alert, AlertDescription, AlertTitle } from "@/_shared/components/ui/alert";
import { FileText } from "lucide-react";
import { Summary } from "../components/demanda/Resumo";
import { ErrorState } from "../components/errorState";
import { LoadingState } from "../components/loadingState";
import { NotasTable } from "../components/demanda/tabelaNotas";
import { Header } from "../components/header";

export function Demanda() {
  const { id } = useParams();

  const { data, isLoading, error } = useListarNotasDemanda(id as string);

  const notasOrdenadas = useMemo(() => {
    if (!data?.notas) return [] as ListarNotasDemandaResponseZodDtoNotasItem[];
    return [...data.notas].sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());
  }, [data?.notas]);

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState message={error.message} />

  if (!data) {
    return (
      <div className="space-y-4">
        <Header title="Demanda" subtitle={String(id)} />
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertTitle>Nenhum dado</AlertTitle>
          <AlertDescription>Não encontramos informações para esta demanda.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <Header title={`Demanda #${String(id)}`} subtitle="Informações da demanda" />
      {data.placa !== "" ? (
        <>
          <Summary id={id as string} data={data as ListarNotasDemandaResponseZodDto} />
          <NotasTable notas={notasOrdenadas} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <Alert>
            <AlertTitle>Nenhum dado</AlertTitle>
            <AlertDescription>Não encontramos informações para esta demanda.</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
