'use client'
import { Button } from "@/_shared/components/ui/button";
import { useCreateRule } from "@/services/api/hooks/rules/rules";
import { useState } from "react";
import { QueryBuilder, RuleGroupType, type Field } from "react-querybuilder";
import { toast } from "react-toastify";

const fields: Field[] = [
  { name: "id", label: "ID", value: "id", type: "string" },
  { 
    name: "status", 
    label: "Status", 
    value: "status",
    type: "string",
    operators: ["=", "!="],
    valueEditorType: 'select',
    values: [
      { name: "PENDENTE", label: "Pendente" },
      { name: "EM_ANDAMENTO", label: "Em Andamento" },
      { name: "CONCLUIDO", label: "Concluído" },
      { name: "CANCELADO", label: "Cancelado" },
    ]
  },
  { name: "demandaId", label: "Demanda", value: "demandaId", type: "number" },
  { 
    name: "processo", 
    label: "Processo", 
    value: "processo",
    type: "string",
    operators: ["=", "!="],
    valueEditorType: 'select',
    values: [
      { name: "SEPARACAO", label: "Separação" },
      { name: "EXPEDICAO", label: "Expedição" },
      { name: "DEVOLUCAO", label: "Devolução" },
      { name: "RECEBIMENTO", label: "Recebimento" },
    ]
  },
  { name: "caixas", label: "Caixas", value: "caixas", type: "number" },
  { name: "unidades", label: "Unidades", value: "unidades", type: "number" },
  { name: "paletes", label: "Paletes", value: "paletes", type: "number" },
  { name: "empresa", label: "Empresa", value: "empresa", type: "string" },
  { 
    name: "segmento", 
    label: "Segmento", 
    value: "segmento",
    type: "string",
    operators: ["=", "!="],
    valueEditorType: 'select',
    values: [
      { name: "SECA", label: "Seco" },
      { name: "REFR", label: "Refrigerado" },
      { name: "QUEIJO", label: "Queijo" },
      { name: "CONGELADO", label: "Congelado" },
    ]
  },
  { name: "visitas", label: "Visitas", value: "visitas", type: "number" },
  { name: "criadoEm", label: "Criado em", value: "criadoEm", type: "date" },
  { name: "atualizadoEm", label: "Atualizado em", value: "atualizadoEm", type: "date" },
  { name: "criadoPorId", label: "Criado por", value: "criadoPorId", type: "string" },
  { name: "validado", label: "Validado", value: "validado", type: "boolean" },
  { name: "transporteId", label: "Transporte", value: "transporteId", type: "string" },
];

export default function PaleteRulesBuilder() {
  const [query, setQuery] = useState<RuleGroupType>({
    combinator: "and",
    rules: [],
  });


  const { mutateAsync } = useCreateRule({
    mutation: {
      onSuccess: () => {
        toast.success('Regra criada com sucesso');
      },
      onError: () => {
        toast.error('Erro ao criar regra');
      },
    },
  })

  const handleCreateRule = () => {
    mutateAsync({
      data: {
        centerId: 'pavuna',
        createdBy: 'Carlos',
        name: 'Regra de Palete',
        description: 'Regra de Palete',
        conditions: query,
        enabled: true,
      }
    });
  };

  return (
    <div className="p-4 space-y-4 rounded-2xl shadow-md bg-white">
      <h2 className="text-xl font-semibold">Definir Regras para Palete</h2>
      <QueryBuilder
        fields={fields}
        query={query}
        onQueryChange={setQuery}
      />
      <Button onClick={handleCreateRule}>Salvar Regras</Button>
    </div>
  );
}