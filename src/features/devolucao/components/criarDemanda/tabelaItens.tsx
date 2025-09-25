import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/_shared/components/ui/table";
import { ReturnInfoGeralRavex } from "@/services/api/model";

interface NotaCardProps {
  nota: ReturnInfoGeralRavex['notas'][0];
  index: number;
}

export function TabelaItensRavex({ nota, index }: NotaCardProps) {
  return (
      <Table className="w-full">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-8 text-xs py-1">SKU</TableHead>
            <TableHead className="h-8 text-xs py-1">Descrição</TableHead>
            <TableHead className="h-8 text-xs py-1 text-right">Peso (kg)</TableHead>
            <TableHead className="h-8 text-xs py-1 text-right">Ravex</TableHead>
            <TableHead className="h-8 text-xs py-1 text-right">Caixas</TableHead>
            <TableHead className="h-8 text-xs py-1 text-right">Unidades</TableHead>
            <TableHead className="h-8 text-xs py-1 text-right">Fator de Conversão</TableHead>
            <TableHead className="h-8 text-xs py-1 text-right">Decimal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nota.itens.map((item, itemIndex) => (
            <TableRow key={itemIndex} className="hover:bg-muted/30">
              <TableCell className="py-1 text-xs font-medium font-mono">{item.sku}</TableCell>
              <TableCell className="py-1 text-xs max-w-40 truncate" title={item.descricao}>
                {item.descricao}
              </TableCell>
              <TableCell className="py-1 text-xs text-right">{item.pesoLiquido.toFixed(2)}</TableCell>
              <TableCell className="py-1 text-xs text-right">{item.quantidadeRavex}</TableCell>
              <TableCell className="py-1 text-xs text-right">{item.quantidadeCaixas}</TableCell>
              <TableCell className="py-1 text-xs text-right">{item.quantidadeUnidades}</TableCell>
              <TableCell className="py-1 text-xs text-right">{item.fatorConversao}</TableCell>
              <TableCell className="py-1 text-xs text-right">{item.decimal}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
  )
}