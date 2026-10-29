"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  Shield, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  RefreshCw 
} from "lucide-react";

interface Taser {
  id: string;
  numeroSerie: string;
  modelo: string | null;
  patrimonio: string | null;
  status: string;
  subunidade: string | null;
  observacao: string | null;
}

export default function TasersPage() {
  const [tasers, setTasers] = useState<Taser[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("TODOS");

  const carregarTasers = useCallback(async () => {
    try {
      setCarregando(true);
      const res = await fetch("/api/tasers");
      if (res.ok) {
        const data = await res.json();
        setTasers(data);
      }
    } catch {
      console.error("Erro ao carregar tasers.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    let ativo = true;

    async function buscarDados() {
      try {
        const res = await fetch("/api/tasers");
        if (res.ok && ativo) {
          const data = await res.json();
          setTasers(data);
        }
      } catch {
        console.error("Erro ao carregar tasers.");
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

  const tasersFiltrados = tasers.filter((item) => {
    const atendeBusca =
      item.numeroSerie.toLowerCase().includes(busca.toLowerCase()) ||
      (item.patrimonio && item.patrimonio.toLowerCase().includes(busca.toLowerCase())) ||
      (item.subunidade && item.subunidade.toLowerCase().includes(busca.toLowerCase()));

    const atendeStatus = filtroStatus === "TODOS" || item.status === filtroStatus;

    return atendeBusca && atendeStatus;
  });

  const totalDisponiveis = tasers.filter((t) => t.status === "Disponível").length;
  const totalEmUso = tasers.filter((t) => t.status === "EmUso" || t.status === "Em Uso").length;

  return (
    <div className="flex-1 bg-[#F8FAFC] flex flex-col h-full overflow-hidden">
      {/* Header Fixo */}
      <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-6 lg:px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Shield size={20} />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900">Gestão de Tasers</h1>
            <p className="text-xs text-slate-500">Dispositivos de condutividade elétrica do Batalhão</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={carregarTasers}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all cursor-pointer"
            title="Atualizar lista"
          >
            <RefreshCw size={16} className={carregando ? "animate-spin" : ""} />
          </button>
          <Link href="/dashboard/tasers/novo">
            <button
              type="button"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Novo Taser</span>
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
              <Shield size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Total Cautelado</p>
              <p className="text-xl font-extrabold text-slate-900">{tasers.length}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Disponíveis Reserva</p>
              <p className="text-xl font-extrabold text-emerald-600">{totalDisponiveis}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Em Uso Operacional</p>
              <p className="text-xl font-extrabold text-amber-600">{totalEmUso}</p>
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
                placeholder="Buscar por nº de série, patrimônio ou subunidade..."
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
              <option value="EmUso">Em Uso</option>
              <option value="Manutencao">Manutenção</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-400 font-bold border-b border-slate-100 text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Nº de Série</th>
                  <th className="px-6 py-3.5">Modelo</th>
                  <th className="px-6 py-3.5">Patrimônio</th>
                  <th className="px-6 py-3.5">Subunidade</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {carregando ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                      Carregando equipamentos...
                    </td>
                  </tr>
                ) : tasersFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                      Nenhum Taser encontrado.
                    </td>
                  </tr>
                ) : (
                  tasersFiltrados.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-900">{t.numeroSerie}</td>
                      <td className="px-6 py-4 text-slate-600">{t.modelo || "TASER 10"}</td>
                      <td className="px-6 py-4 font-mono text-slate-600">{t.patrimonio || "—"}</td>
                      <td className="px-6 py-4 text-slate-600">{t.subunidade || "Reserva de Armas"}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            t.status === "Disponível"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                              : t.status === "EmUso" || t.status === "Em Uso"
                              ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                              : "bg-rose-50 text-rose-700 border border-rose-200/60"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}