import { BuscarTransportesNaoCadastrados } from '@/core/transporte/buscarTransportNaoCadastrado.ts/buscarTransportesNaoCadastrados';
import { ConvertXlsx } from '@/core/gerarMapa/infra/xlsx/convertXlsxRepository';
import { makeAxiosHttpClient } from './http/axios-http.factory';
import { makeApiUrl } from './http/api-url.factory';

export const makeGetTransportesNaoCadastrados = () => {
  const convertXlsx = new ConvertXlsx();
  const httpClient = makeAxiosHttpClient();
  const apiUrl = makeApiUrl('/transporte/listar-nao-cadastrados');
  return new BuscarTransportesNaoCadastrados(convertXlsx, httpClient, apiUrl);
};
