'use client'

import { useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/_shared/components/ui/dialog'
import { Button } from '@/_shared/components/ui/button'
import { Printer, AlertTriangle, CheckCircle } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import {
  useFinalizarDemanda,
  useReabrirDemanda,
  useResultadoDemanda,
} from '@/services/api/hooks/devolucao/devolucao'
import { LoadingState } from '@/_shared/components/feedbacks/LoadingState'
import { ErrorState } from '@/_shared/components/feedbacks/ErrorState'
import { createMutationOptions } from '@/_shared/lib/mutationOptions'
import { toast } from 'react-toastify'
import { useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { resultadoDemandaResponse } from '@/services/api/schema/devolucao/devolucao.zod'
import { useReactToPrint } from 'react-to-print'

type ResultadoDemanda = z.infer<typeof resultadoDemandaResponse>
type DemandaItem = ResultadoDemanda['itens'][0]

// ===== SUB-COMPONENTS =====

const ActionButtons = ({
  onPrint,
  onFinalizar,
  onReabrir,
  isPending,
}: {
  onPrint: () => void
  onFinalizar: () => void
  onReabrir: () => void
  isPending: boolean
}) => (
  <div className="print:hidden p-4 bg-gray-50 border-b">
    <div className="flex gap-3">
      <Button variant="outline" onClick={onPrint} disabled={isPending}>
        <Printer className="h-4 w-4 mr-2" />
        Imprimir
      </Button>
      <Button
        onClick={onFinalizar}
        disabled={isPending}
        className="bg-green-600 hover:bg-green-700"
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Finalizar Processo
      </Button>
    </div>
    <div className="mt-3 text-sm text-gray-600">
      <p>
        <strong>Imprimir:</strong> Apenas imprime o relatório
      </p>
      <p>
        <strong>Finalizar Processo:</strong> Imprime e altera status para
        &quot;Finalizada&quot;
      </p>
      <p>
        <strong>Reabrir Demanda:</strong> Altera status para
        &quot;Conferindo&quot; (quando há divergências)
      </p>
    </div>
  </div>
)

const RelatorioHeader = ({
  data,
  demandaId,
}: {
  data: ResultadoDemanda
  demandaId: string
}) => (
  <div className="text-center mb-4 border-b-2 border-gray-800 pb-3">
    <h1 className="text-xl font-bold text-gray-900 mb-2">
      RELATÓRIO DE CONFERÊNCIA DE DEVOLUÇÃO
    </h1>
    <div className="grid grid-cols-3 gap-4 text-xs">
      <div className="text-left">
        <p>
          <strong>Placa:</strong> {data.placa}
        </p>
        <p>
          <strong>Transportadora:</strong> {data.transportadora}
        </p>
      </div>
      <div className="text-center">
        <p>
          <strong>Motorista:</strong> {data.motorista}
        </p>
        <p>
          <strong>Data:</strong> {new Date().toLocaleDateString('pt-BR')}
        </p>
      </div>
      <div className="text-right">
        <p>
          <strong>Nº Devolução:</strong> {demandaId}
        </p>
        <p>
          <strong>Status:</strong> {data.status.toUpperCase()}
        </p>
      </div>
    </div>
    <div className="mt-3 text-left">
      <p className="font-semibold text-xs mb-1">
        NOTAS FISCAIS:{' '}
        {data.notas.map((item) => item.nf).join(', ')}
      </p>
    </div>
  </div>
)

const TemperaturaStatus = ({
  temperaturaBau,
  temperaturaProduto,
}: {
  temperaturaBau: number
  temperaturaProduto: number
}) => {
  const isBauOk = temperaturaBau <= 4
  const isProdutoOk = temperaturaProduto <= 4

  return (
    <div className="mb-4 p-3 border rounded">
      <h2 className="text-sm font-bold mb-2 text-gray-900">
        STATUS DE TEMPERATURA
      </h2>
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="flex items-center justify-between">
          <span>
            <strong>Baú:</strong> {temperaturaBau}°C
          </span>
          <span
            className={`px-2 py-1 rounded text-xs ${
              isBauOk
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {isBauOk ? 'DENTRO DO PADRÃO' : 'FORA DO PADRÃO'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>
            <strong>Produtos:</strong> {temperaturaProduto}°C
          </span>
          <span
            className={`px-2 py-1 rounded text-xs ${
              isProdutoOk
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {isProdutoOk ? 'DENTRO DO PADRÃO' : 'FORA DO PADRÃO'}
          </span>
        </div>
      </div>
      {!isBauOk && (
        <div className="mt-2 text-xs text-red-600">
          <strong>Problema Baú:</strong> Temperatura acima do recomendado (máx
          4°C)
        </div>
      )}
      {!isProdutoOk && (
        <div className="mt-2 text-xs text-red-600">
          <strong>Problema Produtos:</strong> Temperatura acima do recomendado
          (máx 4°C)
        </div>
      )}
    </div>
  )
}

const ItensConferenciaTabela = ({
  itens,
}: {
  itens: ResultadoDemanda['itens']
}) => {
  const getItemStatus = (item: DemandaItem) => {
    if (item.totalAvariasCaixa > 0 || item.totalAvariasUnidade > 0)
      return { label: 'AV', className: 'bg-red-100 text-red-800' }
    if (item.diferencaCaixa !== 0 || item.diferencaUnidade !== 0)
      return { label: 'DIF', className: 'bg-yellow-100 text-yellow-800' }
    return { label: 'OK', className: 'bg-green-100 text-green-800' }
  }

  const renderDiff = (diff: number) => {
    if (diff === 0) return '-'
    const sign = diff > 0 ? '+' : ''
    const color =
      diff > 0
        ? 'text-green-600'
        : diff < 0
          ? 'text-red-600'
          : 'text-gray-600'
    return <span className={color}>{`${sign}${diff}`}</span>
  }

  const renderAvaria = (avaria: number) => {
    if (avaria <= 0) return <span className="text-gray-400">-</span>
    return <span className="text-red-600 font-bold">{avaria}</span>
  }

  const totals = {
    contabilCx: itens.reduce(
      (sum: number, item: DemandaItem) => sum + item.totalContabilCaixa,
      0,
    ),
    fisicoCx: itens.reduce(
      (sum: number, item: DemandaItem) => sum + item.totalFisicoCaixa,
      0,
    ),
    difCx: itens.reduce(
      (sum: number, item: DemandaItem) => sum + item.diferencaCaixa,
      0,
    ),
    avariaCx: itens.reduce(
      (sum: number, item: DemandaItem) => sum + item.totalAvariasCaixa,
      0,
    ),
    contabilUn: itens.reduce(
      (sum: number, item: DemandaItem) => sum + item.totalContabilUnidade,
      0,
    ),
    fisicoUn: itens.reduce(
      (sum: number, item: DemandaItem) => sum + item.totalFisicoUnidade,
      0,
    ),
    difUn: itens.reduce(
      (sum: number, item: DemandaItem) => sum + item.diferencaUnidade,
      0,
    ),
    avariaUn: itens.reduce(
      (sum: number, item: DemandaItem) => sum + item.totalAvariasUnidade,
      0,
    ),
  }

  return (
    <div className="mb-4">
      <h2 className="text-sm font-bold mb-2 text-gray-900">
        CONFERÊNCIA DE ITENS
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th
                className="border border-gray-300 px-1 py-1 text-left font-bold"
                rowSpan={2}
              >
                PRODUTO
              </th>
              <th
                className="border border-gray-300 px-1 py-1 text-center font-bold"
                colSpan={4}
              >
                CAIXAS
              </th>
              <th
                className="border border-gray-300 px-1 py-1 text-center font-bold"
                colSpan={4}
              >
                UNIDADES
              </th>
              <th
                className="border border-gray-300 px-1 py-1 text-center font-bold"
                rowSpan={2}
              >
                STATUS
              </th>
            </tr>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-1 py-1 text-center font-bold text-xs">
                CONT
              </th>
              <th className="border border-gray-300 px-1 py-1 text-center font-bold text-xs">
                CONF
              </th>
              <th className="border border-gray-300 px-1 py-1 text-center font-bold text-xs">
                DIF
              </th>
              <th className="border border-gray-300 px-1 py-1 text-center font-bold text-xs">
                AVARIA
              </th>
              <th className="border border-gray-300 px-1 py-1 text-center font-bold text-xs">
                CONT
              </th>
              <th className="border border-gray-300 px-1 py-1 text-center font-bold text-xs">
                CONF
              </th>
              <th className="border border-gray-300 px-1 py-1 text-center font-bold text-xs">
                DIF
              </th>
              <th className="border border-gray-300 px-1 py-1 text-center font-bold text-xs">
                AVARIA
              </th>
            </tr>
          </thead>
          <tbody>
            {itens.map((item) => (
              <tr key={item.sku}>
                <td className="border border-gray-300 px-1 py-1">
                  <div className="font-medium text-xs">
                    {item.sku} - {item.descricao}
                  </div>
                </td>
                <td className="border border-gray-300 px-1 py-1 text-center font-medium text-xs">
                  {item.totalContabilCaixa > 0 ? item.totalContabilCaixa : '-'}
                </td>
                <td className="border border-gray-300 px-1 py-1 text-center font-medium text-xs">
                  {item.totalFisicoCaixa > 0 ? item.totalFisicoCaixa : '-'}
                </td>
                <td className="border border-gray-300 px-1 py-1 text-center font-medium text-xs">
                  {renderDiff(item.diferencaCaixa)}
                </td>
                <td className="border border-gray-300 px-1 py-1 text-center font-medium text-xs">
                  {renderAvaria(item.totalAvariasCaixa)}
                </td>
                <td className="border border-gray-300 px-1 py-1 text-center font-medium text-xs">
                  {item.totalContabilUnidade > 0
                    ? item.totalContabilUnidade
                    : '-'}
                </td>
                <td className="border border-gray-300 px-1 py-1 text-center font-medium text-xs">
                  {item.totalFisicoUnidade > 0 ? item.totalFisicoUnidade : '-'}
                </td>
                <td className="border border-gray-300 px-1 py-1 text-center font-medium text-xs">
                  {renderDiff(item.diferencaUnidade)}
                </td>
                <td className="border border-gray-300 px-1 py-1 text-center font-medium text-xs">
                  {renderAvaria(item.totalAvariasUnidade)}
                </td>
                <td className="border border-gray-300 px-1 py-1 text-center">
                  <span
                    className={`px-1 py-0.5 rounded text-xs font-medium ${
                      getItemStatus(item).className
                    }`}
                  >
                    {getItemStatus(item).label}
                  </span>
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-bold">
              <td className="border border-gray-300 px-1 py-1 text-xs">
                TOTAL
              </td>
              <td className="border border-gray-300 px-1 py-1 text-center text-xs">
                {totals.contabilCx}
              </td>
              <td className="border border-gray-300 px-1 py-1 text-center text-xs">
                {totals.fisicoCx}
              </td>
              <td className="border border-gray-300 px-1 py-1 text-center text-xs">
                {totals.difCx}
              </td>
              <td className="border border-gray-300 px-1 py-1 text-center text-xs">
                {totals.avariaCx}
              </td>
              <td className="border border-gray-300 px-1 py-1 text-center text-xs">
                {totals.contabilUn}
              </td>
              <td className="border border-gray-300 px-1 py-1 text-center text-xs">
                {totals.fisicoUn}
              </td>
              <td className="border border-gray-300 px-1 py-1 text-center text-xs">
                {totals.difUn}
              </td>
              <td className="border border-gray-300 px-1 py-1 text-center text-xs">
                {totals.avariaUn}
              </td>
              <td className="border border-gray-300 px-1 py-1 text-center text-xs"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

const AssinaturaMotorista = ({
  motorista,
}: {
  motorista: string
}) => (
  <div className="mb-4">
    <h2 className="text-sm font-bold mb-2 text-gray-900">
      ASSINATURA DO MOTORISTA
    </h2>
    <div className="text-xs">
      <p className="font-medium mb-2">Motorista: {motorista}</p>
      <div className="w-full h-16 border-2 border-dashed border-gray-400 rounded flex items-center justify-center mb-2">
        <span className="text-gray-500 text-sm">Assinatura do Motorista</span>
      </div>
      <p className="text-gray-600">
        Data: {new Date().toLocaleDateString('pt-BR')}
      </p>
    </div>
  </div>
)

const FinalizarModal = ({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isPending: boolean
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Finalizar Processo
        </DialogTitle>
        <DialogDescription>
          Tem certeza que deseja finalizar este processo de devolução?
          <br />
          <br />
          <strong>Esta ação irá:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Imprimir o relatório de conferência</li>
            <li>Alterar o status para &quot;Finalizada&quot;</li>
            <li>Concluir o processo de devolução</li>
          </ul>
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="gap-2">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isPending}
        >
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isPending}
          className="bg-green-600 hover:bg-green-700"
        >
          {isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Finalizando...
            </>
          ) : (
            'Confirmar Finalização'
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

const ReabrirModal = ({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isPending: boolean
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          Reabrir Demanda
        </DialogTitle>
        <DialogDescription>
          Tem certeza que deseja reabrir esta demanda para nova conferência?
          <br />
          <br />
          <strong>Esta ação irá:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Alterar o status para &quot;Conferindo&quot;</li>
            <li>Permitir nova conferência operacional</li>
            <li>Indicar que foram encontradas divergências</li>
          </ul>
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="gap-2">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isPending}
        >
          Cancelar
        </Button>
        <Button onClick={onConfirm} disabled={isPending} variant="destructive">
          {isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Reabrindo...
            </>
          ) : (
            'Confirmar Reabertura'
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

// ===== MAIN COMPONENT =====

export default function FinalizarDemanda() {
  const { id: demandaId } = useParams() as { id: string }
  const router = useRouter()
  const queryClient = useQueryClient()
  const contentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef,
  });

  const [modalFinalizar, setModalFinalizar] = useState(false)
  const [modalReabrir, setModalReabrir] = useState(false)

  const {
    data: resultado,
    isLoading,
    error,
  } = useResultadoDemanda(demandaId)

  const { mutate: finalizar, isPending: isFinalizando } = useFinalizarDemanda(
    createMutationOptions({
      onSuccessCallback: () => {
        toast.success('Demanda finalizada com sucesso!')
        setModalFinalizar(false)
        handlePrint()
        queryClient.invalidateQueries({
          queryKey: ['resultadoDemanda', demandaId],
        })
        router.push(`/devolucao/demanda/${demandaId}`)
      },
      onErrorCallback: (err) => {
        toast.error(err.message)
      },
    }),
  )

  const { mutate: reabrir, isPending: isReabrindo } = useReabrirDemanda(
    createMutationOptions({
      onSuccessCallback: () => {
        toast.success('Demanda reaberta com sucesso!')
        setModalReabrir(false)
        queryClient.invalidateQueries({
          queryKey: ['resultadoDemanda', demandaId],
        })
        router.push(`/devolucao/demanda/${demandaId}`)
      },
      onErrorCallback: (err) => {
        toast.error(err.message)
      },
    }),
  )

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState />
  }

  if (!resultado) {
    return <ErrorState />
  }

  const isMutationPending = isFinalizando || isReabrindo

  const handleConfirmarFinalizar = () => {
    finalizar({ demandaId })
  }

  const handleConfirmarReabrir = () => {
    reabrir({ demandaId })
  }

  return (
    <div className="min-h-screen bg-white print:bg-white">
      <ActionButtons
        onPrint={handlePrint}
        onFinalizar={() => setModalFinalizar(true)}
        onReabrir={() => setModalReabrir(true)}
        isPending={isMutationPending}
      />

      <div ref={contentRef} className="p-8 print:p-6 max-w-4xl mx-auto">
        <RelatorioHeader data={resultado} demandaId={demandaId} />
        <TemperaturaStatus
          temperaturaBau={resultado.temperaturaBau}
          temperaturaProduto={resultado.temperaturaProduto}
        />
        <ItensConferenciaTabela itens={resultado.itens} />
        <AssinaturaMotorista motorista={resultado.motorista} />
      </div>

      <FinalizarModal
        open={modalFinalizar}
        onOpenChange={setModalFinalizar}
        onConfirm={handleConfirmarFinalizar}
        isPending={isFinalizando}
      />
    </div>
  )
}