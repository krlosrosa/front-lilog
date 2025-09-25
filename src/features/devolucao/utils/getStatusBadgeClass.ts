export const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'AGUARDANDO_LIBERACAO':
      return 'bg-yellow-600 text-white border-0';
    case 'AGUARDANDO_CONFERENCIA':
      return 'bg-blue-600 text-white border-0';
    case 'EM_CONFERENCIA':
      return 'bg-purple-600 text-white border-0';
    case 'CONFERENCIA_FINALIZADA':
      return 'bg-green-600 text-white border-0';
    case 'FINALIZADO':
      return 'bg-emerald-600 text-white border-0';
    case 'CANCELADO':
      return 'bg-red-600 text-white border-0';
    default:
      return 'bg-gray-600 text-white border-0';
  }
};