import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Box,
  Cpu,
  Layers,
  Network,
  Settings,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

const CAPABILITY_CARDS = [
  {
    icon: Network,
    title: "Canister Configuration",
    description:
      "Wire up external ICP canister IDs for core, media, ledger, ad-verifier, and AI worker endpoints.",
    href: "/canister-config",
    status: "icp-required" as const,
  },
  {
    icon: Cpu,
    title: "Provider Settings",
    description:
      "Configure FreeLLMAPI, OpenAI-compatible, MagickAI worker, or local Ollama provider endpoints.",
    href: "/provider-settings",
    status: "user-required" as const,
  },
  {
    icon: Zap,
    title: "Payment Intents",
    description:
      "Create pending ICRC-2 payment intent records with per-intent subaccounts and transfer payloads.",
    href: "/payment-intents",
    status: "icp-required" as const,
  },
  {
    icon: Box,
    title: "Media Manifests",
    description:
      "Import icp-media:// manifest JSON and inspect chunks, ownership, and verification status.",
    href: "/gallery",
    status: "icp-required" as const,
  },
  {
    icon: Layers,
    title: "Job History",
    description:
      "Browse local generation job records with prompt, mode, provider, status, and output metadata.",
    href: "/job-history",
    status: "live" as const,
  },
  {
    icon: Activity,
    title: "System Status",
    description:
      "View live app status, external ICP requirements, provider requirements, and unavailable features.",
    href: "/system-status",
    status: "live" as const,
  },
];

export default function Hero() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20 lg:py-32">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px]" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge
              variant="outline"
              className="mb-6 border-primary/40 text-primary bg-primary/10 px-3 py-1 font-mono text-xs"
            >
              ICP Control Center — Isolated Prototype
            </Badge>

            <h1 className="font-display text-5xl lg:text-7xl font-bold tracking-tight mb-6">
              Magick Box{" "}
              <span className="text-primary glow-primary">Control Center</span>
            </h1>

            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
              Configure external ICP canister boundaries, import media
              manifests, manage payment intents, and orchestrate AI generation
              providers — all from one control plane.
            </p>

            <div className="flex justify-center mb-10">
              <StatusBadge variant="live" label="Running in Caffeine" />
              <span className="mx-2 text-muted-foreground/30">·</span>
              <StatusBadge
                variant="icp-required"
                label="ICP Canisters External"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary transition-smooth font-semibold"
                data-ocid="hero.composer_button"
              >
                <Link to="/composer">
                  Open Magick Composer
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-border hover:border-primary/60 transition-smooth"
                data-ocid="hero.setup_button"
              >
                <Link to="/canister-config">
                  <Settings className="mr-2 w-4 h-4" />
                  Configure Canisters
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16"
          >
            <div className="relative rounded-2xl overflow-hidden border border-border/60 border-glow">
              <img
                src="/assets/generated/hero-magickbox-icp.dim_1200x600.jpg"
                alt="Magick Box ICP Control Center"
                className="w-full h-auto opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="px-6 py-20 bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl font-bold mb-3">
              Control Plane Features
            </h2>
            <p className="text-muted-foreground">
              Everything you need to configure and monitor the Magick Box ICP
              ecosystem
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CAPABILITY_CARDS.map((card, i) => (
              <motion.div
                key={card.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                data-ocid={`hero.capability_card.${i + 1}`}
              >
                <Link to={card.href} className="block h-full">
                  <div className="h-full p-5 rounded-xl border border-border/60 bg-card hover:border-primary/40 hover:bg-card/80 transition-smooth group cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-smooth">
                        <card.icon className="w-5 h-5 text-primary" />
                      </div>
                      <StatusBadge variant={card.status} />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-smooth">
                      {card.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer Banner */}
      <section className="px-6 py-8 border-t border-border/40">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-xl border border-amber-800/30 bg-amber-950/20 px-5 py-4">
            <p className="text-xs text-amber-400/80 font-mono leading-relaxed">
              <span className="font-semibold text-amber-400">
                ISOLATED PROTOTYPE:
              </span>{" "}
              This control center does not connect to www.magickbox.ai or any
              production Magick Box infrastructure. All state stored here is
              non-authoritative local control-plane data only. Authoritative
              credits, payments, media, and user sessions live on the external
              ICP canisters you configure.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
