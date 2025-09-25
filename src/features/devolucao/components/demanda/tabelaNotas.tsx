import { ListarNotasDemandaResponseZodDtoNotasItem } from "@/services/api/model";
import { Card, CardContent, CardHeader, CardTitle } from "@/_shared/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/_shared/components/ui/table";
import { Badge } from "@/_shared/components/ui/badge";
import { formatDate } from "../../utils/formatData";

type NotasTableProps = { notas: ListarNotasDemandaResponseZodDtoNotasItem[] };
export const NotasTable = ({ notas }: NotasTableProps) => {
  const totalNotas = notas.length;
  const getTipoBadgeClass = (tipo: string) => {
    if (tipo === 'DEVOLUCAO') return 'bg-blue-600 text-white border-0';
    if (tipo === 'DEVOLUCAO_PARCIAL') return 'bg-amber-600 text-white border-0';
    if (tipo === 'REENTREGA') return 'bg-purple-600 text-white border-0';
    return '';
  };
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Notas ({totalNotas})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Lista de notas associadas à demanda</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa</TableHead>
              <TableHead>NF</TableHead>
              <TableHead>NF Parcial</TableHead>
              <TableHead>Motivo</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Criado em</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notas.map((n) => (
              <TableRow key={n.id} className="hover:bg-muted/50 focus-within:bg-muted/50">
                <TableCell className="font-medium">{n.empresa}</TableCell>
                <TableCell>{n.notaFiscal}</TableCell>
                <TableCell>{n.nfParcial ?? '-'}</TableCell>
                <TableCell>{n.motivoDevolucao}</TableCell>
                <TableCell className="max-w-[360px] truncate" title={n.descMotivoDevolucao ?? ''}>{n.descMotivoDevolucao ?? '-'}</TableCell>
                <TableCell>
                  <Badge className={getTipoBadgeClass(n.tipo)} aria-label={`Tipo: ${n.tipo}`}>{n.tipo}</Badge>
                </TableCell>
                <TableCell>{formatDate(n.criadoEm)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};