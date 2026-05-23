import { StatusBadge, type StatusVariant } from "@/components/StatusBadge";
import { useAppStore } from "@/store/useAppStore";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Network,
  User,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

interface StatusRow {
  label: string;
  description: string;
  variant: StatusVariant;
  detail?: string;
}

export default function SystemStatus() {
  const providers = useAppStore((s) => s.providers);
  const canisters = useAppStore((s) => s.canisters);
  const activeProviders = providers.filter((p) => p.isActive);
  const configuredCanisters = canisters.filter((c) => c.canisterId);

  const STATUS_ROWS: StatusRow[] = [
    {
      label: "Caffeine App Shell",
      description: "React frontend running in Caffeine",
      variant: "live",
      detail: "Running in this browser session",
    },
    {
      label: "Local Control-Plane State",
      description: "Zustand store + localStorage persistence",
      variant: "live",
      detail: "Non-authoritative — browser local only",
    },
    {
      label: "ICP Core Canister",
      description: "User registry and session management",
      variant: configuredCanisters.some((c) => c.name === "core")
        ? "icp-required"
        : "icp-required",
      detail: configuredCanisters.some((c) => c.name === "core")
        ? "Canister ID configured"
        : "Not yet configured in Canister Config",
    },
    {
      label: "ICP Media Canister",
      description: "icp-media:// manifests and chunk storage",
      variant: "icp-required",
      detail: configuredCanisters.some((c) => c.name === "media")
        ? "Canister ID configured"
        : "Not yet configured",
    },
    {
      label: "ICP Ledger Canister",
      description: "ICRC-1/ICRC-2 token ledger",
      variant: "icp-required",
      detail: configuredCanisters.some((c) => c.name === "ledger")
        ? "Canister ID configured"
        : "Not yet configured",
    },
    {
      label: "ICP Ad Verifier Canister",
      description: "Content moderation and ad-spend proofs",
      variant: "icp-required",
      detail: configuredCanisters.some((c) => c.name === "ad-verifier")
        ? "Canister ID configured"
        : "Not yet configured",
    },
    {
      label: "ICP AI Worker Canister",
      description: "Dispatches generation jobs to providers",
      variant: "icp-required",
      detail: configuredCanisters.some((c) => c.name === "ai-worker")
        ? "Canister ID configured"
        : "Not yet configured",
    },
    {
      label: "AI Generation Provider",
      description: "FreeLLMAPI / OpenAI-Compatible / MagickAI / Ollama",
      variant: activeProviders.length > 0 ? "live" : "user-required",
      detail:
        activeProviders.length > 0
          ? `${activeProviders.length} provider(s) active`
          : "No active provider — configure in Provider Settings",
    },
    {
      label: "Payment Processing",
      description: "ICRC-2 transfer-from flows",
      variant: "icp-required",
      detail: "Requires ledger canister configuration",
    },
    {
      label: "Internet Identity Auth",
      description: "User authentication",
      variant: "unavailable",
      detail: "Not built in this prototype",
    },
  ];

  const LEGEND = [
    { variant: "live" as const, label: "Live in this app", icon: CheckCircle2 },
    {
      variant: "icp-required" as const,
      label: "External ICP canister required",
      icon: Network,
    },
    {
      variant: "user-required" as const,
      label: "Provider / user configuration required",
      icon: User,
    },
    {
      variant: "unavailable" as const,
      label: "Unavailable in this prototype",
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Activity className="w-6 h-6 text-primary" />
          <h1 className="font-display text-3xl font-bold">System Status</h1>
        </div>
        <p className="text-muted-foreground text-sm mb-8">
          Feature availability across the control center
        </p>

        {/* Legend */}
        <div className="rounded-xl border border-border/60 bg-card p-4 mb-8">
          <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
            Legend
          </p>
          <div className="flex flex-wrap gap-4">
            {LEGEND.map((l) => (
              <div key={l.variant} className="flex items-center gap-2">
                <StatusBadge variant={l.variant} />
                <span className="text-xs text-muted-foreground">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Rows */}
        <div className="space-y-3" data-ocid="system_status.list">
          {STATUS_ROWS.map((row, i) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="rounded-xl border border-border/60 bg-card p-4 flex items-center justify-between gap-4 flex-wrap"
              data-ocid={`system_status.item.${i + 1}`}
            >
              <div className="flex items-start gap-3">
                <Zap className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">{row.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {row.description}
                  </p>
                  {row.detail && (
                    <p className="text-xs text-muted-foreground/60 mt-0.5 font-mono">
                      {row.detail}
                    </p>
                  )}
                </div>
              </div>
              <StatusBadge variant={row.variant} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
