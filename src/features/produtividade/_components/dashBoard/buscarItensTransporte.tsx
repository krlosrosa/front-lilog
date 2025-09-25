"use client"
import { useState } from "react";
import { EditarItemModal } from "../actions";
import { Package, Search, AlertCircle, Edit, Scissors, ArrowRight } from "lucide-react";
import { Badge } from "@/_shared/components/ui/badge";
import { Button } from "@/_shared/components/ui/button";
import { Input } from "@/_shared/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/_shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/_shared/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/_shared/components/ui/tabs";
import { useTransporteControllerBuscarItensPorTransporte } from "@/services/api/hooks/transporte/transporte";

interface ItemSelecionado {
  codItem: string;
  lote: string;
  descricao: string;
  quantidade: number;
  motivo: string;
}

export function BuscarItensTransporte() {
  const [numeroTransporte, setNumeroTransporte] = useState('');
  const [transporteBusca, setTransporteBusca] = useState('');
  const { data, isLoading, error } = useTransporteControllerBuscarItensPorTransporte(
    transporteBusca,
    { query: { enabled: !!transporteBusca } }
  );
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [itensSelecionados, setItensSelecionados] = useState<ItemSelecionado[]>([]);
  const [activeTab, setActiveTab] = useState("itens");

  const handleEditItem = (item: any) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleSaveItem = (itemData: { quantidade: number; motivo: string }) => {
    const novoItem: ItemSelecionado = {
      codItem: selectedItem.codItem,
      lote: selectedItem.lote,
      descricao: selectedItem.descricao,
      quantidade: itemData.quantidade,
      motivo: itemData.motivo
    };

    // Verifica se o item já existe na lista
    const itemExistente = itensSelecionados.findIndex(
      item => item.codItem === novoItem.codItem && item.lote === novoItem.lote
    );

    if (itemExistente >= 0) {
      // Atualiza item existente
      const novosItens = [...itensSelecionados];
      novosItens[itemExistente] = novoItem;
      setItensSelecionados(novosItens);
    } else {
      // Adiciona novo item
      setItensSelecionados([...itensSelecionados, novoItem]);
    }

    setModalOpen(false);
    setSelectedItem(null);
  };

  const isItemSelected = (codItem: string, lote: string) => {
    return itensSelecionados.some(item => item.codItem === codItem && item.lote === lote);
  };

  const handleGoToCortes = () => {
    setActiveTab("cortes");
  };

  const handleEfetuarCorte = () => {
    // Aqui você pode implementar a lógica de envio para a API
    console.log('Efetuando corte dos itens:', itensSelecionados);
    alert(`Corte efetuado com sucesso! ${itensSelecionados.length} itens processados.`);
    // Opcionalmente limpar a lista após o corte
    // setItensSelecionados([]);
  };

  const handleRemoverItem = (codItem: string, lote: string) => {
    setItensSelecionados(prev =>
      prev.filter(item => !(item.codItem === codItem && item.lote === lote))
    );
  };

  const handleBuscarTransporte = () => {
    if (numeroTransporte.trim()) {
      setTransporteBusca(numeroTransporte.trim());
      // Limpar itens selecionados ao buscar novo transporte
      setItensSelecionados([]);
      // Voltar para a tab de itens
      setActiveTab("itens");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBuscarTransporte();
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Itens do Transporte #52667494
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Carregando itens do transporte...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Itens do Transporte #52667494
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
              <p className="text-destructive font-medium">Erro ao buscar itens do transporte</p>
              <p className="text-muted-foreground text-sm">Tente novamente mais tarde</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Campo de Busca do Transporte */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Buscar Itens do Transporte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Digite o número do transporte..."
                value={numeroTransporte}
                onChange={(e) => setNumeroTransporte(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-base"
              />
            </div>
            <Button
              onClick={handleBuscarTransporte}
              disabled={!numeroTransporte.trim() || isLoading}
              className="gap-2 min-w-[120px]"
            >
              <Search className="w-4 h-4" />
              {isLoading ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>
          {transporteBusca && (
            <div className="mt-3 text-sm text-muted-foreground">
              Exibindo resultados para transporte: <span className="font-mono font-medium">{transporteBusca}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs só aparecem quando há uma busca */}
      {transporteBusca && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="itens" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Itens do Transporte
              {data && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {data.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="cortes" className="flex items-center gap-2">
              <Scissors className="w-4 h-4" />
              Cortes
              {itensSelecionados.length > 0 && (
                <Badge variant="default" className="ml-2 text-xs">
                  {itensSelecionados.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="itens" className="mt-6">
            <Card className="w-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Itens do Transporte #{transporteBusca}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-sm">
                      {data?.length || 0} itens
                    </Badge>
                    {itensSelecionados.length > 0 && (
                      <Button onClick={handleGoToCortes} size="sm" className="gap-2">
                        <ArrowRight className="w-4 h-4" />
                        Ir para Cortes ({itensSelecionados.length})
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!data || data.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center space-y-3">
                      <Search className="w-8 h-8 text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground">Nenhum item encontrado para este transporte</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[150px]">Código do Item</TableHead>
                          <TableHead className="w-[120px]">Lote</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead className="w-[80px]">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.map((item, index) => {
                          const isSelected = isItemSelected(item.codItem, item.lote);
                          return (
                            <TableRow
                              key={`${item.codItem}-${item.lote}-${index}`}
                              className={`cursor-pointer hover:bg-muted/50 ${isSelected ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
                              onClick={() => handleEditItem(item)}
                            >
                              <TableCell className="font-mono text-sm font-medium">
                                {item.codItem}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  {item.lote}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">
                                {item.descricao}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center justify-center">
                                  {isSelected ? (
                                    <Badge variant="default" className="text-xs">
                                      ✓
                                    </Badge>
                                  ) : (
                                    <Edit className="w-4 h-4 text-muted-foreground" />
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cortes" className="mt-6">
            <Card className="w-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Scissors className="w-5 h-5" />
                    Itens para Corte ({itensSelecionados.length})
                  </CardTitle>
                  {itensSelecionados.length > 0 && (
                    <Button onClick={handleEfetuarCorte} className="gap-2">
                      <Scissors className="w-4 h-4" />
                      Efetuar Corte
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {itensSelecionados.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center space-y-3">
                      <Scissors className="w-8 h-8 text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground">Nenhum item selecionado para corte</p>
                      <Button onClick={() => setActiveTab("itens")} variant="outline" size="sm">
                        Voltar para Itens
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Lista de Itens para Corte */}
                    <div className="space-y-3">
                      {itensSelecionados.map((item, index) => (
                        <div
                          key={`corte-${item.codItem}-${item.lote}-${index}`}
                          className="p-4 border rounded-lg bg-orange-50 border-orange-200"
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm font-medium">{item.codItem}</span>
                                <Badge variant="outline" className="text-xs">
                                  {item.lote}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{item.descricao}</p>
                              <div className="flex items-center gap-4 text-sm">
                                <span>
                                  <span className="text-muted-foreground">Quantidade:</span>
                                  <span className="ml-1 font-medium">{item.quantidade}</span>
                                </span>
                                <span>
                                  <span className="text-muted-foreground">Motivo:</span>
                                  <span className="ml-1">{item.motivo}</span>
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoverItem(item.codItem, item.lote)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              Remover
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Resumo */}
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Total de itens para corte: {itensSelecionados.length}
                        </span>
                        <div className="text-sm font-medium">
                          Quantidade total: {itensSelecionados.reduce((acc, item) => acc + item.quantidade, 0)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Modal de Edição */}
      {selectedItem && (
        <EditarItemModal
          item={selectedItem}
          open={modalOpen}
          setOpen={setModalOpen}
          onSave={handleSaveItem}
        >
          <div />
        </EditarItemModal>
      )}
    </div>
  )
}