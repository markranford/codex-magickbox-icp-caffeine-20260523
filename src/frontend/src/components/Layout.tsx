import { NonAuthoritativeLabel } from "@/components/NonAuthoritativeLabel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  ChevronRight,
  ClipboardList,
  Coins,
  Cpu,
  CreditCard,
  History,
  Home,
  Menu,
  Network,
  Package,
  Sparkles,
  Wand2,
  X,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Wand2, label: "Composer", href: "/composer" },
  { icon: Package, label: "Media Manifests", href: "/gallery" },
  { icon: Coins, label: "Pricing & Credits", href: "/pricing" },
  { icon: CreditCard, label: "Payment Intents", href: "/payment-intents" },
  { icon: Cpu, label: "Provider Settings", href: "/provider-settings" },
  { icon: Network, label: "Canister Config", href: "/canister-config" },
  { icon: History, label: "Job History", href: "/job-history" },
  { icon: Activity, label: "System Status", href: "/system-status" },
  {
    icon: ClipboardList,
    label: "Deploy Checklist",
    href: "/deployment-checklist",
  },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 inset-x-0 z-50 h-14 bg-card border-b border-border/60 shadow-[0_2px_20px_oklch(var(--primary)/0.08)] flex items-center px-4 gap-4">
        <button
          type="button"
          onClick={() => setSidebarOpen((v) => !v)}
          className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth"
          aria-label="Toggle navigation"
          data-ocid="layout.mobile_menu_toggle"
        >
          {sidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>

        <Link
          to="/"
          className="flex items-center gap-2.5 flex-shrink-0"
          data-ocid="layout.logo_link"
        >
          <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center glow-accent">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="font-display font-bold text-sm leading-tight hidden sm:block">
            Magick Box
            <span className="block text-primary text-[10px] font-mono font-normal tracking-wider">
              ICP Control Center
            </span>
          </span>
        </Link>

        <div className="flex-1" />

        <NonAuthoritativeLabel className="hidden sm:inline-flex" />
      </header>

      <div className="flex pt-14 min-h-screen">
        {/* Sidebar — desktop always visible, mobile overlay */}
        <aside
          className={cn(
            "fixed top-14 left-0 bottom-0 z-40 w-60 bg-sidebar border-r border-sidebar-border flex-col transition-transform duration-200",
            "flex",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            "lg:translate-x-0",
          )}
        >
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const active =
                currentPath === item.href ||
                (item.href !== "/" && currentPath.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  data-ocid={`layout.nav_link.${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-smooth group",
                    active
                      ? "bg-primary/15 text-primary border border-primary/25 glow-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-4 h-4 flex-shrink-0",
                      active
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground",
                    )}
                  />
                  <span className="flex-1 min-w-0 truncate font-medium">
                    {item.label}
                  </span>
                  {active && (
                    <ChevronRight className="w-3 h-3 text-primary opacity-60" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="px-4 py-3 border-t border-sidebar-border">
            <p className="text-[10px] text-muted-foreground/40 font-mono leading-relaxed">
              © {new Date().getFullYear()}{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-smooth"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </aside>

        {/* Mobile overlay backdrop */}
        {sidebarOpen && (
          <div
            role="presentation"
            className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-full lg:ml-60 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
