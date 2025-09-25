import { enriquecerItems } from '@/_core/gerarMapa/pipeline/1-enriquecerItems';
import { transformarQuantidadeEmUnidade } from '../pipeline/2-transformarQuantidadeEmUnidade';
import { definirFaixaERange } from '../pipeline/3-definicaoFaixaShelf';
import { gerarGrupos } from '../pipeline/4-gerarGrupos';
import { agruparESomar } from '../pipeline/5-agruparESomar';
import { alocarCaixasEPaletes } from '../pipeline/6-alocarCaixasEPaletes';
import { distribuirPaletePorTipo } from '../pipeline/07-agruparPaletePorTipo';
import type { EnrichedPickingMapItem, ImpressaoMapa } from '../types/pickingMap';
import { classificarPorCampos } from '../pipeline/08-classificarItens';
import { splitPalete } from '../pipeline/09-splitPalete';
import { splitUnidade } from '../pipeline/10-splitUnidade';
import { gerarMapa } from '../pipeline/11-gerarMapa';
import { ConvertXlsx } from '../infra/convertXlsxRepository';

export interface FilesState {
  shipments: File | null;
  products: File | null;
  routes?: File | null;
}

export interface ConfiguracaoImpressao {
  tipo: 'TRANSPORTE' | 'CLIENTE';
  percentMax: number;
}

export class GerarMapa {
  constructor(
    private readonly fileConverter: ConvertXlsx) {}
  async execute(
    input: FilesState,
    config: ConfiguracaoImpressao,
    segregarClientes?: string[],
  ): Promise<ImpressaoMapa[]> {
    const [shipments, products, routingPlans] = await Promise.all([
      input.shipments
        ? this.fileConverter.convertShipment(input.shipments)
        : Promise.resolve([]),
      input.products
        ? this.fileConverter.convertProducts(input.products)
        : Promise.resolve([]),
      input.routes
        ? this.fileConverter.convertRouting(input.routes)
        : Promise.resolve([]),
    ]);

    if (!shipments) {
      throw new Error('Não foi possível enriquecer os itens');
    }

    // Enriquecer itens
    const enrichedShipments = enriquecerItems(
      shipments,
      routingPlans,
      products,
    );
    // Transformar quantidades em Unidade
    const transformQuantities =
      transformarQuantidadeEmUnidade(enrichedShipments);
    // Definir faixa e range
    const enrichedShipmentsWithFaixa = definirFaixaERange(
      transformQuantities,
      config.percentMax,
    );
    // Agrupar conforme parametrizacao
    const enrichedShipmentsWithGrupos = gerarGrupos(
      enrichedShipmentsWithFaixa,
      config.tipo,
      segregarClientes,
    );

    console.log({enrichedShipmentsWithGrupos});
    // Agrupar e somar
    const enrichedShipmentsWithGruposESomar = agruparESomar(
      enrichedShipmentsWithGrupos,
    );
    // Alocar caixas e paletes
    const enrichedShipmentsWithCaixasEPaletes = alocarCaixasEPaletes(
      enrichedShipmentsWithGruposESomar,
    );
    // Split unidade
    //const enrichedShipmentsWithCaixasEPaletesClassificadoSplitUnidade = splitUnidade(enrichedShipmentsWithCaixasEPaletes);
    // Split palete
    const enrichedShipmentsWithCaixasEPaletesClassificadoSplitPalete =
      splitPalete(enrichedShipmentsWithCaixasEPaletes);
    // Classificar por tipo
    const enrichedShipmentsWithCaixasEPaletesClassificado =
      classificarPorCampos(
        enrichedShipmentsWithCaixasEPaletesClassificadoSplitPalete,
        ['id', 'produto.segmento', 'tipo', 'produto.pickWay'],
      );
    // Distribuir por limite percentual
    const enrichedShipmentsWithDistribuicao = distribuirPaletePorTipo(
      enrichedShipmentsWithCaixasEPaletesClassificado,
    );
    // Gerar mapas
    const mapas = gerarMapa(enrichedShipmentsWithDistribuicao);

    return mapas;
  }
}
