"use client";

import { useState, useEffect } from "react";

interface Orcamento {
  id: string;
  cliente: string;
  obra: string;
  descricao: string;
  valor: number;
  status: string;
  dataInicio: string;
  dataFim: string;
  formaPagamento: string;
  observacoes: string;
  itens: Array<{
    id: string;
    descricao: string;
    quantidade: number;
    unidade: string;
    valorUnitario: number;
    valorTotal: number;
  }>;
}

interface Obra {
  id: string;
  nome: string;
  cliente: string;
  endereco: string;
  responsavel: string;
  dataInicio: string;
  dataFim: string;
  status: string;
  orcamento: number;
  gastoAtual: number;
  observacoes: string;
  etapas: Array<{
    id: string;
    nome: string;
    descricao: string;
    dataInicio: string;
    dataFim: string;
    status: string;
    responsavel: string;
    custo: number;
  }>;
}

interface AutomacaoFluxoProps {
  orcamentoId?: string;
  onObraCriada?: (obra: Obra) => void;
}

export default function AutomacaoFluxo({ orcamentoId, onObraCriada }: AutomacaoFluxoProps) {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [orcamentoSelecionado, setOrcamentoSelecionado] = useState<string>(orcamentoId || "");
  const [configuracaoAutomatica, setConfiguracaoAutomatica] = useState({
    criarObraAutomaticamente: true,
    gerarEtapasBasicas: true,
    definirResponsavelPadrao: true,
    enviarNotificacoes: true,
    responsavelPadrao: "",
    etapasTemplate: [
      { nome: "Preparação do terreno", duracao: 5 },
      { nome: "Fundação", duracao: 10 },
      { nome: "Estrutura", duracao: 15 },
      { nome: "Alvenaria", duracao: 12 },
      { nome: "Cobertura", duracao: 8 },
      { nome: "Instalações", duracao: 10 },
      { nome: "Acabamentos", duracao: 20 },
      { nome: "Limpeza final", duracao: 3 }
    ]
  });
  const [processandoAutomacao, setProcessandoAutomacao] = useState(false);

  useEffect(() => {
    carregarOrcamentos();
  }, []);

  const carregarOrcamentos = () => {
    try {
      const orcamentosStorage = localStorage.getItem("orcamentos");
      if (orcamentosStorage) {
        const orcamentosData = JSON.parse(orcamentosStorage);
        // Filtrar apenas orçamentos aprovados
        const orcamentosAprovados = orcamentosData.filter((orc: Orcamento) => orc.status === "aprovado");
        setOrcamentos(orcamentosAprovados);
      }
    } catch (error) {
      console.error("Erro ao carregar orçamentos:", error);
    }
  };

  const calcularDataFim = (dataInicio: string, duracaoDias: number): string => {
    const data = new Date(dataInicio);
    data.setDate(data.getDate() + duracaoDias);
    return data.toISOString().split('T')[0] || '';
  };

  const criarObraAutomatica = async () => {
    if (!orcamentoSelecionado) {
      alert("Selecione um orçamento para criar a obra");
      return;
    }

    setProcessandoAutomacao(true);

    try {
      const orcamento = orcamentos.find(orc => orc.id === orcamentoSelecionado);
      if (!orcamento) {
        throw new Error("Orçamento não encontrado");
      }

      // Criar nova obra baseada no orçamento
      const novaObra: Obra = {
        id: Date.now().toString(),
        nome: orcamento.obra,
        cliente: orcamento.cliente,
        endereco: "", // Será preenchido posteriormente
        responsavel: configuracaoAutomatica.responsavelPadrao,
        dataInicio: new Date().toISOString().split('T')[0] || '',
        dataFim: calcularDataFim(new Date().toISOString().split('T')[0] || '', 
          configuracaoAutomatica.etapasTemplate.reduce((total, etapa) => total + etapa.duracao, 0)),
        status: "planejamento",
        orcamento: orcamento.valor,
        gastoAtual: 0,
        observacoes: `Obra criada automaticamente a partir do orçamento ${orcamento.id}`,
        etapas: []
      };

      // Gerar etapas automáticas se configurado
      if (configuracaoAutomatica.gerarEtapasBasicas) {
        let dataAtual = new Date(novaObra.dataInicio);
        
        novaObra.etapas = configuracaoAutomatica.etapasTemplate.map((template, index) => {
          const dataInicioEtapa = new Date(dataAtual);
          dataAtual.setDate(dataAtual.getDate() + template.duracao);
          const dataFimEtapa = new Date(dataAtual);

          return {
            id: `${novaObra.id}-etapa-${index + 1}`,
            nome: template.nome,
            descricao: `Etapa ${index + 1}: ${template.nome}`,
            dataInicio: dataInicioEtapa.toISOString().split('T')[0] || '',
            dataFim: dataFimEtapa.toISOString().split('T')[0] || '',
            status: index === 0 ? "pendente" : "nao_iniciada",
            responsavel: configuracaoAutomatica.responsavelPadrao,
            custo: Math.round(orcamento.valor / configuracaoAutomatica.etapasTemplate.length)
          };
        });
      }

      // Salvar obra no localStorage
      const obrasStorage = localStorage.getItem("obras");
      const obras = obrasStorage ? JSON.parse(obrasStorage) : [];
      obras.push(novaObra);
      localStorage.setItem("obras", JSON.stringify(obras));

      // Atualizar status do orçamento para "em_execucao"
      const orcamentosStorage = localStorage.getItem("orcamentos");
      if (orcamentosStorage) {
        const orcamentosData = JSON.parse(orcamentosStorage);
        const orcamentoIndex = orcamentosData.findIndex((orc: Orcamento) => orc.id === orcamentoSelecionado);
        if (orcamentoIndex !== -1) {
          orcamentosData[orcamentoIndex].status = "em_execucao";
          localStorage.setItem("orcamentos", JSON.stringify(orcamentosData));
        }
      }

      // Callback para notificar criação da obra
      if (onObraCriada) {
        onObraCriada(novaObra);
      }

      alert(`Obra "${novaObra.nome}" criada com sucesso! ${novaObra.etapas.length} etapas foram geradas automaticamente.`);
      
      // Limpar seleção
      setOrcamentoSelecionado("");
      carregarOrcamentos();

    } catch (error) {
      console.error("Erro ao criar obra automática:", error);
      alert("Erro ao criar obra. Tente novamente.");
    } finally {
      setProcessandoAutomacao(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Automatização: Orçamento → Obra
        </h3>

        {/* Seleção de Orçamento */}
        <div className="mb-6">
          <label htmlFor="orcamento" className="block text-sm font-medium text-gray-700 mb-2">
            Selecionar Orçamento Aprovado
          </label>
          <select
            id="orcamento"
            value={orcamentoSelecionado}
            onChange={(e) => setOrcamentoSelecionado(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Selecione um orçamento...</option>
            {orcamentos.map((orcamento) => (
              <option key={orcamento.id} value={orcamento.id}>
                {orcamento.cliente} - {orcamento.obra} (R$ {orcamento.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
              </option>
            ))}
          </select>
        </div>

        {/* Configurações de Automação */}
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-900 mb-3">Configurações de Automação</h4>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="criarObraAutomaticamente"
                type="checkbox"
                checked={configuracaoAutomatica.criarObraAutomaticamente}
                onChange={(e) => setConfiguracaoAutomatica(prev => ({
                  ...prev,
                  criarObraAutomaticamente: e.target.checked
                }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="criarObraAutomaticamente" className="ml-2 block text-sm text-gray-900">
                Criar obra automaticamente
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="gerarEtapasBasicas"
                type="checkbox"
                checked={configuracaoAutomatica.gerarEtapasBasicas}
                onChange={(e) => setConfiguracaoAutomatica(prev => ({
                  ...prev,
                  gerarEtapasBasicas: e.target.checked
                }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="gerarEtapasBasicas" className="ml-2 block text-sm text-gray-900">
                Gerar etapas básicas automaticamente
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="definirResponsavelPadrao"
                type="checkbox"
                checked={configuracaoAutomatica.definirResponsavelPadrao}
                onChange={(e) => setConfiguracaoAutomatica(prev => ({
                  ...prev,
                  definirResponsavelPadrao: e.target.checked
                }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="definirResponsavelPadrao" className="ml-2 block text-sm text-gray-900">
                Definir responsável padrão
              </label>
            </div>

            {configuracaoAutomatica.definirResponsavelPadrao && (
              <div className="ml-6">
                <label htmlFor="responsavelPadrao" className="block text-sm font-medium text-gray-700 mb-1">
                  Responsável Padrão
                </label>
                <input
                  type="text"
                  id="responsavelPadrao"
                  value={configuracaoAutomatica.responsavelPadrao}
                  onChange={(e) => setConfiguracaoAutomatica(prev => ({
                    ...prev,
                    responsavelPadrao: e.target.value
                  }))}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Nome do responsável padrão"
                />
              </div>
            )}

            <div className="flex items-center">
              <input
                id="enviarNotificacoes"
                type="checkbox"
                checked={configuracaoAutomatica.enviarNotificacoes}
                onChange={(e) => setConfiguracaoAutomatica(prev => ({
                  ...prev,
                  enviarNotificacoes: e.target.checked
                }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="enviarNotificacoes" className="ml-2 block text-sm text-gray-900">
                Enviar notificações automáticas
              </label>
            </div>
          </div>
        </div>

        {/* Template de Etapas */}
        {configuracaoAutomatica.gerarEtapasBasicas && (
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-900 mb-3">Template de Etapas</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {configuracaoAutomatica.etapasTemplate.map((etapa, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{etapa.nome}</span>
                    <span className="text-gray-500">{etapa.duracao} dias</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-gray-900">
                    {configuracaoAutomatica.etapasTemplate.reduce((total, etapa) => total + etapa.duracao, 0)} dias
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botão de Ação */}
        <div className="flex justify-end">
          <button
            onClick={criarObraAutomatica}
            disabled={!orcamentoSelecionado || processandoAutomacao}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processandoAutomacao ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando...
              </>
            ) : (
              "Criar Obra Automaticamente"
            )}
          </button>
        </div>

        {/* Informações sobre o processo */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Como funciona a automação
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>O orçamento aprovado será usado como base para criar a obra</li>
                  <li>Etapas padrão serão criadas automaticamente com cronograma</li>
                  <li>O status do orçamento será alterado para "em execução"</li>
                  <li>Responsáveis serão atribuídos conforme configuração</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}