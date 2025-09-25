import type {
  ProductsPickingMapItem,
  RoutingPickingMapItem,
  ShipmentPickingMapItem,
} from '@/_core/gerarMapa/types/pickingMap';

export interface RemoteConverterXlsx {
  convertRouting(params: File): Promise<RoutingPickingMapItem[]>;
  convertShipment(params: File): Promise<ShipmentPickingMapItem[]>;
  convertProducts(params: File): Promise<ProductsPickingMapItem[]>;
}
