export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'AGUARDANDO_LIBERACAO':
      return 'Aguardando Liberação';
    case 'AGUARDANDO_CONFERENCIA':
      return 'Aguardando Conferência';
    case 'EM_CONFERENCIA':
      return 'Em Conferência';
    case 'CONFERENCIA_FINALIZADA':
      return 'Conferência Finalizada';
    case 'FINALIZADO':
      return 'Finalizado';
    case 'CANCELADO':
      return 'Cancelado';
    default:
      return status;
  }
};
