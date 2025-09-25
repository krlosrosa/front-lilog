import { Card, CardContent, CardHeader, CardTitle } from "@/_shared/components/ui/card";
import { Search } from "lucide-react";
import { Label } from "@/_shared/components/ui/label";
import { Input } from "@/_shared/components/ui/input";
import { Button } from "@/_shared/components/ui/button";

type BuscaRavexProps = {
  viagemId: string;
  setViagemId: (viagemId: string) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  handleBuscar: () => void;
  isLoading: boolean;
  isPending: boolean;
}

export const BuscaRavex = ({ viagemId, setViagemId, handleKeyPress, handleBuscar, isLoading, isPending }: BuscaRavexProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Search className="h-4 w-4" />
          Buscar Viagem Ravex
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <div className="flex-1">
            <Label htmlFor="viagemId" className="text-sm">ID da Viagem</Label>
            <Input
              id="viagemId"
              value={viagemId}
              onChange={(e) => setViagemId(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite o ID da viagem Ravex"
              className="mt-1"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleBuscar}
              disabled={!viagemId.trim() || isLoading || isPending}
              className="h-10"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}