import { createFileRoute, Outlet, redirect, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { VoiceOrb } from "@/components/VoiceOrb";
import {
  Sparkles,
  LayoutDashboard,
  Mail,
  Calendar,
  HardDrive,
  FileText,
  Sheet,
  CheckSquare,
  Users,
  Bot,
  Activity,
  Settings,
  LogOut,
  Presentation,
  ClipboardList,
  Rss,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/ocktavus")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AuthedLayout,
});

type NavItem = { to: string; label: string; icon: any };

const nav: NavItem[] = [
  { to: "/ocktavus", label: "Cockpit", icon: LayoutDashboard },
  { to: "/ocktavus/agent", label: "Agent", icon: Bot },
  { to: "/ocktavus/gmail", label: "Gmail", icon: Mail },
  { to: "/ocktavus/calendar", label: "Agenda", icon: Calendar },
  { to: "/ocktavus/drive", label: "Drive", icon: HardDrive },
  { to: "/ocktavus/docs", label: "Docs", icon: FileText },
  { to: "/ocktavus/sheets", label: "Sheets", icon: Sheet },
  { to: "/ocktavus/slides", label: "Slides", icon: Presentation },
  { to: "/ocktavus/forms", label: "Forms", icon: ClipboardList },
  { to: "/ocktavus/blogger", label: "Blogger", icon: Rss },
  { to: "/ocktavus/tasks", label: "Tâches", icon: CheckSquare },
  { to: "/ocktavus/contacts", label: "Contacts", icon: Users },
  { to: "/ocktavus/journal", label: "Journal", icon: Activity },
];

function AuthedLayout() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("ock_sidebar_collapsed") === "1";
  });
  useEffect(() => {
    localStorage.setItem("ock_sidebar_collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const width = collapsed ? "w-16" : "w-64";

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className={`${width} flex flex-col border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl transition-[width] duration-200`}>
        <div className="flex items-center justify-between px-3 py-4">
          <Link to="/ocktavus" className={`flex items-center gap-2 ${collapsed ? "justify-center w-full" : ""}`}>
            <div className="grid h-9 w-9 place-items-center rounded-xl holo-glow" style={{ background: "linear-gradient(135deg, var(--holo), var(--holo-2))" }}>
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            {!collapsed && (
              <span className="font-display text-lg font-semibold tracking-tight">
                <span className="ock-holo-text">OCKTAVUS</span>
              </span>
            )}
          </Link>
          {!collapsed && (
            <button onClick={() => setCollapsed(true)} className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-sidebar-accent" aria-label="Replier">
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {collapsed && (
          <button onClick={() => setCollapsed(false)} className="mx-auto mb-1 grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-sidebar-accent" aria-label="Déplier">
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}

        <nav className="flex-1 overflow-y-auto px-2 pb-3">
          {!collapsed && (
            <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Workspace</p>
          )}
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              title={collapsed ? n.label : undefined}
              className={`flex items-center ${collapsed ? "justify-center" : "gap-2.5"} rounded-lg px-3 py-2 text-sm text-sidebar-foreground/85 transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`}
              activeProps={{
                className: `flex items-center ${collapsed ? "justify-center" : "gap-2.5"} rounded-lg px-3 py-2 text-sm bg-sidebar-accent text-sidebar-accent-foreground font-medium holo-glow`,
              }}
            >
              <n.icon className="h-4 w-4" />
              {!collapsed && n.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-2">
          <Link to="/ocktavus/reglages" title="Paramètres" className={`flex items-center ${collapsed ? "justify-center" : "gap-2.5"} rounded-lg px-3 py-2 text-sm text-sidebar-foreground/85 hover:bg-sidebar-accent`}>
            <SlidersHorizontal className="h-4 w-4" /> {!collapsed && "Paramètres"}
          </Link>
          <Link to="/ocktavus/connexions" title="Connexions" className={`flex items-center ${collapsed ? "justify-center" : "gap-2.5"} rounded-lg px-3 py-2 text-sm text-sidebar-foreground/85 hover:bg-sidebar-accent`}>
            <Settings className="h-4 w-4" /> {!collapsed && "Connexions"}
          </Link>
          <button onClick={signOut} title="Déconnexion" className={`flex w-full items-center ${collapsed ? "justify-center" : "gap-2.5"} rounded-lg px-3 py-2 text-sm text-sidebar-foreground/85 hover:bg-sidebar-accent`}>
            <LogOut className="h-4 w-4" /> {!collapsed && "Se déconnecter"}
          </button>
        </div>
      </aside>

      <main className="relative flex-1 overflow-hidden">
        <Outlet />
        <VoiceOrb />
      </main>
    </div>
  );
}
