"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Zap, 
  Disc, 
  Plus, 
  Search, 
  ChevronRight,
  Wrench,
  CalendarCheck2
} from "lucide-react";

export default function Home() {
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("TODOS");

  const kpis = [
    {
      titulo: "Tasers em Uso / Cautela",
      valor: "34 / 48",
      progresso: "70.8%",
      descricao: "Equipamentos em operação no campo",
      icone: Zap,
      corIcone: "text-indigo-600 bg-indigo-50 border-indigo-100",
    },
    {
      titulo: "Total de Cartuchos",
      valor: "112 un",
      progresso: "+12 este mês",
      descricao: "Cartuchos intactos em estoque",
      icone: Disc,
      corIcone: "text-sky-600 bg-sky-50 border-sky-100",
    },
    {
      titulo: "Em Manutenção",
      valor: "03 un",
      progresso: "Aguardando peças",
      descricao: "Enviados para assistência técnica",
      icone: Wrench,
      corIcone: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      titulo: "Validade Próxima",
      valor: "08 un",
      progresso: "Vencem em 30 dias",
      descricao: "Lotes de cartuchos sob atenção",
      icone: CalendarCheck2,
      corIcone: "text-rose-600 bg-rose-50 border-rose-100",
    },
  ];

  const inventario = [
    { id: 1, serie: "X2-908123", modelo: "Taser X2", patrimonio: "PM-17092", subunidade: "ROTAM / 17º BPM", status: "Disponível" },
    { id: 2, serie: "T7-441092", modelo: "Taser 7", patrimonio: "PM-17044", subunidade: "1ª Cia - Araucária", status: "Cautelado" },
    { id: 3, serie: "X2-110293", modelo: "Taser X2", patrimonio: "PM-17105", subunidade: "2ª Cia - Campo Largo", status: "Manutenção" },
    { id: 4, serie: "C-882091", modelo: "Cartucho 25ft", patrimonio: "Lote 2024/02", subunidade: "Reserva de Armas", status: "Vencendo" },
  ];

  return (
    <>
      {/* Header Superior Limpo */}
      <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">Painel de Controle Taser</h2>
          <p className="text-xs text-slate-500">Acompanhamento e inventário do armamento institucional</p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/cartuchos/novo">
            <button type="button" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm hover:shadow cursor-pointer">
              <Plus size={16} />
              <span>Novo Equipamento</span>
            </button>
          </Link>
        </div>
      </header>

      {/* Conteúdo com Scroll Interno */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        
        {/* Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {kpis.map((kpi, idx) => {
            const Icone = kpi.icone;
            return (
              <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className={`p-2.5 rounded-xl border ${kpi.corIcone}`}>
                    <Icone size={20} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60">
                    {kpi.progresso}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500">{kpi.titulo}</p>
                  <p className="text-2xl font-black text-slate-900 mt-1 tracking-tight">{kpi.valor}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{kpi.descricao}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabela de Resumo */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Inventário do Batalhão</h3>
              <p className="text-xs text-slate-500">Lista completa de tasers e cartuchos cadastrados</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-72">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filtrar por série ou subunidade..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                />
              </div>

              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold cursor-pointer shrink-0"
              >
                <option value="TODOS">Todos</option>
                <option value="Disponível">Disponível</option>
                <option value="Cautelado">Cautelado</option>
                <option value="Manutenção">Manutenção</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-400 font-bold border-b border-slate-100 text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Nº de Série</th>
                  <th className="px-6 py-3.5">Equipamento / Modelo</th>
                  <th className="px-6 py-3.5">Patrimônio / Lote</th>
                  <th className="px-6 py-3.5">Subunidade</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {inventario.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">{item.serie}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{item.modelo}</td>
                    <td className="px-6 py-4 font-mono text-slate-500">{item.patrimonio}</td>
                    <td className="px-6 py-4 text-slate-600">{item.subunidade}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        item.status === "Disponível" ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" :
                        item.status === "Cautelado" ? "bg-indigo-50 text-indigo-700 border border-indigo-200/60" :
                        item.status === "Manutenção" ? "bg-amber-50 text-amber-700 border border-amber-200/60" :
                        "bg-rose-50 text-rose-700 border border-rose-200/60"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/dashboard/cartuchos`}>
                        <button type="button" className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer" title="Ver Detalhes">
                          <ChevronRight size={18} />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
}