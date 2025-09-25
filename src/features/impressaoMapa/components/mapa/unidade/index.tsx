import { HeaderUnidade } from "./headerUnidade"
import { BodyUnidade } from "./bodyUnidade"
import { ImpressaoMapa } from "../../../types/mapaPicking.type"
import { DefinirConfiguracaoImpressaoDto } from "@/services/api/model"

interface UnidadeMapaProps {
  mapa: ImpressaoMapa
  config: DefinirConfiguracaoImpressaoDto | undefined
}

export default function UnidadeMapa({ mapa, config }: UnidadeMapaProps) {
  return (
    <div>
      <HeaderUnidade mapa={mapa} />
      <BodyUnidade config={config} itens={mapa.itens} />
    </div>
  )
}