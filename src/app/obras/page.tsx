"use client";

import { useState } from "react";
import Link from "next/link";

interface Obra {
  id: string;
  nome: string;
  cliente: string;
  endereco: string;
  dataInicio: string;
  dataPrevisaoTermino: string;
  status: "planejamento" | "em_andamento" | "pausada" | "concluida" | "cancelada";
  valorOrcamento: number;
  valorExecutado: number;
  progresso: number;
  responsavel: string;
  observacoes: string;
  dataCreacao: string;
}

interface EtapaObra {
  id: string;
  obraId: string;
  nome: string;
  descricao: string;
  dataInicio: string;
  dataPrevisaoTermino: string;
  status: "pendente" | "em_andamento" | "concluida";
  progresso: number;
  responsavel: string;
  valorPrevisto: number;
  valorExecutado: number;
}

export default function ObrasPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedObra, setSelectedObra] = useState<string | null>(null);

  const [obraForm, setObraForm] = useState({
    nome: "",
    cliente: "",
    endereco: "",
    dataInicio: "",
    dataPrevisaoTermino: "",
    valorOrcamento: 0,
    responsavel: "",
    observacoes: ""
  });

  const salvarObra = () => {
    if (!obraForm.nome || !obraForm.cliente || !obraForm.dataInicio) {
      alert("Preencha os campos obrigatórios");
      return;
    }

    const obra: Obra = {
      id: Date.now().toString(),
      ...obraForm,
      status: "planejamento",
      valorExecutado: 0,
      progresso: 0,
      dataCreacao: new Date().toISOString()
    };

    const obrasExistentes = JSON.parse(localStorage.getItem("obras") || "[]");
    obrasExistentes.push(obra);
    localStorage.setItem("obras", JSON.stringify(obrasExistentes));

    alert("Obra cadastrada com sucesso!");
    setObraForm({
      nome: "",
      cliente: "",
      endereco: "",
      dataInicio: "",
      dataPrevisaoTermino: "",
      valorOrcamento: 0,
      responsavel: "",
      observacoes: ""
    });
    setShowForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planejamento":
        return "bg-gray-100 text-gray-800";
      case "em_andamento":
        return "bg-blue-100 text-blue-800";
      case "pausada":
        return "bg-yellow-100 text-yellow-800";
      case "concluida":
        return "bg-green-100 text-green-800";
      case "cancelada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "planejamento":
        return "Planejamento";
      case "em_andamento":
        return "Em Andamento";
      case "pausada":
        return "Pausada";
      case "concluida":
        return "Concluída";
      case "cancelada":
        return "Cancelada";
      default:
        return status;
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Sistema de Gestão
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/api/auth/signout"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sair
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link
              href="/"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Dashboard
            </Link>
            <Link
              href="/orcamentos"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Orçamentos
            </Link>
            <Link
              href="/cadastros"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Cadastros
            </Link>
            <Link
              href="/obras"
              className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600"
            >
              Obras
            </Link>
            <Link
              href="/relatorios"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Relatórios
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestão de Obras
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Acompanhe o progresso e gerencie suas obras
              </p>
            </div>
            <div className="mt-3 sm:mt-0">
              <button
                onClick={() => setShowForm(!showForm)}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                {showForm ? "Cancelar" : "Nova Obra"}
              </button>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
              <div>
                <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="statusFilter"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Todos</option>
                  <option value="planejamento">Planejamento</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="pausada">Pausada</option>
                  <option value="concluida">Concluída</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
              <div>
                <label htmlFor="clienteFilter" className="block text-sm font-medium text-gray-700">
                  Cliente
                </label>
                <input
                  type="text"
                  id="clienteFilter"
                  placeholder="Buscar por cliente..."
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="responsavelFilter" className="block text-sm font-medium text-gray-700">
                  Responsável
                </label>
                <input
                  type="text"
                  id="responsavelFilter"
                  placeholder="Buscar por responsável..."
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="periodoFilter" className="block text-sm font-medium text-gray-700">
                  Período
                </label>
                <select
                  id="periodoFilter"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Todos</option>
                  <option value="mes">Este mês</option>
                  <option value="trimestre">Este trimestre</option>
                  <option value="ano">Este ano</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário de Nova Obra */}
        {showForm && (
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Nova Obra
              </h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nome da Obra *
                  </label>
                  <input
                    type="text"
                    value={obraForm.nome}
                    onChange={(e) => setObraForm({...obraForm, nome: e.target.value})}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cliente *
                  </label>
                  <input
                    type="text"
                    value={obraForm.cliente}
                    onChange={(e) => setObraForm({...obraForm, cliente: e.target.value})}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Endereço
                  </label>
                  <input
                    type="text"
                    value={obraForm.endereco}
                    onChange={(e) => setObraForm({...obraForm, endereco: e.target.value})}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Data de Início *
                  </label>
                  <input
                    type="date"
                    value={obraForm.dataInicio}
                    onChange={(e) => setObraForm({...obraForm, dataInicio: e.target.value})}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Previsão de Término
                  </label>
                  <input
                    type="date"
                    value={obraForm.dataPrevisaoTermino}
                    onChange={(e) => setObraForm({...obraForm, dataPrevisaoTermino: e.target.value})}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Valor do Orçamento
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={obraForm.valorOrcamento}
                    onChange={(e) => setObraForm({...obraForm, valorOrcamento: parseFloat(e.target.value) || 0})}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Responsável
                  </label>
                  <input
                    type="text"
                    value={obraForm.responsavel}
                    onChange={(e) => setObraForm({...obraForm, responsavel: e.target.value})}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Observações
                  </label>
                  <textarea
                    rows={3}
                    value={obraForm.observacoes}
                    onChange={(e) => setObraForm({...obraForm, observacoes: e.target.value})}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    onClick={salvarObra}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Salvar Obra
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Obras */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Lista de Obras
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Acompanhe o progresso de todas as suas obras
            </p>
          </div>
          <div className="px-4 py-4 sm:px-6">
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma obra encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comece criando uma nova obra.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Criar Obra
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total de Obras
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      0
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Em Andamento
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      0
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Atrasadas
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      0
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Concluídas
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      0
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}