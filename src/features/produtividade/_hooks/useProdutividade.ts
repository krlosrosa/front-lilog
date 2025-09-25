import { useGetOverViewQuery } from "@/services/graphql/produtividade/getOverView.graphql";
import { useDefinicaoStore } from "../stores/definicao.store";
import { useAuthStore } from "@/_shared/stores/auth.store";
import { startOfDay, format } from "date-fns";

export const useProdutividade = ({ segmento, empresa }: { segmento: string, empresa: string }) => {
  const { centerId } = useAuthStore()
  const { dataTrabalho, processo } = useDefinicaoStore()

  const hoje = new Date()
  const data = format((dataTrabalho || hoje), 'yyyy-MM-dd')

  const { data: overview, isLoading, error } = useGetOverViewQuery({
    inputOverview: {
      centerId: centerId || '',
      data: data,
      processo: processo || '',
      segmento: segmento || '',
    },
    inputProdutividade: {
      centerId: centerId || '',
      processo: processo || '',
      data: data,
      segmento: segmento || '',
      empresa: empresa || '',
      paginacao: {
        page: '1',
        limit: '10'
      }
    }
  }, {
    enabled: !!processo && !!centerId,
  });

  return { 
    overview: overview?.overViewProdutividade, 
    produtividade: overview?.produtividade,
    isLoading, 
    error 
  }
}