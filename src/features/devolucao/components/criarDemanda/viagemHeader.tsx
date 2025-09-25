'use client';
import { FormInput } from "@/_shared/components/hookForms/FormInput";
import { Button } from "@/_shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/_shared/components/ui/card";
import { Truck, User, Package, Send } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { DialogConfirmarCriaçãoDemanda } from "./dialogConfirmarCriaçãoDemanda";

export const ViagemHeader = () => {
  const { getValues } = useFormContext();
  const data = getValues();

  return (
    <div className="w-full overflow-hidden">
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Truck className="h-5 w-5 flex-shrink-0" />
                Informações da Viagem
              </CardTitle>
              <CardDescription className="truncate">ID da Viagem: {data.idViagem}</CardDescription>
            </div>
            <DialogConfirmarCriaçãoDemanda />
          </div>
        </CardHeader>
        <CardContent className="overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-4 w-full">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg flex-1 min-w-0">
              <Truck className="h-8 w-8 text-blue-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <FormInput 
                  defaultValue={data.placa} 
                  className="font-bold text-blue-900 uppercase w-full max-w-full" 
                  name="placa" 
                  label="Placa" 
                />
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg flex-1 min-w-0">
              <User className="h-8 w-8 text-green-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <FormInput 
                  defaultValue={data.motorista} 
                  className="font-bold text-green-900 uppercase w-full max-w-full" 
                  name="motorista" 
                  label="Motorista" 
                />
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg flex-1 min-w-0">
              <Package className="h-8 w-8 text-purple-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <FormInput 
                  defaultValue={data.transportadora} 
                  className="font-bold text-purple-900 uppercase w-full max-w-full" 
                  name="transportadora" 
                  label="Transportadora" 
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
};