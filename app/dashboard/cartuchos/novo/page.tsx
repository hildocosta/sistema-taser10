"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, PlusCircle } from "lucide-react";

export default function NovoCartuchoPage() {
  const router = useRouter();
  const [salvando, setSalvando] = useState(false);

  const [formData, setFormData] = useState({
    item: "",
    descricao: "CARTUCHO TASER 25FT",
    marca: "TASER",
    modelo: "OPERACIONAL 25FT",
    numeroSerie: "",
    validade: "",
    alcance: "13,72 Metros (25ft)",
    subunidade: "Reserva de Armas / 17º BPM",
    observacao: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.numeroSerie) {
      alert("Por favor, preencha o Número de Série.");
      return;
    }

    try {
      setSalvando(true);
      const res = await fetch("/api/cartuchos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/dashboard/cartuchos");
        router.refresh();
      } else {
        const err = await res.json();
        alert(err.error || "Erro ao cadastrar cartucho.");
      }
    } catch {
      alert("Erro ao conectar com o servidor.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="flex-1 bg-[#F8FAFC] p-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header do Formulário */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/cartuchos">
              <button type="button" className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all cursor-pointer">
                <ArrowLeft size={18} />
              </button>
            </Link>
            <div>
              <h1 className="text-lg font-extrabold text-slate-900">Cadastrar Novo Cartucho</h1>
              <p className="text-xs text-slate-500">Registo de munição no estoque geral do Batalhão</p>
            </div>
          </div>
        </div>

        {/* Card do Formulário */}
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Número de Série <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="numeroSerie"
                placeholder="Ex: C882091"
                value={formData.numeroSerie}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Modelo</label>
              <input
                type="text"
                name="modelo"
                placeholder="Ex: OPERACIONAL 25FT"
                value={formData.modelo}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Data de Validade</label>
              <input
                type="date"
                name="validade"
                value={formData.validade}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Alcance / Tipo</label>
              <input
                type="text"
                name="alcance"
                value={formData.alcance}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Subunidade / Localização</label>
              <input
                type="text"
                name="subunidade"
                value={formData.subunidade}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Observações</label>
              <textarea
                name="observacao"
                rows={3}
                placeholder="Informações adicionais do lote ou estado físico..."
                value={formData.observacao}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link href="/dashboard/cartuchos">
              <button type="button" className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer">
                Cancelar
              </button>
            </Link>
            <button
              type="submit"
              disabled={salvando}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <PlusCircle size={16} />
              <span>{salvando ? "A salvar..." : "Salvar Cartucho"}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}