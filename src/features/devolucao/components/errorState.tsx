import { Alert, AlertDescription, AlertTitle } from "@/_shared/components/ui/alert";
import { CircleAlert } from "lucide-react";

type ErrorStateProps = { message?: string };
export const ErrorState = ({ message }: ErrorStateProps) => (
  <Alert variant="destructive">
    <CircleAlert className="h-4 w-4" />
    <AlertTitle>Erro ao carregar demandas</AlertTitle>
    <AlertDescription>
      {message || 'Ocorreu um erro ao buscar as demandas. Tente novamente.'}
    </AlertDescription>
  </Alert>
);  