import z from "zod";
import { buscarConfiguracoesImpressaoResponse } from "@/services/api/schema/centro/centro.zod";

export type ConfiguracaoImpressao = z.infer<
  typeof buscarConfiguracoesImpressaoResponse
>