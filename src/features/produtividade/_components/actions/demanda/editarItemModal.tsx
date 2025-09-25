'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/_shared/components/ui/dialog"
import { Button } from "@/_shared/components/ui/button"
import { Input } from "@/_shared/components/ui/input"
import { Label } from "@/_shared/components/ui/label"
import { Textarea } from "@/_shared/components/ui/textarea"
import { Badge } from "@/_shared/components/ui/badge"
import { ItensDoTransporteZodDtoOutputItem } from "@/services/api/model/itensDoTransporteZodDtoOutputItem"
import { Package, Save, X } from "lucide-react"

interface EditarItemModalProps {
  item: ItensDoTransporteZodDtoOutputItem
  children: React.ReactNode
  open: boolean
  setOpen: (open: boolean) => void
  onSave?: (data: { quantidade: number; motivo: string }) => void
}

export function EditarItemModal({ 
  item, 
  children,
  open,
  setOpen,
  onSave
}: EditarItemModalProps) {
  const [quantidade, setQuantidade] = useState<string>('')
  const [motivo, setMotivo] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSave = async () => {
    if (!quantidade.trim()) {
      alert('Por favor, informe a quantidade')
      return
    }

    if (!motivo.trim()) {
      alert('Por favor, informe o motivo')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Chama a função onSave se fornecida
      if (onSave) {
        onSave({
          quantidade: Number(quantidade),
          motivo
        })
      }
      
      // Limpar campos
      setQuantidade('')
      setMotivo('')
      
    } catch (error) {
      console.error('Erro ao salvar item:', error)
      alert('Erro ao salvar item')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setOpen(false)
    setQuantidade('')
    setMotivo('')
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      handleCancel()
    } else {
      setOpen(newOpen)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Cortar Item
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Informações do Item */}
          <div className="p-4 bg-muted/30 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Código do Item</Label>
              <span className="font-mono text-sm font-medium">{item.codItem}</span>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Lote</Label>
              <Badge variant="outline" className="text-xs">
                {item.lote}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium">Descrição</Label>
              <p className="text-sm text-muted-foreground mt-1">{item.descricao}</p>
            </div>
          </div>

          {/* Campos de Edição */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade *</Label>
              <Input
                id="quantidade"
                type="number"
                placeholder="Digite a quantidade"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                min="0"
                step="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo *</Label>
              <Textarea
                id="motivo"
                placeholder="Digite o motivo da alteração"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSubmitting || !quantidade.trim() || !motivo.trim()}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
