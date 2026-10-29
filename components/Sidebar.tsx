"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Disc, PackageCheck, ShieldCheck, Menu, X } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Visão Geral", icon: PackageCheck },
    { href: "/dashboard/tasers", label: "Dispositivos Taser", icon: Zap },
    { href: "/dashboard/cartuchos", label: "Cartuchos & Lotes", icon: Disc },
  ];

  return (
    <>
      {/* Botão de Menu Flutuante para Dispositivos Móveis / Tablets */}
      <div className="lg:hidden fixed top-3 left-4 z-50 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl shadow-md hover:bg-slate-50 transition-all cursor-pointer"
          aria-label="Abrir Menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Overlay Escuro para Mobile quando o menu estiver aberto */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Lateral (Gaveta no Mobile, Fixa a partir do Breakpoint 'lg') */}
      <aside
        className={`fixed lg:static top-0 left-0 z-40 h-full w-72 bg-white border-r border-slate-200/80 p-6 flex flex-col justify-between shrink-0 transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="space-y-8 mt-12 lg:mt-0">
          {/* Topo do Perfil Institucional */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-200 shrink-0">
              <Zap size={20} />
            </div>
            <div className="min-w-0">
              <h1 className="font-extrabold text-sm text-slate-900 truncate">17º BPM — PMPR</h1>
              <p className="text-[11px] text-slate-500 font-medium truncate">Gestão de Armamento</p>
            </div>
          </div>

          {/* Menus de Navegação */}
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
                Navegação Principal
              </p>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icone = item.icon;
                  const isAtivo = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 font-semibold text-xs rounded-xl transition-all ${
                        isAtivo
                          ? "bg-indigo-50/80 text-indigo-700 font-bold border border-indigo-100"
                          : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icone size={17} className={isAtivo ? "text-indigo-600" : "text-slate-400"} />
                        <span>{item.label}</span>
                      </div>
                      {isAtivo && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Card do Rodapé da Sidebar */}
        <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs mb-1">
            <ShieldCheck size={16} />
            <span>SAM — 17º BPM</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            Seção de Armamento e Munição de Menor Potencial Ofensivo.
          </p>
        </div>
      </aside>
    </>
  );
}