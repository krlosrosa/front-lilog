import { Card, CardContent } from "@/_shared/components/ui/card";
import { FileText } from "lucide-react";
import { Button } from "@/_shared/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export const EmptyState = () => (
  <Card>
    <CardContent className="flex flex-col items-center justify-center py-12">
      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">Nenhuma demanda encontrada</h3>
      <p className="text-muted-foreground text-center mb-4">
        Não há demandas para a data selecionada.
      </p>
    </CardContent>
  </Card>
);