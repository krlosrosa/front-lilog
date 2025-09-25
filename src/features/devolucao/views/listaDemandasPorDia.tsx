'use client'
import { useMemo } from "react";
import { useAuthStore } from "@/_shared/stores/auth.store";
import { useListarDemandasPorData } from "@/services/api/hooks/devolucao/devolucao";
import { Header } from "../components/header";
import { LoadingState } from "../components/loadingState";
import { ErrorState } from "../components/errorState";
import { DemandasTable, DemandaItem } from "../components/tabelaListaDemandaDia";
import { Input } from "@/_shared/components/ui/input";
import { FloatBotaoNovaDemanda } from "../components/floatBotaoNovaDemanda";
import { formatDate } from "../utils/formatData";
import { Button } from "@/_shared/components/ui/button";
import { Calendar } from "@/_shared/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/_shared/components/ui/popover";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";



interface DemandasDoDiaProps {
  data: string;
  onDateChange?: (date: Date | undefined) => void;
  selectedDate?: Date;
}

export function DemandasDoDia({ data, onDateChange, selectedDate }: DemandasDoDiaProps) {
  const { centerId } = useAuthStore();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const { data: dataDemandas, isLoading, error } = useListarDemandasPorData(new Date(data).toISOString(), centerId as string);

  // Transform API data to match our interface
  const demandas: DemandaItem[] = useMemo(() => {
    if (!dataDemandas) return [];
    const dataArray = Array.isArray(dataDemandas) ? dataDemandas : [dataDemandas];
    return dataArray.map((demanda: any) => ({
      id: demanda.id?.toString() || '',
      placa: demanda.placa || '',
      motorista: demanda.motorista || '',
      transportadora: demanda.transportadora || '',
      status: demanda.status || 'AGUARDANDO_LIBERACAO',
      quantidadeNotas: demanda.quantidadeNotas || demanda.notas?.length || 0,
      criadoEm: demanda.criadoEm || '',
      operador: demanda.operador,
      conferente: demanda.conferente
    }));
  }, [dataDemandas]);

  const [searchTerm, setSearchTerm] = useState('');

  const handleDateChange = (date: Date | undefined) => {
    if (date && onDateChange) {
      onDateChange(date);
      setIsCalendarOpen(false);
    }
  };

  const handlePreviousDay = () => {
    if (selectedDate) {
      const previousDay = new Date(selectedDate);
      previousDay.setDate(previousDay.getDate() - 1);
      handleDateChange(previousDay);
    }
  };

  const handleNextDay = () => {
    if (selectedDate) {
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      handleDateChange(nextDay);
    }
  };

  const handleToday = () => {
    handleDateChange(new Date());
  };

  const filteredDemandas = demandas.filter((demanda) => demanda.placa.toLowerCase().includes(searchTerm.toLowerCase())) || demandas;

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState message={error.message} />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Header title="Demandas do Dia" subtitle={formatDate(data)} />
        
        {/* Seletor de Data */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousDay}
            disabled={!selectedDate}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[240px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextDay}
            disabled={!selectedDate}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
          >
            Hoje
          </Button>
        </div>
      </div>
      
      <Input placeholder="Pesquisar" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <DemandasTable demandas={filteredDemandas} />
      <FloatBotaoNovaDemanda />
    </div>
  );
}