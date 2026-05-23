import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/store/useAppStore";
import type { TestStatus } from "@/types";
import { CheckCircle2, Clock, Network, Save, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

function statusIcon(status: TestStatus | undefined) {
  if (status === "ok")
    return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
  if (status === "error") return <XCircle className="w-4 h-4 text-red-400" />;
  return <Clock className="w-4 h-4 text-muted-foreground/40" />;
}

export default function CanisterConfig() {
  const canisters = useAppStore((s) => s.canisters);
  const updateCanister = useAppStore((s) => s.updateCanister);
  const [edits, setEdits] = useState<
    Record<string, { canisterId: string; endpointUrl: string }>
  >({});

  function getEdit(id: string) {
    const c = canisters.find((x) => x.id === id);
    return (
      edits[id] ?? {
        canisterId: c?.canisterId ?? "",
        endpointUrl: c?.endpointUrl ?? "",
      }
    );
  }

  function setEdit(
    id: string,
    field: "canisterId" | "endpointUrl",
    value: string,
  ) {
    setEdits((prev) => ({
      ...(prev ?? {}),
      [id]: { ...getEdit(id), [field]: value },
    }));
  }

  function handleSave(id: string) {
    const edit = getEdit(id);
    updateCanister(id, {
      canisterId: edit.canisterId || undefined,
      endpointUrl: edit.endpointUrl || undefined,
      testStatus: "untested",
    });
    setEdits((prev) => {
      const n = { ...(prev ?? {}) };
      delete n[id];
      return n;
    });
    toast.success("Canister config saved");
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Network className="w-6 h-6 text-primary" />
          <h1 className="font-display text-3xl font-bold">
            Canister Configuration
          </h1>
        </div>
        <p className="text-muted-foreground text-sm mb-8">
          Enter the ICP canister IDs and endpoint URLs for each external
          canister boundary. This app does not compile or deploy canisters —
          these are opaque configuration entries only.
        </p>

        <div className="space-y-4">
          {canisters.map((canister, i) => {
            const edit = getEdit(canister.id);
            return (
              <motion.div
                key={canister.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl border border-border/60 bg-card p-5"
                data-ocid={`canister_config.item.${i + 1}`}
              >
                <div className="flex items-start justify-between mb-4 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {statusIcon(canister.testStatus)}
                      <span className="font-semibold font-mono text-primary">
                        {canister.name}
                      </span>
                      <StatusBadge
                        variant={
                          canister.testStatus === "ok" ? "ok" : "icp-required"
                        }
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {canister.description}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1.5">
                    <Label htmlFor={`cid-${canister.id}`}>Canister ID</Label>
                    <Input
                      id={`cid-${canister.id}`}
                      placeholder="e.g. ryjl3-tyaaa-aaaaa-aaaba-cai"
                      value={edit.canisterId}
                      onChange={(e) =>
                        setEdit(canister.id, "canisterId", e.target.value)
                      }
                      className="bg-background border-border/60 font-mono text-sm"
                      data-ocid={`canister_config.canister_id_input.${i + 1}`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`url-${canister.id}`}>
                      Endpoint URL (optional)
                    </Label>
                    <Input
                      id={`url-${canister.id}`}
                      placeholder="https://ic0.app"
                      value={edit.endpointUrl}
                      onChange={(e) =>
                        setEdit(canister.id, "endpointUrl", e.target.value)
                      }
                      className="bg-background border-border/60 font-mono text-sm"
                      data-ocid={`canister_config.endpoint_url_input.${i + 1}`}
                    />
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleSave(canister.id)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  data-ocid={`canister_config.save_button.${i + 1}`}
                >
                  <Save className="mr-1.5 w-3.5 h-3.5" /> Save
                </Button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
