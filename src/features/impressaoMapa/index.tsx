'use client';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContentNoMount as TabsContent, // Use the non-unmounting version
} from '@/_shared/components/ui/tabs';
import UploadsPage from './components/uploads/uploadFiles';
import { useState } from 'react';
import { ErrorFiles } from '@/_core/gerarMapa/types/errorsFile';
import ErrorsValidacao from './components/errorsValidacao';
import TransportesAdicionados from './components/adicionarTransporte/transportesAdicionados';
import Mapa from './components/mapa';
import { ImpressaoMinutaCarregamentoPage } from './components/minuta';
import Configuracoes from './components/configuracoes';
import { Header } from '../devolucao/components/header';

export default function ImpressaoMapa() {
  const [tab, setTab] = useState('upload');
  const [errors, setErrors] = useState<ErrorFiles | null>(null);

  return (
    <div className="p-4">
    <Header title="Impressão de Mapa" subtitle="Impressão de Mapa" />

    <Tabs className='mt-4' value={tab} onValueChange={setTab}>
      <TabsList hidden>
        <TabsTrigger value='upload'>Upload</TabsTrigger>
        <TabsTrigger value='minuta'>Minuta</TabsTrigger>
        <TabsTrigger value='mapa'>Separação</TabsTrigger>
        <TabsTrigger value='transporte'>Transporte</TabsTrigger>
        <TabsTrigger value='validacaoDados'>Validar Entradas</TabsTrigger>
        <TabsTrigger value='configuracoes'>Configurações</TabsTrigger>
      </TabsList>
      <TabsContent value='upload'>
        <UploadsPage  setTab={setTab} setErrors={setErrors}/>
      </TabsContent>
      <TabsContent value='minuta'>
        <ImpressaoMinutaCarregamentoPage setTab={setTab} />
      </TabsContent>
      <TabsContent value='mapa'>
        <Mapa setTab={setTab} />
      </TabsContent>
      <TabsContent value='transporte'>
        <TransportesAdicionados setTab={setTab} />
      </TabsContent>
      <TabsContent value='validacaoDados'>
        <ErrorsValidacao setTab={setTab} errors={errors} />
      </TabsContent>
      <TabsContent value='configuracoes'>
        <Configuracoes setTab={setTab}/>
      </TabsContent>
    </Tabs>
    </div>
  );
}
