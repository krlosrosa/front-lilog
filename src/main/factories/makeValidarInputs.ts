import { ConvertXlsx } from '@/core/gerarMapa/infra/xlsx/convertXlsxRepository';
import { VerificarAnomalia } from '@/core/gerarMapa/verificarAnomalia';

export const makeValidarInputs = () => {
  const convertXlsx = new ConvertXlsx();
  return new VerificarAnomalia(convertXlsx);
};
