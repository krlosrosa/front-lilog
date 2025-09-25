import { useGetInfoDemanda } from "@/services/api/hooks/devolucao/devolucao";
import { Badge } from "@/_shared/components/ui/badge";
import { booleanBadge } from "../../utils/booleanBadge";


export default function ResumoAdicionarNota({ demandaId }: { demandaId: string }) {

  const { data } = useGetInfoDemanda(demandaId);

  if (!data) {
    return null
  }

  return (
    <div className="rounded-lg border bg-card p-3 text-card-foreground">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">Resumo da Demanda</h3>
          <Badge>{data.status}</Badge>
        </div>
        {data.cargaSegregada && (
          <Badge className="bg-red-300 text-black">Carga Segregada</Badge>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <p>
          <span className="font-medium text-card-foreground">Placa:</span>{' '}
          {data.placa}
        </p>
        <p>
          <span className="font-medium text-card-foreground">
            Transportadora:
          </span>{' '}
          {data.transportadora}
        </p>
        <p>
          <span className="font-medium text-card-foreground">Motorista:</span>{' '}
          {data.motorista}
        </p>
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-card-foreground">
            Retorno Palete:
          </span>
          {booleanBadge(data.retornoPalete)}
        </div>
        <p>
          <span className="font-medium text-card-foreground">
            Qtde Paletes:
          </span>{' '}
          {data.quantidadePaletes ?? '-'}
        </p>
      </div>
    </div>
  )
}