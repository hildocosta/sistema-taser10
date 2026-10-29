"use client";

import React, { useState } from "react";
import { X, FileText, Link as LinkIcon, CheckCircle2, AlertTriangle } from "lucide-react";

interface Cartucho {
  id: string;
  numeroSerie: string;
  modelo: string | null;
  status: string;
  subunidade: string | null;
  numeroBoletim: string | null;
  urlBoletim: string | null;
}

interface ModalBoletimProps {
  cartucho: Cartucho;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalBoletim({ cartucho, onClose, onSuccess }: ModalBoletimProps) {
  const [status, setStatus] = useState(cartucho.status || "Disponível");
  const [numeroBoletim, setNumeroBoletim] = useState(cartucho.numeroBoletim || "");
  const [urlBoletim, setUrlBoletim] = useState(cartucho.urlBoletim || "");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    // Validação obrigatória do Boletim quando status for "Utilizado"
    if (status === "Utilizado" && !numeroBoletim.trim()) {
      setErro("O número do Boletim de Ocorrência é obrigatório para cartuchos utilizados.");
      return;
    }

    try {
      setSalvando(true);
      const res = await fetch(`/api/cartuchos/${cartucho.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          numeroBoletim: status === "Utilizado" ? numeroBoletim : null,
          urlBoletim: status === "Utilizado" ? urlBoletim : null,
          dataUso: status === "Utilizado" ? new Date().toISOString() : null,
        }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const data = await res.json();
        setErro(data.error || "Erro ao atualizar o registro do cartucho.");
      }
    } catch {
      setErro("Falha de conexão com o servidor.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabeçalho do Modal */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <FileText size={18} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">Gerenciar Cartucho</h2>
              <p className="text-xs font-mono text-slate-500">Série: {cartucho.numeroSerie}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {erro && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-rose-700 text-xs font-medium">
              <AlertTriangle size={16} className="shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          {/* Seleção de Status */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Status do Cartucho
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Disponível", "Utilizado", "Danificado"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setStatus(item)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer text-center ${
                    status === item
                      ? item === "Disponível"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs"
                        : item === "Utilizado"
                        ? "bg-amber-50 text-amber-700 border-amber-300 shadow-xs"
                        : "bg-rose-50 text-rose-700 border-rose-300 shadow-xs"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Campos condicionais quando o status for "Utilizado" */}
          {status === "Utilizado" && (
            <div className="space-y-4 pt-2 border-t border-slate-100 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nº do Boletim de Ocorrência (B.O.) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <FileText size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Ex: 2026/123456"
                    value={numeroBoletim}
                    onChange={(e) => setNumeroBoletim(e.target.value)}
                    required={status === "Utilizado"}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-9 pr-4 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Link de Visualização (eProtocolo / Google Drive PMPR)
                </label>
                <div className="relative">
                  <LinkIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="url"
                    placeholder="https://drive.google.com/file/d/..."
                    value={urlBoletim}
                    onChange={(e) => setUrlBoletim(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  URL para acesso direto ao documento do eProtocolo ou Google Drive institucional.
                </p>
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 size={16} />
              <span>{salvando ? "A salvar..." : "Atualizar Registro"}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}