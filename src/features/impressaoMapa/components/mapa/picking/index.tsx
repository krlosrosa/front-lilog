import { HeaderPicking } from "./headerPicking"
import { BodyPicking } from "./bodyPicking"
import { ImpressaoMapa } from "../../../types/mapaPicking.type"
import { DefinirConfiguracaoImpressaoDto } from "@/services/api/model"

interface PickingMapaProps {
  mapa: ImpressaoMapa
  config: DefinirConfiguracaoImpressaoDto | undefined
}

export default function PickingMapa({ mapa, config }: PickingMapaProps) {
  return (
    <div>
      <HeaderPicking tipo={config?.tipoImpressao} exibirCliente={config?.exibirInfoCabecalho} mapa={mapa} />
      <BodyPicking transporteId={mapa.transportId} config={config} itens={mapa.itens} />
    </div>
  )
}