import { ConvertXlsx } from "@/_core/gerarMapa/infra/convertXlsxRepository";
import { distribuirPaletePorTipo } from "@/_core/gerarMapa/pipeline/07-agruparPaletePorTipo";
import { classificarPorCampos } from "@/_core/gerarMapa/pipeline/08-classificarItens";
import { splitPalete } from "@/_core/gerarMapa/pipeline/09-splitPalete";
import { enriquecerItems } from "@/_core/gerarMapa/pipeline/1-enriquecerItems";
import { gerarMapa } from "@/_core/gerarMapa/pipeline/11-gerarMapa";
import { transformarQuantidadeEmUnidade } from "@/_core/gerarMapa/pipeline/2-transformarQuantidadeEmUnidade";
import { definirFaixaERange } from "@/_core/gerarMapa/pipeline/3-definicaoFaixaShelf";
import { gerarGrupos } from "@/_core/gerarMapa/pipeline/4-gerarGrupos";
import { agruparESomar } from "@/_core/gerarMapa/pipeline/5-agruparESomar";
import { alocarCaixasEPaletes } from "@/_core/gerarMapa/pipeline/6-alocarCaixasEPaletes";
import { FilesState } from "../types/inputFiles.type";
import { ConfiguracaoImpressao } from "../types/configuracaoImpressao.type";
import { ImpressaoMapa } from "../types/mapaPicking.type";
import { Groups } from "@/_core/gerarMapa/types/groups.type";
import { splitUnidade } from "@/_core/gerarMapa/pipeline/10-splitUnidade";
import { separarItensFifo } from "@/_core/gerarMapa/pipeline/11-separarItensFifo";


export async function gerarMapaSeparacao(
  input: FilesState,
  config: ConfiguracaoImpressao,
  segregarClientes?: string[],
  agruparClientes?: Groups[],
  agruparTransportes?: Groups[],
  agruparRemessas?: Groups[],
): Promise<ImpressaoMapa[]> {
  const fileConverter = new ConvertXlsx();
  const [shipments, products, routingPlans] = await Promise.all([
    input.shipments
      ? fileConverter.convertShipment(input.shipments)
      : Promise.resolve([]),
    input.products
      ? fileConverter.convertProducts(input.products)
      : Promise.resolve([]),
    input.routes
      ? fileConverter.convertRouting(input.routes)
      : Promise.resolve([]),
  ]);

  if (!shipments) {
    throw new Error('Não foi possível enriquecer os itens');
  }

  console.log({shipments, products, routingPlans});

  const enrichedShipments = enriquecerItems(
    shipments,
    routingPlans,
    products,
  );
  console.log({enrichedShipments});
  const transformQuantities =
    transformarQuantidadeEmUnidade(enrichedShipments);
  const enrichedShipmentsWithFaixa = definirFaixaERange(
    transformQuantities,
    config.dataMaximaPercentual || 0,
  );
  const enrichedShipmentsWithGrupos = gerarGrupos(
    enrichedShipmentsWithFaixa,
    config.tipoImpressao,
    segregarClientes,
    agruparClientes,
    agruparTransportes,
    agruparRemessas,
  );
  const enrichedShipmentsWithGruposESomar = agruparESomar(
    enrichedShipmentsWithGrupos,
  );
  const enrichedShipmentsWithCaixasEPaletes = alocarCaixasEPaletes(
    enrichedShipmentsWithGruposESomar,
  );

  const enrichedShipmentsWithCaixasEPaletesClassificadoSplitPalete = splitPalete({ items: enrichedShipmentsWithCaixasEPaletes, splitPalete: config.separarPaleteFull, splitUnidade: config.separarUnidades });

  
  const enrichedShipmentsWithFifo = separarItensFifo(enrichedShipmentsWithCaixasEPaletesClassificadoSplitPalete, config.segregarFifo);

  const enrichedShipmentsWithCaixasEPaletesClassificado =
    classificarPorCampos(
      enrichedShipmentsWithFifo,
      ['id', 'produto.segmento', 'tipo', 'produto.pickWay'],
    );

  const enrichedShipmentsWithDistribuicao = distribuirPaletePorTipo({
    lista: enrichedShipmentsWithCaixasEPaletesClassificado,
    tipo: config.tipoQuebra,
    quantidade: config.valorQuebra ?? 0,
  });
  const mapas = gerarMapa(enrichedShipmentsWithDistribuicao);
  console.log({mapas});

  return mapas;

}