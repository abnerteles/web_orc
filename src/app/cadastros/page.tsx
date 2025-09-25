"use client";

import { useState } from "react";
import Link from "next/link";

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  tipo: "pessoa_fisica" | "pessoa_juridica";
  documento: string;
  dataCreacao: string;
}

interface Fornecedor {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cnpj: string;
  categoria: string;
  dataCreacao: string;
}

interface Prestador {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  especialidade: string;
  valorHora: number;
  disponibilidade: string;
  dataCreacao: string;
}

export default function CadastrosPage() {
  const [activeTab, setActiveTab] = useState<"clientes" | "fornecedores" | "prestadores">("clientes");
  const [showForm, setShowForm] = useState(false);

  // Estados para formulários
  const [clienteForm, setClienteForm] = useState<{
    nome: string;
    email: string;
    telefone: string;
    endereco: string;
    tipo: "pessoa_fisica" | "pessoa_juridica";
    documento: string;
  }>({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    tipo: "pessoa_fisica",
    documento: ""
  });

  const [fornecedorForm, setFornecedorForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    cnpj: "",
    categoria: ""
  });

  const [prestadorForm, setPrestadorForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    especialidade: "",
    valorHora: 0,
    disponibilidade: ""
  });

  const salvarCliente = () => {
    if (!clienteForm.nome || !clienteForm.email || !clienteForm.documento) {
      alert("Preencha os campos obrigatórios");
      return;
    }

    const cliente: Cliente = {
      id: Date.now().toString(),
      ...clienteForm,
      dataCreacao: new Date().toISOString()
    };

    const clientesExistentes = JSON.parse(localStorage.getItem("clientes") || "[]");
    clientesExistentes.push(cliente);
    localStorage.setItem("clientes", JSON.stringify(clientesExistentes));

    alert("Cliente cadastrado com sucesso!");
    setClienteForm({
      nome: "",
      email: "",
      telefone: "",
      endereco: "",
      tipo: "pessoa_fisica",
      documento: ""
    });
    setShowForm(false);
  };

  const salvarFornecedor = () => {
    if (!fornecedorForm.nome || !fornecedorForm.email || !fornecedorForm.cnpj) {
      alert("Preencha os campos obrigatórios");
      return;
    }

    const fornecedor: Fornecedor = {
      id: Date.now().toString(),
      ...fornecedorForm,
      dataCreacao: new Date().toISOString()
    };

    const fornecedoresExistentes = JSON.parse(localStorage.getItem("fornecedores") || "[]");
    fornecedoresExistentes.push(fornecedor);
    localStorage.setItem("fornecedores", JSON.stringify(fornecedoresExistentes));

    alert("Fornecedor cadastrado com sucesso!");
    setFornecedorForm({
      nome: "",
      email: "",
      telefone: "",
      endereco: "",
      cnpj: "",
      categoria: ""
    });
    setShowForm(false);
  };

  const salvarPrestador = () => {
    if (!prestadorForm.nome || !prestadorForm.email || !prestadorForm.especialidade) {
      alert("Preencha os campos obrigatórios");
      return;
    }

    const prestador: Prestador = {
      id: Date.now().toString(),
      ...prestadorForm,
      dataCreacao: new Date().toISOString()
    };

    const prestadoresExistentes = JSON.parse(localStorage.getItem("prestadores") || "[]");
    prestadoresExistentes.push(prestador);
    localStorage.setItem("prestadores", JSON.stringify(prestadoresExistentes));

    alert("Prestador cadastrado com sucesso!");
    setPrestadorForm({
      nome: "",
      email: "",
      telefone: "",
      especialidade: "",
      valorHora: 0,
      disponibilidade: ""
    });
    setShowForm(false);
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
              className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600"
            >
              Cadastros
            </Link>
            <Link
              href="/obras"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
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
                Cadastros
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Gerencie clientes, fornecedores e prestadores
              </p>
            </div>
            <div className="mt-3 sm:mt-0">
              <button
                onClick={() => setShowForm(!showForm)}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                {showForm ? "Cancelar" : "Novo Cadastro"}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("clientes")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "clientes"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Clientes
            </button>
            <button
              onClick={() => setActiveTab("fornecedores")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "fornecedores"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Fornecedores
            </button>
            <button
              onClick={() => setActiveTab("prestadores")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "prestadores"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Prestadores
            </button>
          </nav>
        </div>

        {/* Formulário de Cadastro */}
        {showForm && (
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Novo {activeTab === "clientes" ? "Cliente" : activeTab === "fornecedores" ? "Fornecedor" : "Prestador"}
              </h3>

              {/* Formulário Cliente */}
              {activeTab === "clientes" && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nome *
                    </label>
                    <input
                      type="text"
                      value={clienteForm.nome}
                      onChange={(e) => setClienteForm({...clienteForm, nome: e.target.value})}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={clienteForm.email}
                      onChange={(e) => setClienteForm({...clienteForm, email: e.target.value})}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Telefone
                    </label>
                    <input
                      type="text"
                      value={clienteForm.telefone}
                      onChange={(e) => setClienteForm({...clienteForm, telefone: e.target.value})}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tipo
                    </label>
                    <select
                      value={clienteForm.tipo}
                      onChange={(e) => setClienteForm({...clienteForm, tipo: e.target.value as "pessoa_fisica" | "pessoa_juridica"})}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="pessoa_fisica">Pessoa Física</option>
                      <option value="pessoa_juridica">Pessoa Jurídica</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {clienteForm.tipo === "pessoa_fisica" ? "CPF" : "CNPJ"} *
                    </label>
                    <input
                      type="text"
                      value={clienteForm.documento}
                      onChange={(e) => setClienteForm({...clienteForm, documento: e.target.value})}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Endereço
                    </label>
                    <textarea
                      rows={3}
                      value={clienteForm.endereco}
                      onChange={(e) => setClienteForm({...clienteForm, endereco: e.target.value})}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      onClick={salvarCliente}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Salvar Cliente
                    </button>
                  </div>
                </div>
              )}

              {/* Formulário Fornecedor */}
              {activeTab === "fornecedores" && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nome *
                    </label>
                    <input
                      type="text"
                      value={fornecedorForm.nome}
                      onChange={(e) => setFornecedorForm({...fornecedorForm, nome: e.target.value})}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={fornecedorForm.email}
                      onChange={(e) => setFornecedorForm({...fornecedorForm, email: e.target.value})}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Telefone
                    </label>
                    <input
                      type="text"
                      value={fornecedorForm.telefone}
                      onChange={(e) => setFornecedorForm({...fornecedorForm, telefone: e.target.value})}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      CNPJ *
                    </label>
                    <input
                      type="text"
                      value={fornecedorForm.cnpj}
                      onChange={(e) => setFornecedorForm({...fornecedorForm, cnpj: e.target.value})}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Categoria
                    </label>
                    <input
                      type="text"
                      value={fornecedorForm.categoria}
                      onChange={(e) => setFornecedorForm({...fornecedorForm, categoria: e.target.value})}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Ex: Material de construção, Ferramentas, etc."
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Endereço
                    </label>
                    <textarea
                      rows={3}
                      value={fornecedorForm.endereco}
                      onChange={(e) => setFornecedorForm({...fornecedorForm, endereco: e.target.value})}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      onClick={salvarFornecedor}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Salvar Fornecedor
                    </button>
                  </div>
                </div>
              )}

              {/* Formulário Prestador */}
              {activeTab === "prestadores" && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nome *
                    </label>
                    <input
                      type="text"
                      value={prestadorForm.nome}
                      onChange={(e) => setPrestadorForm({...prestadorForm, nome: e.target.value})}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={prestadorForm.email}
                      onChange={(e) => setPrestadorForm({...prestadorForm, email: e.target.value})}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Telefone
                    </label>
                    <input
                      type="text"
                      value={prestadorForm.telefone}
                      onChange={(e) => setPrestadorForm({...prestadorForm, telefone: e.target.value})}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Especialidade *
                    </label>
                    <input
                      type="text"
                      value={prestadorForm.especialidade}
                      onChange={(e) => setPrestadorForm({...prestadorForm, especialidade: e.target.value})}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Ex: Pedreiro, Eletricista, Pintor, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Valor por Hora
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={prestadorForm.valorHora}
                      onChange={(e) => setPrestadorForm({...prestadorForm, valorHora: parseFloat(e.target.value) || 0})}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Disponibilidade
                    </label>
                    <input
                      type="text"
                      value={prestadorForm.disponibilidade}
                      onChange={(e) => setPrestadorForm({...prestadorForm, disponibilidade: e.target.value})}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Ex: Segunda a sexta, Fins de semana, etc."
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      onClick={salvarPrestador}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Salvar Prestador
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lista de Cadastros */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Lista de {activeTab === "clientes" ? "Clientes" : activeTab === "fornecedores" ? "Fornecedores" : "Prestadores"}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Gerencie seus cadastros
            </p>
          </div>
          <div className="px-4 py-4 sm:px-6">
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Nenhum {activeTab === "clientes" ? "cliente" : activeTab === "fornecedores" ? "fornecedor" : "prestador"} encontrado
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Comece criando um novo cadastro.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Criar Cadastro
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}