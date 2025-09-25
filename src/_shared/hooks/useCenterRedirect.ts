'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../stores/auth.store';

export const useCenterRedirect = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { needsCenterSelection, hasMoreThanOneCenter, availableCenters, centerId } = useAuthStore();

  useEffect(() => {
    // Só redireciona se não estiver na página de seleção de centro
    if (pathname !== '/selecionar-centro') {
      // Se usuário precisa selecionar centro E tem múltiplos centros
      if (needsCenterSelection && hasMoreThanOneCenter && availableCenters.length > 1) {
        console.log('Redirecionando para seleção de centro...', {
          needsCenterSelection,
          hasMoreThanOneCenter,
          availableCenters: availableCenters.length,
          centerId
        });
        router.push('/selecionar-centro');
      }
    }
  }, [needsCenterSelection, hasMoreThanOneCenter, availableCenters.length, centerId, pathname, router]);

  return {
    needsCenterSelection,
    hasMoreThanOneCenter,
    availableCenters,
    centerId
  };
};
