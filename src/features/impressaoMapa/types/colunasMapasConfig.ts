import { ImpressaoMapaItem } from "./mapaPicking.type";

export interface ColunaConfig {
  key: keyof ImpressaoMapaItem;
  header: string;
  align?: 'left' | 'center' | 'right';
  render?: (item: ImpressaoMapaItem) => React.ReactNode;
}