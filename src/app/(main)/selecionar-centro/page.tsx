'use client';

import { Button } from "@/_shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/_shared/components/ui/card";
import { Badge } from "@/_shared/components/ui/badge";
import { useAuthStore } from "@/_shared/stores/auth.store";
import { useMinhaInfo } from "@/services/api/hooks/usuario/usuario";
import { Building2, CheckCircle, ArrowRight, User } from "lucide-react";
import { Header } from "@/features/devolucao/components/header";

export default function SelecionarCentro() {
  const { centerId, selectCenter, user } = useAuthStore();
  const { data: minhaInfo, isLoading } = useMinhaInfo();

  const handleSelectCenter = (centerId: string) => {
    console.log('🎯 Selecionando centro:', centerId);
    selectCenter(centerId);
    console.log('✅ Centro selecionado, redirecionando...');
    // Redirecionar para a página principal após seleção
    window.location.href = '/';
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'MASTER':
        return 'Master';
      case 'ADMIN':
        return 'Administrador';
      case 'USER':
        return 'Usuário';
      default:
        return role;
    }
  };

  const getRoleVariant = (role: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (role) {
      case 'MASTER':
        return 'destructive';
      case 'ADMIN':
        return 'default';
      case 'USER':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Carregando centros disponíveis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <pre>{JSON.stringify(minhaInfo, null, 2)} opsms</pre>
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header Section */}
        <div className="space-y-2 mb-8">
          <Header 
            title="Selecionar Centro de Gestão" 
            subtitle="Escolha o centro de distribuição onde você deseja realizar a gestão" 
          />
        </div>

        {/* User Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações do Usuário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Centers Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {minhaInfo?.listCenterRole?.map((permission) => (
            <Card 
              key={permission.centerId} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                centerId === permission.centerId 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleSelectCenter(permission.centerId)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{permission.centerId}</CardTitle>
                      <CardDescription className="text-sm">
                        Centro de Distribuição
                      </CardDescription>
                    </div>
                  </div>
                  {centerId === permission.centerId && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Permissão:</span>
                    <Badge variant={getRoleVariant(permission.role)}>
                      {getRoleLabel(permission.role)}
                    </Badge>
                  </div>
                  
                  {permission.processo && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Processo:</span>
                      <span className="text-sm font-medium">{permission.processo}</span>
                    </div>
                  )}

                  <Button 
                    className="w-full" 
                    variant={centerId === permission.centerId ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCenter(permission.centerId);
                    }}
                  >
                    {centerId === permission.centerId ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Centro Selecionado
                      </>
                    ) : (
                      <>
                        Selecionar Centro
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {(!minhaInfo?.listCenterRole || minhaInfo.listCenterRole.length === 0) && (
          <Card className="text-center py-12">
            <CardContent>
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum Centro Disponível</h3>
              <p className="text-muted-foreground mb-4">
                Você não possui permissões para gerenciar nenhum centro de distribuição.
              </p>
              <p className="text-sm text-muted-foreground">
                Entre em contato com o administrador do sistema para obter as permissões necessárias.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Selected Center Info */}
        {centerId && (
          <Card className="mt-6 bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Centro selecionado: {centerId}</p>
                  <p className="text-sm text-muted-foreground">
                    Você pode começar a gerenciar este centro agora.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}