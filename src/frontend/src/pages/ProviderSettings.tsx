import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAppStore } from "@/store/useAppStore";
import type { ProviderType, TestStatus } from "@/types";
import {
  CheckCircle2,
  Cpu,
  Eye,
  EyeOff,
  HelpCircle,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const PROVIDER_TYPES: { value: ProviderType; label: string }[] = [
  { value: "freelllm", label: "FreeLLMAPI" },
  { value: "openai", label: "OpenAI-Compatible" },
  { value: "magickai", label: "MagickAI Worker" },
  { value: "ollama", label: "Local Ollama" },
];

export default function ProviderSettings() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<ProviderType>("openai");
  const [endpointUrl, setEndpointUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);

  const providers = useAppStore((s) => s.providers);
  const addProvider = useAppStore((s) => s.addProvider);
  const updateProvider = useAppStore((s) => s.updateProvider);
  const removeProvider = useAppStore((s) => s.removeProvider);

  function handleAdd() {
    if (!name.trim() || !endpointUrl.trim()) {
      toast.error("Name and Endpoint URL are required");
      return;
    }
    addProvider({
      id: `provider-${Date.now()}`,
      name: name.trim(),
      type,
      endpointUrl: endpointUrl.trim(),
      apiKey: apiKey.trim() || undefined,
      isActive: false,
      testStatus: "untested",
    });
    setName("");
    setType("openai");
    setEndpointUrl("");
    setApiKey("");
    setShowForm(false);
    toast.success("Provider added");
  }

  function statusVariant(status: TestStatus | undefined) {
    if (status === "ok") return "ok" as const;
    if (status === "error") return "error" as const;
    return "untested" as const;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Cpu className="w-6 h-6 text-primary" />
              <h1 className="font-display text-3xl font-bold">
                Provider Settings
              </h1>
            </div>
            <p className="text-muted-foreground text-sm">
              Configure AI generation provider endpoints
            </p>
          </div>
          <Button
            onClick={() => setShowForm((v) => !v)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-ocid="provider_settings.add_button"
          >
            <Plus className="mr-2 w-4 h-4" /> Add Provider
          </Button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="rounded-2xl border border-primary/40 bg-card p-6 mb-6 space-y-4"
          >
            <h2 className="font-semibold">New Provider</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="p-name">Name</Label>
                <Input
                  id="p-name"
                  placeholder="My Provider"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background"
                  data-ocid="provider_settings.name_input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-type">Type</Label>
                <Select
                  value={type}
                  onValueChange={(v) => setType(v as ProviderType)}
                >
                  <SelectTrigger
                    className="bg-background"
                    data-ocid="provider_settings.type_select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVIDER_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="p-url">Endpoint URL</Label>
                <Input
                  id="p-url"
                  placeholder="https://api.example.com/v1"
                  value={endpointUrl}
                  onChange={(e) => setEndpointUrl(e.target.value)}
                  className="bg-background font-mono text-sm"
                  data-ocid="provider_settings.url_input"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="p-key">API Key (optional)</Label>
                <div className="relative">
                  <Input
                    id="p-key"
                    type={showKey ? "text" : "password"}
                    placeholder="sk-…"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="bg-background font-mono text-sm pr-10"
                    data-ocid="provider_settings.apikey_input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showKey ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAdd}
                className="bg-primary text-primary-foreground"
                data-ocid="provider_settings.save_button"
              >
                Save Provider
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowForm(false)}
                data-ocid="provider_settings.cancel_button"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}

        {providers.length === 0 ? (
          <div
            className="text-center py-16 border border-dashed border-border/40 rounded-2xl"
            data-ocid="provider_settings.empty_state"
          >
            <HelpCircle className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">
              No providers configured
            </p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Add a provider to enable job queuing in the Composer
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {providers.map((p, i) => (
              <div
                key={p.id}
                className="rounded-xl border border-border/60 bg-card p-5 flex flex-wrap items-center justify-between gap-4"
                data-ocid={`provider_settings.item.${i + 1}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold">{p.name}</span>
                    <StatusBadge variant={statusVariant(p.testStatus)} />
                    {p.isActive && (
                      <StatusBadge variant="live" label="Active" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-mono truncate">
                    {p.endpointUrl}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">
                    {PROVIDER_TYPES.find((t) => t.value === p.type)?.label}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {p.isActive ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-muted-foreground/40" />
                    )}
                    <Switch
                      checked={p.isActive}
                      onCheckedChange={(v) =>
                        updateProvider(p.id, { isActive: v })
                      }
                      data-ocid={`provider_settings.active_switch.${i + 1}`}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeProvider(p.id)}
                    className="text-muted-foreground hover:text-destructive"
                    data-ocid={`provider_settings.delete_button.${i + 1}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
