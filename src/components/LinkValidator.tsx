import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, Link as LinkIcon } from "lucide-react";

type Platform = "google-drive" | "dropbox" | "onedrive" | "unknown" | null;

interface LinkValidatorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

function detectPlatform(url: string): Platform {
  if (!url) return null;
  if (/drive\.google\.com|docs\.google\.com/.test(url)) return "google-drive";
  if (/dropbox\.com/.test(url)) return "dropbox";
  if (/onedrive\.live\.com|1drv\.ms|sharepoint\.com/.test(url)) return "onedrive";
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
    <div className={cn("space-y-2", className)}>
      <div className="relative">
        <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your Google Drive, Dropbox, or OneDrive link..."
          className={cn(
            "pl-10 pr-10 transition-all",
            isValid && "border-status-graded ring-1 ring-status-graded/30",
            platform === "unknown" && "border-destructive ring-1 ring-destructive/30"
          )}
          aria-label="Submission link"
        />
        {isValid && (
          <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-status-graded" />
        )}
        {platform === "unknown" && (
          <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-destructive" />
        )}
      </div>
      {info && (
        <div className={cn("flex items-center gap-2 text-sm font-medium", info.color)}>
          <span>{info.icon}</span>
          <span>{info.label} detected</span>
        </div>
      )}
      {platform === "unknown" && (
        <p className="text-sm text-destructive">
          Please use a link from Google Drive, Dropbox, or OneDrive.
        </p>
      )}
    </div>
  );
}
