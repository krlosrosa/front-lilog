import { create } from 'zustand';
import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType } from '@casl/ability';
import { persist, createJSONStorage } from 'zustand/middleware';

// As ações permanecem as mesmas
export type Actions = 'manage' | 'read' | 'update' | 'delete';

// +++ CORREÇÃO: Definir uma interface base para subjects com condições +++
// Isso informa ao TypeScript que qualquer subject que use condições baseadas em centerId
// terá esta propriedade.
interface ISubjectWithCenter {
  centerId: string;
}

// 1. Tornamos 'Subjects' mais flexível.
// Ele agora pode ser 'all', uma string genérica, ou um objeto que corresponda à nossa interface.
// Isso resolve o erro de tipagem no método `can`.
export type Subjects = 'all' | string | ISubjectWithCenter;

// Para melhor type-safety com o CASL
export type AppAbility = Ability<[Actions, Subjects]>;

// As interfaces não mudam
export interface User {
  name: string
  email: string
  accessToken: string
  permissions: Permission[]
}

export interface Permission {
  centerId: string
  role: string
  processo: string
}

interface AuthState {
  user: User | null;
  centerId: string;
  hasMoreThanOneCenter: boolean;
  needsCenterSelection: boolean;
  availableCenters: Permission[];
  ability: AppAbility;
  login: (user: User) => void;
  logout: () => void;
  setCenterId: (centerId: string) => void;
  selectCenter: (centerId: string) => void;
  resetAll: () => void;
}

const emptyAbility = new Ability<[Actions, Subjects]>([]);

export const useAuthStore = create<AuthState>()(persist((set) => ({
  user: null,
  centerId: 'pavuna',
  hasMoreThanOneCenter: false,
  needsCenterSelection: false,
  availableCenters: [],
  ability: emptyAbility,
  setCenterId: (centerId: string) => {
    
  },
  selectCenter: (centerId: string) => {
    console.log('🎯 Store - Selecionando centro:', centerId);
    set({ 
      centerId, 
      needsCenterSelection: false,
      hasMoreThanOneCenter: false 
    });
    console.log('🎯 Store - Centro selecionado com sucesso');
  },
  logout: () => {
    set({ 
      user: null, 
      ability: emptyAbility, 
      needsCenterSelection: false,
      hasMoreThanOneCenter: false,
      availableCenters: []
    });
  },
  resetAll: () => {
    set({ 
      user: null, 
      ability: emptyAbility, 
      needsCenterSelection: false,
      hasMoreThanOneCenter: false,
      availableCenters: []
    });
  },
  login: (user: User) => {
    console.log('🔐 Store - Login iniciado com usuário:', user);
    
    // --- CORREÇÃO 1: Desestruturar 'build' em vez de 'rules' ---
    const { can, build } = new AbilityBuilder<AppAbility>(Ability as AbilityClass<AppAbility>);

    // Filtrar centros onde o usuário tem permissão de ADMIN ou MASTER
    const centros = user.permissions.filter((permission) => 
      permission.role === 'MASTER' || permission.role === 'ADMIN'
    );

    console.log('🔐 Store - Centros filtrados:', centros);

    // Determinar estado de seleção de centro
    let centerState;
    if (centros.length === 0) {
      // Usuário sem permissões de centro
      centerState = {
        needsCenterSelection: false,
        hasMoreThanOneCenter: false,
        centerId: 'pavuna' 
      };
      console.log('🔐 Store - Sem centros disponíveis');
    } else if (centros.length === 1) {
      // Apenas um centro - seleção automática
      centerState = {
        centerId: centros[0].centerId,
        needsCenterSelection: false,
        hasMoreThanOneCenter: false 
      };
      console.log('🔐 Store - Centro selecionado automaticamente:', centros[0].centerId);
    } else {
      // Múltiplos centros - precisa selecionar
      centerState = {
        needsCenterSelection: true,
        hasMoreThanOneCenter: true,
        centerId: 'pavuna' 
      };
      console.log('🔐 Store - Múltiplos centros - precisa selecionar');
    }

    // Fazer uma única chamada set() com todos os estados
    set({ 
      availableCenters: centros,
      ...centerState
    });
    
    console.log('🔐 Store - Estado final definido:', { 
      availableCenters: centros, 
      ...centerState 
    });

    // 2. Primeiro, tratamos os casos de maior privilégio ('MASTER' e 'ADMIN')
    // Se o usuário tiver a role 'MASTER' ou 'ADMIN' em QUALQUER permissão, ele pode tudo.
    if (user.permissions.some(permission => permission.role === 'MASTER' || permission.role === 'ADMIN')) {
      can('manage', 'all');
    } else {
      // 3. Se não for admin/master, processamos cada permissão individualmente
      user.permissions.forEach(permission => {
        // Usamos um switch para "traduzir" a role do seu Enum para ações do CASL
        switch (permission.role) {
          case 'FUNCIONARIO':
            // Estas chamadas agora são válidas por causa da correção nos tipos
            can('read', permission.processo, { centerId: permission.centerId });
            can('update', permission.processo, { centerId: permission.centerId });
            break;

          case 'USER':
            can('update', permission.processo, { centerId: permission.centerId });
            can('read', permission.processo, { centerId: permission.centerId });
            break;

          // Adicione outros casos conforme necessário
          // default:
          //   console.warn(`Role desconhecida: ${permission.role}`);
        }
      });
    }

    // --- CORREÇÃO 2: Usar o método 'build()' para criar a instância ---
    const ability = build();
    set({ user, ability });
  },
}),
  {
    name: 'auth-store',
    storage: createJSONStorage(() => localStorage),
  }
));

