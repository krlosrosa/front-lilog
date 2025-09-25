export type Action = {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  isPrimary: boolean;
  variant?: 'destructive';
}