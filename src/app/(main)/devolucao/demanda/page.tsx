'use client';

export const dynamic = 'force-dynamic';

import { DemandasDoDia } from "@/features/devolucao/views/listaDemandasPorDia";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Calendar } from "@/_shared/components/ui/calendar";
import { Button } from "@/_shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/_shared/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { ptBR } from "date-fns/locale";

export default function DemandaPage() {
  return (
    <Suspense fallback={<div className="p-4">Carregando...</div>}>
      <DemandaPageInner />
    </Suspense>
  );
}

const DemandaPageInner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Verificar se há parâmetro de data na URL
  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      // Criar data no timezone local para evitar problemas de fuso horário
      const [year, month, day] = dataParam.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
        return;
      }
    }
    // Fallback para hoje quando não há parâmetro ou é inválido
    setSelectedDate(new Date());
  }, [searchParams]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setIsCalendarOpen(false);
      
      // Atualizar a URL com a nova data no formato YYYY-MM-DD
      const params = new URLSearchParams(searchParams.toString());
      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      params.set('data', dateString);
      router.push(`/devolucao/demanda?${params.toString()}`);
    }
  };

  const handleTodayClick = () => {
    const today = new Date();
    setSelectedDate(today);
    setIsCalendarOpen(false);
    
    const params = new URLSearchParams(searchParams.toString());
    const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    params.set('data', dateString);
    router.push(`/devolucao/demanda?${params.toString()}`);
  };

  // Se não há data selecionada, mostrar seletor de data
  if (!selectedDate) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Selecionar Data
              </CardTitle>
              <CardDescription>
                Escolha a data para visualizar as demandas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="rounded-md border"
                  locale={ptBR}
                />
              </div>
              <div className="flex justify-center gap-2">
                <Button onClick={handleTodayClick} variant="outline">
                  Hoje
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <DemandasDoDia 
        data={`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`}
        onDateChange={handleDateSelect}
        selectedDate={selectedDate}
      />
    </div>
  );
}