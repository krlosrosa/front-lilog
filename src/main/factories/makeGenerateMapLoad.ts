import { GerarMapa } from '@/core/gerarMapa/mapaSeparacao';
import { ConvertXlsx } from '@/core/gerarMapa/infra/xlsx/convertXlsxRepository';

export const makeGenerateMapPicking = () => {
  const convertXlsx = new ConvertXlsx();
  return new GerarMapa(convertXlsx);
};
