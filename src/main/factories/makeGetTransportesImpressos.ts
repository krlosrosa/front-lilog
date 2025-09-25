import { BuscarTransportesImpressos } from '@/core/transporte/buscarTransportNaoCadastrado.ts/buscarTransportesImpressos';
import { ConvertXlsx } from '@/core/gerarMapa/infra/xlsx/convertXlsxRepository';
import { makeAxiosHttpClient } from './http/axios-http.factory';
import { makeApiUrl } from './http/api-url.factory';

export const makeGetTransportesImpressos = () => {
  const convertXlsx = new ConvertXlsx();
  const httpClient = makeAxiosHttpClient();
  const apiUrl = makeApiUrl('/transporte/get-transportes-by-ids');
  return new BuscarTransportesImpressos(convertXlsx, httpClient, apiUrl);
};
