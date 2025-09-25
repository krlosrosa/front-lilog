import {  HeaderFifo } from "./headerFifo"
import { BodyFifo } from "./bodyFifo"
import { ImpressaoMapa } from "../../../types/mapaPicking.type"
import { DefinirConfiguracaoImpressaoDto } from "@/services/api/model"

interface FifoMapaProps {
  mapa: ImpressaoMapa
  config: DefinirConfiguracaoImpressaoDto | undefined
}

export default function FifoMapa({ mapa, config }: FifoMapaProps) {
  return (
    <div>
      <HeaderFifo mapa={mapa} />
      <BodyFifo config={config} itens={mapa.itens} />
    </div>
  )
}