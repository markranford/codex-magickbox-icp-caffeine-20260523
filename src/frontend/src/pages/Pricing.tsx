import { NonAuthoritativeLabel } from "@/components/NonAuthoritativeLabel";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/store/useAppStore";
import { Coins, Info, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

const CREDIT_TIERS = [
  {
    label: "Starter",
    credits: 100,
    price: "5 ICP",
    description: "For testing and light use",
  },
  {
    label: "Standard",
    credits: 500,
    price: "20 ICP",
    description: "For regular creators",
    popular: true,
  },
  {
    label: "Pro",
    credits: 2000,
    price: "70 ICP",
    description: "For power users and teams",
  },
];

export default function Pricing() {
  const creditBalance = useAppStore((s) => s.creditBalance);
  const setCreditBalance = useAppStore((s) => s.setCreditBalance);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Coins className="w-6 h-6 text-primary" />
          <h1 className="font-display text-3xl font-bold">Pricing & Credits</h1>
        </div>
        <div className="flex items-center gap-3 mb-8">
          <p className="text-muted-foreground text-sm">
            Credit tier reference — requires ICP ledger canister for real
            purchases
          </p>
          <StatusBadge variant="icp-required" />
        </div>

        {/* Credit Balance */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <NonAuthoritativeLabel detail="Credit balance is display-only and not authoritative. Real balance lives on the ICP ledger canister." />
              </div>
              <p className="font-display text-4xl font-bold">
                {creditBalance !== null ? creditBalance.toLocaleString() : "—"}
                <span className="text-lg text-muted-foreground ml-2">
                  credits
                </span>
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCreditBalance(null)}
                className="border-border/60"
                data-ocid="pricing.clear_balance_button"
              >
                Clear
              </Button>
              <Button
                size="sm"
                onClick={() => setCreditBalance((creditBalance ?? 0) + 100)}
                className="bg-primary text-primary-foreground"
                data-ocid="pricing.add_credits_button"
              >
                <RefreshCw className="mr-1.5 w-3.5 h-3.5" />
                Simulate +100
              </Button>
            </div>
          </div>
        </div>

        {/* Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CREDIT_TIERS.map((tier, i) => (
            <motion.div
              key={tier.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              data-ocid={`pricing.tier_card.${i + 1}`}
            >
              <Card
                className={`relative border-border/60 bg-card h-full ${
                  tier.popular ? "border-primary/60 glow-primary" : ""
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="font-display">{tier.label}</CardTitle>
                  <p className="text-3xl font-bold mt-2">
                    {tier.price}
                    <span className="text-sm text-muted-foreground font-normal ml-1">
                      / purchase
                    </span>
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-2xl font-semibold text-primary">
                    {tier.credits.toLocaleString()}{" "}
                    <span className="text-sm text-muted-foreground font-normal">
                      credits
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {tier.description}
                  </p>
                  <div className="flex items-start gap-2 pt-2">
                    <Info className="w-3.5 h-3.5 text-muted-foreground/60 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground/60">
                      Requires ledger canister to process real purchases
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
