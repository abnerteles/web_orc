import Link from "next/link";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import AutomacaoFluxo from "./_components/AutomacaoFluxo";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    return (
      <main className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4 lg:py-6">
              <div className="flex items-center">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-800">
                  Gestão de Orçamentos
                </h1>
              </div>
              <div className="flex gap-2 sm:gap-3">
                <Link
                  href="/auth/signin"
                  className="px-3 py-2 sm:px-4 lg:px-6 lg:py-3 text-xs sm:text-sm lg:text-base font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/auth/register"
                  className="px-3 py-2 sm:px-4 lg:px-6 lg:py-3 text-xs sm:text-sm lg:text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Criar Conta
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-light text-slate-800">
              Simplifique sua
              <span className="block text-slate-600 font-normal">gestão de orçamentos</span>
            </h1>
            <p className="mt-4 sm:mt-6 lg:mt-8 max-w-xl lg:max-w-3xl mx-auto text-base sm:text-lg lg:text-xl xl:text-2xl text-slate-600 leading-relaxed">
              Crie, gerencie e acompanhe seus orçamentos e obras de forma eficiente. 
              Uma solução completa para profissionais e empresas.
            </p>
            <div className="mt-8 sm:mt-10 lg:mt-12 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 lg:gap-6">
              <Link
                href="/auth/register"
                className="px-6 py-3 sm:px-8 lg:px-10 lg:py-4 text-sm sm:text-base lg:text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
              >
                Começar Agora
              </Link>
              <Link
                href="/auth/signin"
                className="px-6 py-3 sm:px-8 lg:px-10 lg:py-4 text-sm sm:text-base lg:text-lg font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
              >
                Já tenho conta
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            <div className="text-center bg-white rounded-lg p-6 sm:p-8 lg:p-10 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-4 sm:mb-6 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-medium text-slate-800 mb-2 sm:mb-3">Orçamentos</h3>
              <p className="text-sm sm:text-base lg:text-lg text-slate-600">Crie e gerencie orçamentos detalhados com facilidade</p>
            </div>
            <div className="text-center bg-white rounded-lg p-6 sm:p-8 lg:p-10 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-4 sm:mb-6 bg-emerald-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-medium text-slate-800 mb-2 sm:mb-3">Obras</h3>
              <p className="text-sm sm:text-base lg:text-lg text-slate-600">Acompanhe o progresso e gerencie suas obras</p>
            </div>
            <div className="text-center bg-white rounded-lg p-6 sm:p-8 lg:p-10 shadow-sm border border-slate-200 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-4 sm:mb-6 bg-violet-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-medium text-slate-800 mb-2 sm:mb-3">Relatórios</h3>
              <p className="text-sm sm:text-base lg:text-lg text-slate-600">Análises detalhadas para tomada de decisões</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-slate-500">
              <p>&copy; 2024 Sistema de Gestão de Orçamentos. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </main>
    );
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-3 sm:py-4 lg:py-6">
              <div className="flex items-center">
                <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">
                  Sistema de Gestão
                </h1>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <span className="text-xs sm:text-sm lg:text-base text-gray-700 hidden sm:block">
                  Olá, {session.user?.name}
                </span>
                <Link
                  href="/api/auth/signout"
                  className="text-xs sm:text-sm lg:text-base text-gray-500 hover:text-gray-700 px-2 py-1 sm:px-3 sm:py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Sair
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white border-b overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-4 sm:space-x-6 lg:space-x-8 min-w-max sm:min-w-0">
              <Link
                href="/"
                className="border-b-2 border-blue-500 py-3 sm:py-4 px-1 sm:px-2 text-xs sm:text-sm lg:text-base font-medium text-blue-600 whitespace-nowrap"
              >
                Dashboard
              </Link>
              <Link
                href="/orcamentos"
                className="border-b-2 border-transparent py-3 sm:py-4 px-1 sm:px-2 text-xs sm:text-sm lg:text-base font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors whitespace-nowrap"
              >
                Orçamentos
              </Link>
              <Link
                href="/cadastros"
                className="border-b-2 border-transparent py-3 sm:py-4 px-1 sm:px-2 text-xs sm:text-sm lg:text-base font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors whitespace-nowrap"
              >
                Cadastros
              </Link>
              <Link
                href="/obras"
                className="border-b-2 border-transparent py-3 sm:py-4 px-1 sm:px-2 text-xs sm:text-sm lg:text-base font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors whitespace-nowrap"
              >
                Obras
              </Link>
              <Link
                href="/relatorios"
                className="border-b-2 border-transparent py-3 sm:py-4 px-1 sm:px-2 text-xs sm:text-sm lg:text-base font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors whitespace-nowrap"
              >
                Relatórios
              </Link>
            </div>
          </div>
        </nav>

        {/* Dashboard Content */}
        <div className="flex-1 max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
            {/* Cards de Estatísticas */}
            <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
              <div className="p-4 sm:p-5 lg:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-xs sm:text-sm lg:text-base font-medium">O</span>
                    </div>
                  </div>
                  <div className="ml-3 sm:ml-4 lg:ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-xs sm:text-sm lg:text-base font-medium text-gray-500 truncate">
                        Orçamentos
                      </dt>
                      <dd className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-900">
                        0
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
              <div className="p-4 sm:p-5 lg:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-xs sm:text-sm lg:text-base font-medium">A</span>
                    </div>
                  </div>
                  <div className="ml-3 sm:ml-4 lg:ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-xs sm:text-sm lg:text-base font-medium text-gray-500 truncate">
                        Aprovados
                      </dt>
                      <dd className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-900">
                        0
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
              <div className="p-4 sm:p-5 lg:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-yellow-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-xs sm:text-sm lg:text-base font-medium">O</span>
                    </div>
                  </div>
                  <div className="ml-3 sm:ml-4 lg:ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-xs sm:text-sm lg:text-base font-medium text-gray-500 truncate">
                        Obras
                      </dt>
                      <dd className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-900">
                        0
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
              <div className="p-4 sm:p-5 lg:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-xs sm:text-sm lg:text-base font-medium">C</span>
                    </div>
                  </div>
                  <div className="ml-3 sm:ml-4 lg:ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-xs sm:text-sm lg:text-base font-medium text-gray-500 truncate">
                        Clientes
                      </dt>
                      <dd className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-900">
                        0
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="bg-white shadow rounded-lg hover:shadow-md transition-shadow">
            <div className="px-4 py-5 sm:p-6 lg:p-8">
              <h3 className="text-base sm:text-lg lg:text-xl leading-6 font-medium text-gray-900 mb-4 sm:mb-6">
                Ações Rápidas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                <Link
                  href="/orcamentos/novo"
                  className="inline-flex items-center justify-center px-4 py-3 sm:px-6 lg:px-8 lg:py-4 border border-transparent text-sm sm:text-base lg:text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Novo Orçamento
                </Link>
                <Link
                  href="/cadastros/clientes"
                  className="inline-flex items-center justify-center px-4 py-3 sm:px-6 lg:px-8 lg:py-4 border border-gray-300 text-sm sm:text-base lg:text-lg font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Cadastrar Cliente
                </Link>
                <Link
                  href="/obras"
                  className="inline-flex items-center justify-center px-4 py-3 sm:px-6 lg:px-8 lg:py-4 border border-gray-300 text-sm sm:text-base lg:text-lg font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Ver Obras
                </Link>
                <Link
                  href="/relatorios"
                  className="inline-flex items-center justify-center px-4 py-3 sm:px-6 lg:px-8 lg:py-4 border border-gray-300 text-sm sm:text-base lg:text-lg font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Relatórios
                </Link>
              </div>
            </div>
          </div>

          {/* Seção de Automação */}
          <div className="mt-8">
            <AutomacaoFluxo />
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
