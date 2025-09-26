import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/_shared/components/ui/card";
import { Button } from "@/_shared/components/ui/button";
import { BarChart3, Package, Settings } from "lucide-react";

export default function Home() {
  const modules = [
    {
      title: "Produtividade",
      description: "Acompanhe métricas e indicadores de produtividade dos funcionários",
      href: "/produtividade",
      icon: BarChart3,
      color: "bg-blue-500",
    },
    {
      title: "Expedição",
      description: "Gerencie mapas de impressão e processos de expedição",
      href: "/expedicao",
      icon: Package,
      color: "bg-green-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Sistema Logístico
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo ao Sistema
          </h2>
          <p className="text-gray-600 text-lg">
            Gerencie suas operações logísticas de forma eficiente
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((module) => {
            const IconComponent = module.icon;
            return (
              <Link key={module.title} href={module.href}>
                <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
                  <CardHeader className="pb-4">
                    <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900">
                      {module.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {module.description}
                    </CardDescription>
                    <Button 
                      variant="ghost" 
                      className="mt-4 p-0 h-auto text-blue-600 hover:text-blue-800 group-hover:underline"
                    >
                      Acessar módulo →
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
