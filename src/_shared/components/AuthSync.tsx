'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useAuthStore, User } from '../stores/auth.store';
import { useRouter } from 'next/navigation';
import { useMinhaInfo } from '@/services/api/hooks/usuario/usuario';

export function AuthSync() {
  const { data: session, status } = useSession();
  const { login, centerId, logout, user: authUser, needsCenterSelection, selectCenter } = useAuthStore();
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const router = useRouter();
  const { data: minhaInfo } = useMinhaInfo();

  // Função para buscar permissões do usuário
  const fetchUserPermissions = async (accessToken: string) => {
    try {
      setIsLoadingPermissions(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_INTERNAL}/usuario/minha-info`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.ok) {
        const userProfile = await response.json();
        // Transformar os dados da API para o formato esperado pelo store
        const permissions = (userProfile.listCenterRole || []).map((item: any) => ({
          centerId: item.centerId,
          processo: item.processo,
          role: item.role
        }));
        
        console.log('Permissões carregadas:', { userProfile, permissions });
        return permissions;
      } else {
        console.warn('Falha ao carregar permissões do usuário:', response.status);
        return [];
      }
    } catch (error) {
      console.error('Erro ao buscar permissões do usuário:', error);
      return [];
    } finally {
      setIsLoadingPermissions(false);
    }
  };

  useEffect(() => { 
    if (status === 'authenticated') {
      if (!authUser || authUser.email !== session.user.email) {
        // Buscar permissões de forma assíncrona e fazer login apenas uma vez
        if (session.user.accessToken) {
          fetchUserPermissions(session.user.accessToken).then(permissions => {
            // Criar usuário com permissões carregadas
            const userWithPermissions: User = {
              name: session.user.name || '',
              email: session.user.email || '',
              accessToken: session.user.accessToken || '',
              permissions
            };
            console.log('🔐 AuthSync - Fazendo login com permissões:', permissions);
            login(userWithPermissions);
          });
        }
      }
    } else if (status === 'unauthenticated') {
      if (authUser) {
        logout();
      }
    }
  }, [status, session, login, logout, authUser]);

  // Debug logs
  if (isLoadingPermissions) {
    console.log('Carregando permissões do usuário...');
  }
  
  if (needsCenterSelection) {
    console.log('Usuário precisa selecionar um centro');
  }

  return null;
}