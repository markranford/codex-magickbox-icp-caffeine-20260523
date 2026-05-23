import { NonAuthoritativeLabel } from "@/components/NonAuthoritativeLabel";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/store/useAppStore";
import {
  AlertTriangle,
  CheckCheck,
  Clock,
  Copy,
  CreditCard,
  Plus,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export default function PaymentIntents() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const intents = useAppStore((s) => s.paymentIntents);
  const addPaymentIntent = useAppStore((s) => s.addPaymentIntent);
  const markIntentVerified = useAppStore((s) => s.markIntentVerified);

  function generateSubaccount() {
    return Array.from({ length: 8 }, () =>
      Math.random().toString(16).slice(2, 6),
    ).join("-");
  }

  function buildIcrc2Payload(subaccount: string, amtNum: number) {
    return JSON.stringify({
      method: "icrc2_transfer_from",
      params: {
        subaccount,
        amount: amtNum,
        memo: `payment-intent-${Date.now()}`,
      },
    });
  }

  function handleCreate() {
    const amtNum = Number.parseFloat(amount);
    if (!amount || Number.isNaN(amtNum) || amtNum <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    const sub = generateSubaccount();
    addPaymentIntent({
      id: `pi-${Date.now()}`,
      amount: amtNum,
      description: description.trim() || undefined,
      subaccountId: sub,
      icrc2Payload: buildIcrc2Payload(sub, amtNum),
      createdAt: new Date().toISOString(),
      status: "pending",
    });
    setAmount("");
    setDescription("");
    toast.success("Payment intent created (local record only)");
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <CreditCard className="w-6 h-6 text-primary" />
          <h1 className="font-display text-3xl font-bold">Payment Intents</h1>
        </div>
        <div className="flex items-center gap-3 mb-8">
          <p className="text-muted-foreground text-sm">
            Create pending ICRC-2 payment intent records
          </p>
          <NonAuthoritativeLabel detail="Payment intent records are local only. Authoritative payment state lives on the ICP ledger canister. Credits are NOT marked paid until you record a verified transaction hash." />
        </div>

        {/* Create Form */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 mb-8 space-y-4">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">New Payment Intent</h2>
            <StatusBadge variant="icp-required" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="pi-amount">Amount (ICP)</Label>
              <Input
                id="pi-amount"
                type="number"
                placeholder="5.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-background border-border/60"
                data-ocid="payment_intents.amount_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pi-desc">Description (optional)</Label>
              <Input
                id="pi-desc"
                placeholder="e.g. 500 credit purchase"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-background border-border/60"
                data-ocid="payment_intents.description_input"
              />
            </div>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth"
            data-ocid="payment_intents.create_button"
          >
            <Plus className="mr-2 w-4 h-4" />
            Create Intent
          </Button>
        </div>

        {/* Intents List */}
        {intents.length === 0 ? (
          <div
            className="text-center py-16 border border-dashed border-border/40 rounded-2xl"
            data-ocid="payment_intents.empty_state"
          >
            <CreditCard className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">
              No payment intents yet
            </p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Create a pending intent above to generate ICRC-2 payloads
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {intents.map((intent, i) => (
              <motion.div
                key={intent.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl border border-border/60 bg-card p-5"
                data-ocid={`payment_intents.item.${i + 1}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-mono text-sm font-semibold text-primary">
                        {intent.id}
                      </span>
                      <StatusBadge
                        variant={
                          intent.status === "verified"
                            ? "ok"
                            : intent.status === "expired"
                              ? "error"
                              : "pending"
                        }
                        label={intent.status}
                      />
                    </div>
                    {intent.description && (
                      <p className="text-sm text-foreground mb-2">
                        {intent.description}
                      </p>
                    )}
                    <p className="text-xl font-bold mb-2">
                      {intent.amount}{" "}
                      <span className="text-sm text-muted-foreground font-normal">
                        ICP
                      </span>
                    </p>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-mono">
                        Subaccount:{" "}
                        <span className="text-foreground/80">
                          {intent.subaccountId}
                        </span>
                      </p>
                      <div className="flex items-center gap-1">
                        <p className="text-xs text-muted-foreground font-mono truncate max-w-xs">
                          Payload:{" "}
                          <span className="text-foreground/80">
                            {intent.icrc2Payload.slice(0, 60)}…
                          </span>
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(intent.icrc2Payload);
                            toast.success("Copied payload");
                          }}
                          className="text-muted-foreground hover:text-primary transition-smooth"
                          data-ocid={`payment_intents.copy_payload.${i + 1}`}
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {intent.status === "pending" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        markIntentVerified(intent.id, `tx-${Date.now()}`)
                      }
                      className="border-emerald-800/40 text-emerald-400 hover:bg-emerald-950/30"
                      data-ocid={`payment_intents.verify_button.${i + 1}`}
                    >
                      <CheckCheck className="mr-1.5 w-3.5 h-3.5" />
                      Record Verified
                    </Button>
                  )}
                  {intent.status === "verified" && (
                    <Badge
                      variant="outline"
                      className="border-emerald-800/40 text-emerald-400"
                    >
                      <CheckCheck className="mr-1 w-3 h-3" /> Verified
                    </Badge>
                  )}
                </div>
                {intent.verifiedTxHash && (
                  <p className="text-xs text-muted-foreground/60 font-mono mt-2">
                    TX: {intent.verifiedTxHash}
                  </p>
                )}
                <div className="flex items-center gap-1.5 mt-3">
                  <Clock className="w-3 h-3 text-muted-foreground/50" />
                  <p className="text-xs text-muted-foreground/50">
                    {new Date(intent.createdAt).toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
