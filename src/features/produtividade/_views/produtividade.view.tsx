'use client'
import { useSearchParams } from 'next/navigation'
import { HeaderDashBoard } from "../_components/header/headerDashBoard";
import { OverView, ListaProdutividade } from "../_components/dashBoard";
import { Filtros } from "../_components/filtros/filtros";
import { LoadingState, ErrorState } from "@/_shared/components/feedbacks";
import { useProdutividade } from "../_hooks/useProdutividade";
import SelecionarInformacoes from "../_components/selecionarData";
import { useState } from "react";

export function ProdutividadeView() {
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(true)
  const segmento = searchParams.get('segmento') || ''
  const empresa = searchParams.get('empresa') || ''
  const { overview, isLoading, error, produtividade } = useProdutividade({
    segmento,
    empresa,
  });


  return (
    <div className="w-full p-4">
      <HeaderDashBoard setOpen={setOpen} />
      <SelecionarInformacoes open={open} setOpen={setOpen} />
      <div>
        {isLoading ? <LoadingState /> : error ? <ErrorState /> : <div>
          <OverView overview={overview} />
          <Filtros />
          <ListaProdutividade produtividade={produtividade} />

        </div>}
      </div>
    </div>
  )
}