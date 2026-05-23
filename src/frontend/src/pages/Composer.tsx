import { NonAuthoritativeLabel } from "@/components/NonAuthoritativeLabel";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/store/useAppStore";
import type { JobMode } from "@/types";
import {
  AlertTriangle,
  Image,
  Music,
  Sparkles,
  Video,
  Wand2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const MODE_TABS: { value: JobMode; label: string; icon: React.ElementType }[] =
  [
    { value: "image", label: "Image", icon: Image },
    { value: "video", label: "Video", icon: Video },
    { value: "music", label: "Music", icon: Music },
  ];

export default function Composer() {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<JobMode>("image");
  const providers = useAppStore((s) => s.providers);
  const addJob = useAppStore((s) => s.addJob);
  const activeProviders = providers.filter((p) => p.isActive);
  const hasProvider = activeProviders.length > 0;

  function handleQueue() {
    if (!prompt.trim() || !hasProvider) return;
    addJob({
      id: `job-${Date.now()}`,
      prompt: prompt.trim(),
      mode,
      providerId: activeProviders[0].id,
      timestamp: new Date().toISOString(),
      status: "pending",
    });
    setPrompt("");
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Wand2 className="w-6 h-6 text-primary" />
          <h1 className="font-display text-3xl font-bold">
            Magick Friend Composer
          </h1>
        </div>
        <div className="flex items-center gap-3 mb-8">
          <p className="text-muted-foreground text-sm">
            Queue generation jobs to your configured AI providers
          </p>
          <NonAuthoritativeLabel />
        </div>

        {!hasProvider && (
          <div
            className="flex items-start gap-3 p-4 mb-6 rounded-xl border border-orange-800/40 bg-orange-950/20"
            data-ocid="composer.provider_required"
          >
            <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-orange-300 mb-1">
                No Active Provider Configured
              </p>
              <p className="text-xs text-orange-400/70">
                Configure and activate a provider in Provider Settings before
                queuing jobs. No generation will occur without a live provider
                endpoint.
              </p>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-border/60 bg-card p-6 space-y-5">
          <Tabs value={mode} onValueChange={(v) => setMode(v as JobMode)}>
            <TabsList
              className="bg-muted/50 w-full"
              data-ocid="composer.mode_tabs"
            >
              {MODE_TABS.map((t) => (
                <TabsTrigger
                  key={t.value}
                  value={t.value}
                  className="flex-1 gap-1.5"
                  data-ocid={`composer.mode_tab.${t.value}`}
                >
                  <t.icon className="w-3.5 h-3.5" />
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="prompt-input"
            >
              Prompt
            </label>
            <Textarea
              id="prompt-input"
              placeholder={`Describe the ${mode} you want to generate…`}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
              className="resize-none bg-background border-border/60 focus:border-primary/60"
              data-ocid="composer.prompt_input"
            />
          </div>

          {hasProvider && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Will route to:</span>
              <Badge
                variant="outline"
                className="text-xs border-primary/30 text-primary"
              >
                {activeProviders[0].name}
              </Badge>
            </div>
          )}

          <Button
            onClick={handleQueue}
            disabled={!prompt.trim() || !hasProvider}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-primary transition-smooth"
            data-ocid="composer.queue_button"
          >
            <Sparkles className="mr-2 w-4 h-4" />
            Queue Generation Job
          </Button>

          <div className="flex items-center gap-2 pt-1">
            <StatusBadge
              variant={hasProvider ? "live" : "user-required"}
              label={hasProvider ? "Provider Active" : "Provider Required"}
            />
            <StatusBadge
              variant="icp-required"
              label="ICP AI Worker Required"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
