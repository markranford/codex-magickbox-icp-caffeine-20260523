import { NonAuthoritativeLabel } from "@/components/NonAuthoritativeLabel";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/useAppStore";
import type { JobMode, JobStatus } from "@/types";
import {
  CheckCircle2,
  Clock,
  History,
  Image,
  Loader2,
  Music,
  Video,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";

const MODE_ICON: Record<JobMode, React.ElementType> = {
  image: Image,
  video: Video,
  music: Music,
};

const STATUS_ICON: Record<JobStatus, React.ElementType> = {
  pending: Clock,
  "in-progress": Loader2,
  complete: CheckCircle2,
  error: XCircle,
};

function statusVariant(status: JobStatus) {
  if (status === "complete") return "ok" as const;
  if (status === "error") return "error" as const;
  if (status === "in-progress") return "live" as const;
  return "pending" as const;
}

export default function JobHistory() {
  const jobs = useAppStore((s) => s.jobs);
  const providers = useAppStore((s) => s.providers);

  function providerName(id: string) {
    return providers.find((p) => p.id === id)?.name ?? id;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <History className="w-6 h-6 text-primary" />
          <h1 className="font-display text-3xl font-bold">Job History</h1>
        </div>
        <div className="flex items-center gap-3 mb-8">
          <p className="text-muted-foreground text-sm">
            Local generation job records
          </p>
          <NonAuthoritativeLabel />
        </div>

        {jobs.length === 0 ? (
          <div
            className="text-center py-20 border border-dashed border-border/40 rounded-2xl"
            data-ocid="job_history.empty_state"
          >
            <History className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">
              No jobs queued yet
            </p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Queue a generation job from the Composer to see records here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job, i) => {
              const ModeIcon = MODE_ICON[job.mode];
              const StatusIcon = STATUS_ICON[job.status];
              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-xl border border-border/60 bg-card p-5"
                  data-ocid={`job_history.item.${i + 1}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0 mt-0.5">
                      <ModeIcon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-mono text-xs text-muted-foreground/60">
                          {job.id}
                        </span>
                        <StatusBadge
                          variant={statusVariant(job.status)}
                          label={job.status}
                        />
                        <Badge variant="outline" className="text-xs">
                          {job.mode}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed mb-2 line-clamp-2">
                        {job.prompt}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground/70">
                        <span className="flex items-center gap-1">
                          <StatusIcon className="w-3 h-3" />
                          {job.status}
                        </span>
                        <span>Provider: {providerName(job.providerId)}</span>
                        <span>{new Date(job.timestamp).toLocaleString()}</span>
                      </div>
                      {job.errorMessage && (
                        <p className="text-xs text-red-400 mt-2 font-mono">
                          Error: {job.errorMessage}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
