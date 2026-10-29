"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  Disc, 
  Plus, 
  Search, 
  ExternalLink, 
  FileText, 
  CheckCircle2, 
  Clock,
  RefreshCw 
} from "lucide-react";
import ModalBoletim from "@/components/ModalBoletim";

interface Cartucho {
  id: string;
  numeroSerie: string;
  modelo: string | null;
  status: string;
  subunidade: string | null;
  validade: string | null;
  numeroBoletim: string | null;
  urlBoletim: string | null;
  dataUso: string | null;
}

export default function CartuchosPage() {
  const [cartuchos, setCartuchos] = useState<Cartucho[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("TODOS");
  const [cartuchoSelecionado, setCartuchoSelecionado] = useState<Cartucho | null>(null);

  const carregarCartuchos = useCallback(async () => {
    try {
      setCarregando(true);
      const res = await fetch("/api/cartuchos");
      if (res.ok) {
        const data = await res.json();
        setCartuchos(data);
      }
    } catch {
      console.error("Erro ao carregar cartuchos.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    let ativo = true;

    async function buscarDados() {
      try {
        const res = await fetch("/api/cartuchos");
        if (res.ok && ativo) {
          const data = await res.json();
          setCartuchos(data);
        }
      } catch {
        console.error("Erro ao carregar cartuchos.");
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    buscarDados();

    return () => {
      ativo = false;
    };
  }, []);

  const cartuchosFiltrados = cartuchos.filter((item) => {
    const atendeBusca =
      item.numeroSerie.toLowerCase().includes(busca.toLowerCase()) ||
      (item.subunidade && item.subunidade.toLowerCase().includes(busca.toLowerCase())) ||
      (item.numeroBoletim && item.numeroBoletim.toLowerCase().includes(busca.toLowerCase()));

    const atendeStatus = filtroStatus === "TODOS" || item.status === filtroStatus;

    return atendeBusca && atendeStatus;
  });

  const totalDisponiveis = cartuchos.filter((c) => c.status === "Disponível").length;
  const totalUtilizados = cartuchos.filter((c) => c.status === "Utilizado").length;

  return (
    <div className="flex-1 bg-[#F8FAFC] flex flex-col h-full overflow-hidden">
      {/* Header Fixo */}
      <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-6 lg:px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Disc size={20} />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900">Gestão de Cartuchos</h1>
            <p className="text-xs text-slate-500">Estoque global e controle de emprego operacional</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={carregarCartuchos}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all cursor-pointer"
            title="Atualizar lista"
          >
            <RefreshCw size={16} className={carregando ? "animate-spin" : ""} />
          </button>
          <Link href="/dashboard/cartuchos/novo">
            <button
              type="button"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Novo Cartucho</span>
            </button>
          </Link>
        </div>
      </header>

      {/* Conteúdo com Rolagem */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
        {/* Cards Resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
              <Disc size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Total no Sistema</p>
              <p className="text-xl font-extrabold text-slate-900">{cartuchos.length}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Disponíveis em Estoque</p>
              <p className="text-xl font-extrabold text-emerald-600">{totalDisponiveis}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Utilizados em Ocorrência</p>
              <p className="text-xl font-extrabold text-amber-600">{totalUtilizados}</p>
            </div>
          </div>
        </div>

        {/* Tabela com Barra de Pesquisa */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nº de série, subunidade ou BO..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
              />
            </div>

            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="w-full sm:w-auto bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold cursor-pointer"
            >
              <option value="TODOS">Todos os Status</option>
              <option value="Disponível">Disponível</option>
              <option value="Utilizado">Utilizado</option>
              <option value="Danificado">Danificado</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-400 font-bold border-b border-slate-100 text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Nº de Série</th>
                  <th className="px-6 py-3.5">Modelo</th>
                  <th className="px-6 py-3.5">Subunidade</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Boletim de Ocorrência</th>
                  <th className="px-6 py-3.5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {carregando ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                      Carregando cartuchos...
                    </td>
                  </tr>
                ) : cartuchosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                      Nenhum cartucho encontrado.
                    </td>
                  </tr>
                ) : (
                  cartuchosFiltrados.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-900">{c.numeroSerie}</td>
                      <td className="px-6 py-4 text-slate-600">{c.modelo || "—"}</td>
                      <td className="px-6 py-4 text-slate-600">{c.subunidade || "—"}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            c.status === "Disponível"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                              : c.status === "Utilizado"
                              ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                              : "bg-rose-50 text-rose-700 border border-rose-200/60"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {c.numeroBoletim ? (
                          <div className="flex items-center gap-2 font-mono text-slate-800">
                            <FileText size={14} className="text-slate-400" />
                            <span>{c.numeroBoletim}</span>
                            {c.urlBoletim && (
                              <a
                                href={c.urlBoletim}
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-600 hover:text-indigo-800 p-1"
                                title="Abrir no Google Drive / eProtocolo"
                              >
                                <ExternalLink size={13} />
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Sem registro</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setCartuchoSelecionado(c)}
                          className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                        >
                          Gerenciar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Atualização de Status / Boletim */}
      {cartuchoSelecionado && (
        <ModalBoletim
          cartucho={cartuchoSelecionado}
          onClose={() => setCartuchoSelecionado(null)}
          onSuccess={carregarCartuchos}
        />
      )}
    </div>
  );
}