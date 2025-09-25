'use client';

import { useCenterRedirect } from '../hooks/useCenterRedirect';

interface CenterRedirectHandlerProps {
  children: React.ReactNode;
}

export const CenterRedirectHandler = ({ children }: CenterRedirectHandlerProps) => {
  // Hook gerencia automaticamente o redirecionamento
  useCenterRedirect();

  return <>{children}</>;
};
