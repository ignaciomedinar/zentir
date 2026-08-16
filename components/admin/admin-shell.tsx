"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  FileUp,
  Users,
  Mail,
  LogOut,
  Home,
  Palmtree,
  Sparkles,
  BarChart3,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/retiros", label: "Retiros", icon: Palmtree },
  { href: "/admin/contenido", label: "Contenido", icon: FileUp },
  { href: "/admin/estudio", label: "Zentir Studio", icon: Sparkles },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/analytics", label: "Visitantes", icon: BarChart3 },
  { href: "/admin/emails", label: "Emails", icon: Mail },
];

const COLLAPSE_KEY = "zentir-admin-sidebar-collapsed";

export function AdminShell({
  profileName,
  children,
}: {
  profileName: string;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(COLLAPSE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage on mount, not derivable from props/state
    if (saved === "1") setCollapsed(true);
  }, []);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      return next;
    });
  }

  return (
    <div className="min-h-screen flex bg-stone-50">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-stone-900 text-white flex items-center justify-between px-4 z-40">
        <button onClick={() => setMobileOpen(true)} className="p-1.5 -ml-1.5" aria-label="Abrir menú">
          <Menu className="w-5 h-5" />
        </button>
        <p className="text-sm font-medium text-stone-100">Zentir Admin</p>
        <div className="w-8" />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-stone-900 text-white flex flex-col min-h-screen fixed left-0 top-0 z-50 transition-transform lg:transition-[width] duration-200 ${
          collapsed ? "lg:w-16" : "lg:w-60"
        } w-60 ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="p-6 border-b border-stone-700 flex items-center justify-between gap-2 min-h-18.25">
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">Zentir Admin</p>
              <p className="font-medium text-stone-100 truncate">{profileName}</p>
            </div>
          )}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 text-stone-400 hover:text-white shrink-0"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={toggleCollapsed}
            className="hidden lg:flex p-1 text-stone-400 hover:text-white shrink-0"
            aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
            title={collapsed ? "Expandir menú" : "Colapsar menú"}
          >
            {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? item.label : undefined}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-300 hover:bg-stone-800 hover:text-white transition-colors text-sm"
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className={collapsed ? "lg:hidden" : ""}>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-stone-700 space-y-1">
          <Link
            href="/"
            title={collapsed ? "Ver sitio" : undefined}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-400 hover:bg-stone-800 hover:text-white transition-colors text-sm"
          >
            <Home className="w-4 h-4 shrink-0" />
            <span className={collapsed ? "lg:hidden" : ""}>Ver sitio</span>
          </Link>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              title={collapsed ? "Salir" : undefined}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-400 hover:bg-stone-800 hover:text-white transition-colors text-sm"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span className={collapsed ? "lg:hidden" : ""}>Salir</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={`flex-1 p-4 sm:p-8 pt-20 lg:pt-8 min-w-0 transition-[margin] duration-200 ${
          collapsed ? "lg:ml-16" : "lg:ml-60"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
