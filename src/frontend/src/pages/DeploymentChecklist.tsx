import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/useAppStore";
import { Link } from "@tanstack/react-router";
import {
  CheckSquare,
  ClipboardList,
  Cpu,
  CreditCard,
  ExternalLink,
  Network,
  Terminal,
} from "lucide-react";
import { motion } from "motion/react";

const CHECKLIST_SECTIONS = [
  {
    title: "Prerequisites",
    icon: Terminal,
    items: [
      { label: "Install DFX SDK (dfx >= 0.22)", done: false, canisterId: null },
      { label: "Install Mops package manager", done: false, canisterId: null },
      {
        label: "Configure cycles wallet on ICP mainnet",
        done: false,
        canisterId: null,
      },
      {
        label: "Fund canister accounts with ICP/cycles",
        done: false,
        canisterId: null,
      },
    ],
  },
  {
    title: "Canister Deployment",
    icon: Network,
    items: [
      {
        label: "Deploy core canister → note canister ID",
        done: false,
        configKey: "core",
      },
      {
        label: "Deploy media canister → note canister ID",
        done: false,
        configKey: "media",
      },
      {
        label: "Deploy or link ICRC-1 ledger canister",
        done: false,
        configKey: "ledger",
      },
      {
        label: "Deploy ad-verifier canister",
        done: false,
        configKey: "ad-verifier",
      },
      {
        label: "Deploy ai-worker canister",
        done: false,
        configKey: "ai-worker",
      },
    ],
  },
  {
    title: "Control Center Wiring",
    icon: Network,
    items: [
      {
        label: "Enter core canister ID in Canister Config",
        route: "/canister-config",
        done: false,
      },
      {
        label: "Enter media canister ID in Canister Config",
        route: "/canister-config",
        done: false,
      },
      {
        label: "Enter ledger canister ID in Canister Config",
        route: "/canister-config",
        done: false,
      },
      {
        label: "Enter ad-verifier canister ID in Canister Config",
        route: "/canister-config",
        done: false,
      },
      {
        label: "Enter ai-worker canister ID in Canister Config",
        route: "/canister-config",
        done: false,
      },
    ],
  },
  {
    title: "Provider Setup",
    icon: Cpu,
    items: [
      {
        label: "Add at least one AI provider in Provider Settings",
        route: "/provider-settings",
        done: false,
      },
      { label: "Activate provider and verify endpoint responds", done: false },
    ],
  },
  {
    title: "Payment Flow",
    icon: CreditCard,
    items: [
      { label: "Verify ledger canister accepts ICRC-2 approvals", done: false },
      {
        label: "Test a payment intent creation and ICRC-2 payload",
        route: "/payment-intents",
        done: false,
      },
      { label: "Record a test verified transaction hash", done: false },
    ],
  },
];

export default function DeploymentChecklist() {
  const canisters = useAppStore((s) => s.canisters);
  const providers = useAppStore((s) => s.providers);

  function isConfigured(configKey?: string) {
    if (!configKey) return false;
    return canisters.some((c) => c.name === configKey && c.canisterId);
  }

  function hasActiveProvider() {
    return providers.some((p) => p.isActive);
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <ClipboardList className="w-6 h-6 text-primary" />
          <h1 className="font-display text-3xl font-bold">
            Deployment Checklist
          </h1>
        </div>
        <p className="text-muted-foreground text-sm mb-8">
          Step-by-step guide for deploying the real ICP canister backend and
          wiring it to this control center. This control center maps to external
          ICP canister boundaries — it does not compile or deploy Motoko.
        </p>

        <div className="rounded-xl border border-amber-800/30 bg-amber-950/20 px-5 py-4 mb-8">
          <p className="text-xs text-amber-400/80 font-mono">
            <span className="font-semibold text-amber-400">REMINDER:</span>{" "}
            Never connect this control center to www.magickbox.ai production
            infrastructure. The target ICP deployment is a separate, isolated
            instance only.
          </p>
        </div>

        <div className="space-y-6">
          {CHECKLIST_SECTIONS.map((section, si) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: si * 0.07 }}
              className="rounded-xl border border-border/60 bg-card overflow-hidden"
              data-ocid={`checklist.section.${si + 1}`}
            >
              <div className="flex items-center gap-3 px-5 py-3 border-b border-border/40 bg-muted/30">
                <section.icon className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-sm">{section.title}</h2>
              </div>
              <div className="divide-y divide-border/30">
                {section.items.map((item, ii) => {
                  const autoChecked =
                    ("configKey" in item &&
                      isConfigured(item.configKey as string)) ||
                    (section.title === "Provider Setup" &&
                      ii === 0 &&
                      hasActiveProvider());

                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 px-5 py-3"
                      data-ocid={`checklist.item.${si + 1}.${ii + 1}`}
                    >
                      <CheckSquare
                        className={`w-4 h-4 flex-shrink-0 ${
                          autoChecked
                            ? "text-emerald-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                      <span
                        className={`text-sm flex-1 ${
                          autoChecked
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {item.label}
                      </span>
                      {"route" in item && item.route && (
                        <Link
                          to={item.route as string}
                          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-smooth"
                        >
                          Open <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                      {autoChecked && (
                        <Badge
                          variant="outline"
                          className="text-xs border-emerald-800/40 text-emerald-400 ml-auto"
                        >
                          Configured
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
