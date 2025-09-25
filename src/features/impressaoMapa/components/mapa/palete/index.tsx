import {  HeaderPalete } from "./headerPalete"
import { BodyPalete } from "./bodyPalete"
import { ImpressaoMapa } from "../../../types/mapaPicking.type"
import { DefinirConfiguracaoImpressaoDto } from "@/services/api/model"

interface PaleteMapaProps {
  mapa: ImpressaoMapa
  config: DefinirConfiguracaoImpressaoDto | undefined
}

export default function PaleteMapa({ mapa, config }: PaleteMapaProps) {
  return (
    <div>
      <HeaderPalete mapa={mapa} />
      <BodyPalete config={config} itens={mapa.itens} />
    </div>
  )
}