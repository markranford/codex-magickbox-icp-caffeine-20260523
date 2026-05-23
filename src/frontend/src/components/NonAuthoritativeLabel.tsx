import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

interface NonAuthoritativeLabelProps {
  className?: string;
  detail?: string;
}

export function NonAuthoritativeLabel({
  className,
  detail = "This data is stored locally in your browser only. Authoritative state lives on the external ICP canisters configured in Canister Config.",
}: NonAuthoritativeLabelProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium",
              "bg-amber-950/40 text-amber-400/80 border border-amber-800/30 cursor-help select-none",
              className,
            )}
          >
            <Info className="w-2.5 h-2.5" />
            Non-authoritative local state
          </span>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="max-w-xs text-xs bg-popover border-border text-muted-foreground"
        >
          {detail}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
