import { GerarMinutaCarregamento } from '@/core/gerarMapa/minutaCarregamento';
import { ConvertXlsx } from '@/core/gerarMapa/infra/xlsx/convertXlsxRepository';

export const makeGenerateMinutaCarregamento = () => {
  const convertXlsx = new ConvertXlsx();
  return new GerarMinutaCarregamento(convertXlsx);
};
