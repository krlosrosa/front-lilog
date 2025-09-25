export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import { ProdutividadeView } from "@/features/produtividade/_views/produtividade.view";

export default function ProdutividadePage() {
  return (
    <Suspense fallback={<div className="p-4">Carregando...</div>}>
      <div className="w-full">
        < ProdutividadeView />
      </div>
    </Suspense>
  )
}