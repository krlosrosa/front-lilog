import { enriquecerItems } from '@/_core/gerarMapa/pipeline/1-enriquecerItems';
import { transformarQuantidadeEmUnidade } from '../pipeline/2-transformarQuantidadeEmUnidade';
import { gerarGrupos } from '../pipeline/4-gerarGrupos';
import { agruparESomar } from '../pipeline/5-agruparESomar';
import { alocarCaixasEPaletes } from '../pipeline/6-alocarCaixasEPaletes';
import type {
  ImpressaoMinutaCarregamento,
} from '../types/pickingMap';
import { gerarMinuta } from '../pipeline/12-gerarMinuta';
import { agruparESomarMinuta } from '../pipeline/5-agruparESomarMinuta';
import { ConvertXlsx } from '../infra/convertXlsxRepository';

export interface FilesState {
  shipments: File | null;
  products: File | null;
  routes?: File | null;
}

export class GerarMinutaCarregamento {
  constructor(private readonly fileConverter: ConvertXlsx) {}
  async execute(input: FilesState): Promise<ImpressaoMinutaCarregamento[]> {
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
    const enrichedShipmentsWithGrupos = gerarGrupos(
      transformQuantities,
      'TRANSPORTE',
    );
    // Agrupar e somar
    const enrichedShipmentsWithGruposESomar = agruparESomar(
      enrichedShipmentsWithGrupos,
    );
    // Alocar caixas e paletes
    const enrichedShipmentsWithCaixasEPaletes = alocarCaixasEPaletes(
      enrichedShipmentsWithGruposESomar,
    );
    // Agrupar e somar minuta
    const enrichedShipmentsWithGruposESomarMinuta = agruparESomarMinuta(
      enrichedShipmentsWithCaixasEPaletes,
    );
    // Gerar mapas
    const mapas = gerarMinuta(enrichedShipmentsWithGruposESomarMinuta);

    return mapas;
  }
}
