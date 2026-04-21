import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, Link as LinkIcon, Info } from "lucide-react";

// Platform types for the "Bouncer" to check
export type Platform = "google-drive" | "dropbox" | "onedrive" | "unknown" | null;

interface LinkValidatorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * The "Scanner": Checks the URL against known patterns
 */
function detectPlatform(url: string): Platform {
  if (!url) return null;
  // Google Drive/Docs
  if (/drive\.google\.com|docs\.google\.com/.test(url)) return "google-drive";
  // Dropbox
  if (/dropbox\.com/.test(url)) return "dropbox";
  // OneDrive / SharePoint
  if (/onedrive\.live\.com|1drv\.ms|sharepoint\.com/.test(url)) return "onedrive";
  // Generic HTTP/S (Unsupported)
  if (/^https?:\/\//.test(url)) return "unknown";
  return null;
}

const platformInfo: Record<string, { label: string; color: string; icon: string }> = {
  "google-drive": { label: "Google Drive", color: "text-status-graded", icon: "📁" },
  "dropbox": { label: "Dropbox", color: "text-blue-500", icon: "📦" },
  "onedrive": { label: "OneDrive", color: "text-blue-600", icon: "☁️" },
};

export function LinkValidator({ value, onChange, className }: LinkValidatorProps) {
  const [platform, setPlatform] = useState<Platform>(null);

  useEffect(() => {
    setPlatform(detectPlatform(value));
  }, [value]);

  const isValid = platform && platform !== "unknown";
  const info = platform && platform !== "unknown" ? platformInfo[platform] : null;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="relative group">
        <LinkIcon className={cn(
          "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors",
          isValid ? "text-status-graded" : "text-muted-foreground"
        )} />
        
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste Google Drive, Dropbox, or OneDrive link..."
          className={cn(
            "pl-10 pr-10 h-11 transition-all rounded-xl border-border/50 bg-background",
            "focus:ring-offset-0",
            isValid && "border-status-graded ring-1 ring-status-graded/20",
            platform === "unknown" && "border-destructive ring-1 ring-destructive/20"
          )}
          aria-label="Submission link"
        />

        {/* Status Indicators */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isValid && (
            <CheckCircle className="h-4 w-4 text-status-graded animate-in zoom-in duration-300" />
          )}
          {platform === "unknown" && (
            <AlertCircle className="h-4 w-4 text-destructive animate-in shake-in" />
          )}
        </div>
      </div>

      {/* Feedback Area */}
      <div className="min-h-[20px] px-1">
        {info && (
          <div className={cn("flex items-center gap-2 text-xs font-bold uppercase tracking-wider", info.color)}>
            <span className="text-base leading-none">{info.icon}</span>
            <span>{info.label} Link Verified</span>
          </div>
        )}

        {platform === "unknown" && (
          <div className="flex items-start gap-2 text-xs font-medium text-destructive">
            <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <p>Unrecognized source. Please use a valid Google Drive, Dropbox, or OneDrive link.</p>
          </div>
        )}

        {!platform && !value && (
          <p className="text-[11px] text-muted-foreground">
            Ensure your file is shared as "Anyone with the link can view".
          </p>
        )}
      </div>
    </div>
  );
}