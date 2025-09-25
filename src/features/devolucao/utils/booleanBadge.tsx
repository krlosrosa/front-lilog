import { Badge } from "@/_shared/components/ui/badge";

export const booleanBadge = (value?: boolean) => {
  if (value) return <Badge className="bg-emerald-600">Sim</Badge>;
  return <Badge variant="secondary" className="text-muted-foreground">Não</Badge>;
};  