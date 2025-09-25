"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ItemOrcamento {
  id: string;
  descricao: string;
  quantidade: number;
  unidade: string;
  valorUnitario: number;
  valorTotal: number;
}

export default function NovoOrcamentoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Estados do formulário
  const [cliente, setCliente] = useState("");
  const [obra, setObra] = useState("");
  const [descricao, setDescricao] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [prazoEntrega, setPrazoEntrega] = useState("");
  const [validadeOrcamento, setValidadeOrcamento] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("");
  
  // Estados dos itens
  const [itens, setItens] = useState<ItemOrcamento[]>([]);
  const [novoItem, setNovoItem] = useState({
    descricao: "",
    quantidade: 1,
    unidade: "UN",
    valorUnitario: 0
  });

  const adicionarItem = () => {
    if (!novoItem.descricao || novoItem.valorUnitario <= 0) {
      alert("Preencha a descrição e valor unitário do item");
      return;
    }

    const item: ItemOrcamento = {
      id: Date.now().toString(),
      descricao: novoItem.descricao,
      quantidade: novoItem.quantidade,
      unidade: novoItem.unidade,
      valorUnitario: novoItem.valorUnitario,
      valorTotal: novoItem.quantidade * novoItem.valorUnitario
    };

    setItens([...itens, item]);
    setNovoItem({
      descricao: "",
      quantidade: 1,
      unidade: "UN",
      valorUnitario: 0
    });
  };

  const removerItem = (id: string) => {
    setItens(itens.filter(item => item.id !== id));
  };

  const calcularTotal = () => {
    return itens.reduce((total, item) => total + item.valorTotal, 0);
  };

  const salvarOrcamento = async () => {
    if (!cliente || !obra || itens.length === 0) {
      alert("Preencha os campos obrigatórios e adicione pelo menos um item");
      return;
    }

    setLoading(true);

    try {
      const orcamento = {
        id: Date.now().toString(),
        cliente,
        obra,
        descricao,
        observacoes,
        prazoEntrega,
        validadeOrcamento,
        formaPagamento,
        itens,
        valorTotal: calcularTotal(),
        status: "rascunho",
        dataCreacao: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString()
      };

      // Salvar no localStorage (temporário)
      const orcamentosExistentes: any[] = JSON.parse(localStorage.getItem("orcamentos") ?? "[]") as any[];
      orcamentosExistentes.push(orcamento);
      localStorage.setItem("orcamentos", JSON.stringify(orcamentosExistentes));

      alert("Orçamento salvo com sucesso!");
      router.push("/orcamentos");
    } catch (error) {
      console.error("Erro ao salvar orçamento:", error);
      alert("Erro ao salvar orçamento");
    } finally {
      setLoading(false);
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
              className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600"
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
                Novo Orçamento
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Crie um novo orçamento para seus clientes
              </p>
            </div>
            <div className="mt-3 sm:mt-0 flex space-x-3">
              <Link
                href="/orcamentos"
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium"
              >
                Cancelar
              </Link>
              <button
                onClick={salvarOrcamento}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
              >
                {loading ? "Salvando..." : "Salvar Orçamento"}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Informações Gerais */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Informações Gerais
              </h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="cliente" className="block text-sm font-medium text-gray-700">
                    Cliente *
                  </label>
                  <input
                    type="text"
                    name="cliente"
                    id="cliente"
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Nome do cliente"
                  />
                </div>
                <div>
                  <label htmlFor="obra" className="block text-sm font-medium text-gray-700">
                    Obra *
                  </label>
                  <input
                    type="text"
                    name="obra"
                    id="obra"
                    value={obra}
                    onChange={(e) => setObra(e.target.value)}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Nome da obra"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
                    Descrição
                  </label>
                  <textarea
                    id="descricao"
                    name="descricao"
                    rows={3}
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Descrição do orçamento"
                  />
                </div>
                <div>
                  <label htmlFor="prazoEntrega" className="block text-sm font-medium text-gray-700">
                    Prazo de Entrega
                  </label>
                  <input
                    type="date"
                    name="prazoEntrega"
                    id="prazoEntrega"
                    value={prazoEntrega}
                    onChange={(e) => setPrazoEntrega(e.target.value)}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="validadeOrcamento" className="block text-sm font-medium text-gray-700">
                    Validade do Orçamento
                  </label>
                  <input
                    type="date"
                    name="validadeOrcamento"
                    id="validadeOrcamento"
                    value={validadeOrcamento}
                    onChange={(e) => setValidadeOrcamento(e.target.value)}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="formaPagamento" className="block text-sm font-medium text-gray-700">
                    Forma de Pagamento
                  </label>
                  <input
                    type="text"
                    name="formaPagamento"
                    id="formaPagamento"
                    value={formaPagamento}
                    onChange={(e) => setFormaPagamento(e.target.value)}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Ex: À vista, 30 dias, etc."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Adicionar Item */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Adicionar Item
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
                <div className="sm:col-span-2">
                  <label htmlFor="itemDescricao" className="block text-sm font-medium text-gray-700">
                    Descrição
                  </label>
                  <input
                    type="text"
                    id="itemDescricao"
                    value={novoItem.descricao}
                    onChange={(e) => setNovoItem({...novoItem, descricao: e.target.value})}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Descrição do item"
                  />
                </div>
                <div>
                  <label htmlFor="itemQuantidade" className="block text-sm font-medium text-gray-700">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    id="itemQuantidade"
                    min="1"
                    step="0.01"
                    value={novoItem.quantidade}
                    onChange={(e) => setNovoItem({...novoItem, quantidade: parseFloat(e.target.value) || 1})}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="itemUnidade" className="block text-sm font-medium text-gray-700">
                    Unidade
                  </label>
                  <select
                    id="itemUnidade"
                    value={novoItem.unidade}
                    onChange={(e) => setNovoItem({...novoItem, unidade: e.target.value})}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="UN">UN</option>
                    <option value="M">M</option>
                    <option value="M²">M²</option>
                    <option value="M³">M³</option>
                    <option value="KG">KG</option>
                    <option value="L">L</option>
                    <option value="H">H</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="itemValor" className="block text-sm font-medium text-gray-700">
                    Valor Unitário
                  </label>
                  <input
                    type="number"
                    id="itemValor"
                    min="0"
                    step="0.01"
                    value={novoItem.valorUnitario}
                    onChange={(e) => setNovoItem({...novoItem, valorUnitario: parseFloat(e.target.value) || 0})}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={adicionarItem}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Adicionar Item
                </button>
              </div>
            </div>
          </div>

          {/* Lista de Itens */}
          {itens.length > 0 && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Itens do Orçamento
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Descrição
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Qtd
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Unidade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valor Unit.
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {itens.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.descricao}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.quantidade}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.unidade}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            R$ {item.valorUnitario.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            R$ {item.valorTotal.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <button
                              onClick={() => removerItem(item.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Remover
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                          Total Geral:
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          R$ {calcularTotal().toFixed(2)}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Observações */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Observações
              </h3>
              <textarea
                id="observacoes"
                name="observacoes"
                rows={4}
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder="Observações adicionais sobre o orçamento"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}