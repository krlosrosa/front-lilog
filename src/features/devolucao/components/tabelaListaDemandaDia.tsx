import { Card, CardContent, CardHeader, CardTitle } from "@/_shared/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/_shared/components/ui/table";
import { Badge } from "@/_shared/components/ui/badge";
import { Button } from "@/_shared/components/ui/button";
import { getStatusBadgeClass } from "../utils/getStatusBadgeClass";
import { getStatusLabel } from "../utils/getStatusLabel";
import Link from "next/link"; 
import { formatDate } from "../utils/formatData";

export interface DemandaItem {
  id: string;
  placa: string;
  motorista: string;
  transportadora: string;
  status: 'AGUARDANDO_LIBERACAO' | 'AGUARDANDO_CONFERENCIA' | 'EM_CONFERENCIA' | 'CONFERENCIA_FINALIZADA' | 'FINALIZADO' | 'CANCELADO';
  quantidadeNotas: number;
  criadoEm: string;
  operador?: string;
  conferente?: string;
}


type DemandasTableProps = { demandas: DemandaItem[] };
export const DemandasTable = ({ demandas }: DemandasTableProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Lista de Demandas</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Lista de demandas do dia selecionado</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Placa</TableHead>
              <TableHead>Motorista</TableHead>
              <TableHead>Transportadora</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notas</TableHead>
              <TableHead>Operador</TableHead>
              <TableHead>Conferente</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {demandas.map((demanda) => (
              <TableRow key={demanda.id} className="hover:bg-muted/50 focus-within:bg-muted/50">
                <TableCell className="font-medium">
                  <Link 
                    href={`/devolucao/demanda/${demanda.id}`}
                    className="text-primary hover:underline"
                  >
                    #{demanda.id}
                  </Link>
                </TableCell>
                <TableCell>{demanda.placa}</TableCell>
                <TableCell>{demanda.motorista}</TableCell>
                <TableCell>{demanda.transportadora}</TableCell>
                <TableCell>
                  <Badge 
                    className={getStatusBadgeClass(demanda.status)}
                    aria-label={`Status: ${getStatusLabel(demanda.status)}`}
                  >
                    {getStatusLabel(demanda.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{demanda.quantidadeNotas}</Badge>
                </TableCell>
                <TableCell>{demanda.operador || '-'}</TableCell>
                <TableCell>{demanda.conferente || '-'}</TableCell>
                <TableCell>{formatDate(demanda.criadoEm)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/devolucao/demanda/${demanda.id}`}>
                        Ver
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/devolucao/demanda/${demanda.id}/adicionar`}>
                        Adicionar
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};