'use client';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/_shared/components/ui/dialog";
import { Button } from "@/_shared/components/ui/button";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useFormContext } from "react-hook-form";

export const DialogConfirmarCriaçãoDemanda = () => {  

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" className="">
          Confirmar Criação de Demanda
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <DialogTitle className="text-xl font-semibold">
            Confirmar Criação de Demanda
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Tem certeza que deseja criar esta demanda? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-amber-800 dark:text-amber-200">
                  Atenção
                </p>
                <p className="text-amber-700 dark:text-amber-300 mt-1">
                  Verifique se todos os dados estão corretos antes de confirmar a criação da demanda.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            form="criar-demanda-form"
            className="w-full sm:w-auto"
          >
            Confirmar Criação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}