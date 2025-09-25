import { ConvertXlsx } from "@/_core/gerarMapa/infra/convertXlsxRepository";
import { ShipmentPickingMapItem } from "@/_core/gerarMapa/types/pickingMap";
import { removeDuplicadosPorId } from "../utils/removeDuplicatas";

export async function listarTransportes(shipments: File): Promise<string[]> {
  const fileConverter = new ConvertXlsx();
  const shipmentsConverted = await fileConverter.convertShipment(shipments);
  const transportes = removeDuplicadosPorId(shipmentsConverted);
  const transportesIds = transportes.map((transporte) => transporte.transportId);
  return transportesIds ;
}
