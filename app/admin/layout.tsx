import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LayoutDashboard, FileUp, Users, Mail, LogOut, Home, Palmtree, Sparkles } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/retiros", label: "Retiros", icon: Palmtree },
  { href: "/admin/contenido", label: "Contenido", icon: FileUp },
  { href: "/admin/estudio", label: "Zentir Studio", icon: Sparkles },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/emails", label: "Emails", icon: Mail },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, nombre")
    .eq("user_id", user.id)
    .single();

  if (!profile || profile.role !== "admin") redirect("/biblioteca");

  return (
    <div className="min-h-screen flex bg-stone-50">
      {/* Sidebar */}
      <aside className="w-60 bg-stone-900 text-white flex flex-col min-h-screen fixed left-0 top-0">
        <div className="p-6 border-b border-stone-700">
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">Zentir Admin</p>
          <p className="font-medium text-stone-100">{profile.nombre}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-300 hover:bg-stone-800 hover:text-white transition-colors text-sm"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-stone-700 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-400 hover:bg-stone-800 hover:text-white transition-colors text-sm"
          >
            <Home className="w-4 h-4" />
            Ver sitio
          </Link>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-400 hover:bg-stone-800 hover:text-white transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-60 flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
