import { NonAuthoritativeLabel } from "@/components/NonAuthoritativeLabel";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/store/useAppStore";
import type { ICPMediaManifest } from "@/types";
import {
  CheckCircle2,
  FileJson,
  Package,
  Trash2,
  Upload,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export default function Gallery() {
  const [jsonInput, setJsonInput] = useState("");
  const manifests = useAppStore((s) => s.manifests);
  const addManifest = useAppStore((s) => s.addManifest);
  const removeManifest = useAppStore((s) => s.removeManifest);

  function handleImport() {
    try {
      const raw = JSON.parse(jsonInput.trim()) as Partial<ICPMediaManifest>;
      if (!raw.manifestId || !raw.owner)
        throw new Error("Missing manifestId or owner");
      addManifest({
        ...raw,
        chunks: raw.chunks ?? [],
        version: raw.version ?? 1,
        importedAt: new Date().toISOString(),
        source: "icp-manifest",
      } as ICPMediaManifest);
      setJsonInput("");
      toast.success("Manifest imported successfully");
    } catch (e) {
      toast.error(`Invalid manifest JSON: ${(e as Error).message}`);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Package className="w-6 h-6 text-primary" />
          <h1 className="font-display text-3xl font-bold">Media Manifests</h1>
        </div>
        <div className="flex items-center gap-3 mb-8">
          <p className="text-muted-foreground text-sm">
            Import and inspect icp-media:// manifest JSON
          </p>
          <NonAuthoritativeLabel />
        </div>

        {/* Import Panel */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 mb-8 space-y-4">
          <div className="flex items-center gap-2">
            <FileJson className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Import Manifest JSON</h2>
            <StatusBadge variant="icp-required" />
          </div>
          <Textarea
            placeholder={
              '{\n  "manifestId": "abc123",\n  "owner": "principal-id",\n  "version": 1,\n  "chunks": []\n}'
            }
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={8}
            className="font-mono text-sm resize-none bg-background border-border/60 focus:border-primary/60"
            data-ocid="gallery.manifest_input"
          />
          <Button
            onClick={handleImport}
            disabled={!jsonInput.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth"
            data-ocid="gallery.import_button"
          >
            <Upload className="mr-2 w-4 h-4" />
            Import Manifest
          </Button>
        </div>

        {/* Manifest List */}
        {manifests.length === 0 ? (
          <div
            className="text-center py-20 border border-dashed border-border/40 rounded-2xl"
            data-ocid="gallery.empty_state"
          >
            <Package className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">
              No manifests imported yet
            </p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Paste an icp-media:// manifest JSON above to get started
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {manifests.map((m, i) => (
              <motion.div
                key={m.manifestId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border/60 bg-card p-5"
                data-ocid={`gallery.manifest_item.${i + 1}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-mono text-sm font-semibold text-primary truncate">
                        {m.manifestId}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-xs border-primary/30 text-primary"
                      >
                        v{m.version}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono mb-3 truncate">
                      Owner: {m.owner}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {m.chunks.map((chunk) => (
                        <div
                          key={chunk.chunkId}
                          className="flex items-center gap-1 text-xs bg-muted/60 rounded px-2 py-1"
                        >
                          {chunk.status === "verified" ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <XCircle className="w-3 h-3 text-red-400" />
                          )}
                          <span className="font-mono text-muted-foreground">
                            {chunk.contentType}
                          </span>
                          <span className="text-muted-foreground/60">
                            {(chunk.sizeBytes / 1024).toFixed(1)}KB
                          </span>
                        </div>
                      ))}
                      {m.chunks.length === 0 && (
                        <span className="text-xs text-muted-foreground/60">
                          No chunks
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeManifest(m.manifestId)}
                    className="text-muted-foreground hover:text-destructive flex-shrink-0"
                    data-ocid={`gallery.delete_button.${i + 1}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground/50 mt-3 font-mono">
                  Imported {new Date(m.importedAt).toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
