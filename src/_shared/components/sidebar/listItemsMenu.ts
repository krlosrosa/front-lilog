import {
  Home,
  Package,
  BarChart3,
  Users,
  MapPin,
  Truck,
  RotateCcw,
  ClipboardList,
  UserCog,
  Settings,
  Building2
} from "lucide-react";

export const navItems: NavItem[] = [
  { label: "Home", icon: Home, href: "/", feature: "Home" },
  {
    label: "Produtividade",
    icon: BarChart3,
    href: "/produtividade",
    feature: "Productivity",
    children: [
      {
        label: "Gestão",
        icon: ClipboardList,
        href: "/produtividade",
        feature: "Productivity"
      },
      {
        label: "Funcionários",
        icon: Users,
        href: "/produtividade/funcionarios",
        feature: "Productivity"
      }
    ]
  },

  {
    label: "Expedição",
    icon: Truck,
    feature: "Expedition",
    children: [
      {
        label: "Gerar Mapa",
        icon: MapPin,
        href: "/expedicao",
        feature: "Expedition"
      },
    ],
  },

  {
    label: "Devoluções",
    icon: RotateCcw,
    feature: "Devolucoes",
    children: [
      {
        label: "Overview",
        icon: Package,
        href: "/devolucao/demanda",
        feature: "Devolucoes"
      },
    ],
  },
  {
    label: "Centros",
    icon: Building2,
    href: "/centro",
    feature: "Centros",
    children: [
      {
        label: "Gestão",
        icon: Building2,
        href: "/centro",
        feature: "Centros"
      },
      {
        label: "Usuários",
        icon: Users,
        href: "/usuario",
        feature: "Centros"
      },
      {
        label: "Configurações",
        icon: Settings,
        href: "/centro/pavuna/configuracao",
        feature: "Centros"
      }
    ]
  }
];