import * as Types from '../../types/types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { graphqlRequestFetcher } from '@/services/http/graphq-request.http';
export type ListaPermissoesQueryVariables = Types.Exact<{
  input: Types.AuthorizationModelInput;
}>;


export type ListaPermissoesQuery = { __typename?: 'Query', listarPermissoesParaCasl: Array<{ __typename?: 'AuthorizationModel', userId: string, processo: string, role: string }> };



export const ListaPermissoesDocument = `
    query ListaPermissoes($input: AuthorizationModelInput!) {
  listarPermissoesParaCasl(authorizationModelInput: $input) {
    userId
    processo
    role
  }
}
    `;

export const useListaPermissoesQuery = <
      TData = ListaPermissoesQuery,
      TError = unknown
    >(
      variables: ListaPermissoesQueryVariables,
      options?: Omit<UseQueryOptions<ListaPermissoesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<ListaPermissoesQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<ListaPermissoesQuery, TError, TData>(
      {
    queryKey: ['ListaPermissoes', variables],
    queryFn: graphqlRequestFetcher<ListaPermissoesQuery, ListaPermissoesQueryVariables>(ListaPermissoesDocument, variables),
    ...options
  }
    )};

useListaPermissoesQuery.getKey = (variables: ListaPermissoesQueryVariables) => ['ListaPermissoes', variables];


useListaPermissoesQuery.fetcher = (variables: ListaPermissoesQueryVariables, options?: RequestInit['headers']) => graphqlRequestFetcher<ListaPermissoesQuery, ListaPermissoesQueryVariables>(ListaPermissoesDocument, variables, options);
