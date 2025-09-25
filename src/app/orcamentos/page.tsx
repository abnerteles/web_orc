import Link from "next/link";
import { auth } from "~/server/auth";

export default async function OrcamentosPage() {
  const session = await auth();

  if (!session?.user) {
    return <div>Acesso negado</div>;
  }

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
              <span className="text-sm text-gray-500">
                Bem-vindo, João
              </span>
              <Link
                href="/"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
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
              className="py-4 px-1 text-sm text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300"
            >
              Dashboard
            </Link>
            <Link
              href="/orcamentos"
              className="py-4 px-1 text-sm text-blue-600 border-b-2 border-blue-600 font-medium"
            >
              Orçamentos
            </Link>
            <Link
              href="/cadastros"
              className="py-4 px-1 text-sm text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300"
            >
              Cadastros
            </Link>
            <Link
              href="/obras"
              className="py-4 px-1 text-sm text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300"
            >
              Obras
            </Link>
            <Link
              href="/relatorios"
              className="py-4 px-1 text-sm text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300"
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
                Orçamentos
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Gerencie todos os seus orçamentos
              </p>
            </div>
            <div className="mt-3 sm:mt-0">
              <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Novo Orçamento
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-5 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Filtros
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Todos</option>
                <option>Pendente</option>
                <option>Aprovado</option>
                <option>Rejeitado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cliente
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Todos os clientes</option>
                <option>Cliente A</option>
                <option>Cliente B</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Período
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Último mês</option>
                <option>Últimos 3 meses</option>
                <option>Último ano</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Orçamentos */}
        <div className="bg-white rounded-lg shadow-sm border p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Lista de Orçamentos
          </h2>
          <div className="text-center py-12">
            <p className="text-sm text-gray-500 mb-4">
              Nenhum orçamento encontrado
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
              Criar Orçamento
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}