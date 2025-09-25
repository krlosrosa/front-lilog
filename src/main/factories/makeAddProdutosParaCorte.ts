import { AddItensControleCorte } from '@/core/transporte/addItensControleCorte';
import { ConvertXlsx } from '@/core/gerarMapa/infra/xlsx/convertXlsxRepository';
import { makeAxiosHttpClient } from './http/axios-http.factory';
import { makeApiUrl } from './http/api-url.factory';

export const makeAddProdutosParaCorte = () => {
  const convertXlsx = new ConvertXlsx();
  const httpClient = makeAxiosHttpClient();
  const apiUrl = makeApiUrl('/transporte/guardar-intes-separacao');
  return new AddItensControleCorte(convertXlsx, httpClient, apiUrl);
};
