'use client'

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/_shared/components/ui/dialog"
import { Button } from "@/_shared/components/ui/button"
import { useDefinicaoStore } from "../../stores/definicao.store"
import { Calendario } from "@/_shared/components/calendario"
import { useAuthStore } from "@/_shared/stores/auth.store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/_shared/components/ui/select"
import { Label } from "@/_shared/components/ui/label"
import { AlertCircle, Calendar, Settings, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/_shared/components/ui/alert"
import { startOfDay } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/_shared/components/ui/card"
import { Separator } from "@/_shared/components/ui/separator"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function SelecionarInformacoes({ open, setOpen }: Props) {
  const { user } = useAuthStore()
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [selectedProcess, setSelectedProcess] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  
  const { dataTrabalho, setDataTrabalho, token, setToken, setProcesso, processo } = useDefinicaoStore()
  
  useEffect(() => {
    if (user) {
      if (user.accessToken === token && dataTrabalho && processo) {
        setOpen(false)
      }
    }
  }, [user, token, dataTrabalho, processo, setOpen])

  const handleProcessChange = (value: string) => {
    setSelectedProcess(value)
    setError("")
  }

  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    setError("")
  }

  const handleConfirmarSelecao = async () => {
    setError("")
    
    // Validação
    if (!date || isNaN(date.getTime())) {
      setError("Por favor, selecione uma data de trabalho válida.")
      return
    }
    
    if (!selectedProcess) {
      setError("Por favor, selecione um processo.")
      return
    }

    setIsLoading(true)
    
    try {
      // Salvar no store com proteção
      const safeDate = startOfDay(date)
      if (isNaN(safeDate.getTime())) {
        throw new Error("Data inválida ao salvar")
      }

      setDataTrabalho(safeDate.toISOString())
      setProcesso(selectedProcess)
      setToken(user?.accessToken || '')
      
      // Simular delay para feedback visual
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setOpen(false)
    } catch (err) {
      setError("Erro ao salvar as informações. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = date && !isNaN(date.getTime()) && selectedProcess

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-2xl min-w-2xl w-full mx-4 p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Settings className="h-5 w-5 text-primary" />
            Configurar Sessão de Trabalho
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Selecione a data e o processo para iniciar sua sessão de produtividade
          </p>
        </DialogHeader>
        
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card de Seleção de Data */}
            <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4 text-primary" />
                  Data de Trabalho
                </CardTitle>
                <CardDescription className="text-xs">
                  Escolha a data para análise de produtividade
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex justify-center">
                  <Calendario date={date} setDate={handleDateChange} />
                </div>
                {date && !isNaN(date.getTime()) && (
                  <div className="mt-3 p-2 bg-primary/5 rounded-md border">
                    <p className="text-xs font-medium text-center text-primary">
                      {date.toLocaleDateString('pt-BR', { 
                        weekday: 'long', 
                        day: '2-digit', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Card de Seleção de Processo */}
            <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Settings className="h-4 w-4 text-primary" />
                  Processo
                </CardTitle>
                <CardDescription className="text-xs">
                  Selecione o processo para análise
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Tipo de Processo</Label>
                  <Select value={selectedProcess} onValueChange={handleProcessChange}>
                    <SelectTrigger className="h-10 text-sm">
                      <SelectValue placeholder="Selecione um processo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SEPARACAO">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Separação
                        </div>
                      </SelectItem>
                      <SelectItem value="CARREGAMENTO">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Carregamento
                        </div>
                      </SelectItem>
                      <SelectItem value="CONFERENCIA">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          Conferência
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status da Seleção */}
                {selectedProcess && (
                  <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded-md border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <p className="text-xs font-medium text-green-700 dark:text-green-300">
                        Processo selecionado: {selectedProcess}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Separator className="my-6" />

          {/* Botão de Confirmação */}
          <div className="flex justify-end">
            <Button 
              onClick={handleConfirmarSelecao}
              disabled={!isFormValid || isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processando...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Confirmar Sessão</span>
                </div>
              )}
            </Button>
          </div>

          {/* Erro */}
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
