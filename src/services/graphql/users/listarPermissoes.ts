import { gql } from 'graphql-request';

export const LISTAR_PERMISSOES = gql`
query ListaPermissoes($input: AuthorizationModelInput!){
  listarPermissoesParaCasl(authorizationModelInput: $input ) {
    userId
    processo
    role
  }
}
`;