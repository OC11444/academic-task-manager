import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
// We import the type from mockData for now until we build the User Service
import type { TeamMember } from "@/stores/mockData";

interface TeamPresenceProps {
  members: TeamMember[];
  className?: string;
}

export function TeamPresence({ members, className }: TeamPresenceProps) {
  // 🟢 Online: Active users with a "Live" pulse dot
  const online = members.filter((m) => m.isOnline);
  // ⚪ Offline: Users shown with reduced opacity
  const offline = members.filter((m) => !m.isOnline);

  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-3", className)}>
        <div className="flex -space-x-2.5">
          {/* Online Members Loop */}
          {online.map((m) => (
            <Tooltip key={m.id}>
              <TooltipTrigger asChild>
                <div className="relative cursor-help transition-transform hover:z-10 hover:scale-110">
                  <Avatar className="h-8 w-8 border-2 border-background shadow-sm">
                    <AvatarFallback
                      className="text-[10px] font-bold"
                      style={{ backgroundColor: m.color, color: "#fff" }}
                    >
                      {m.initials}
                    </AvatarFallback>
                  </Avatar>
                  {/* The "Online" indicator dot */}
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-status-graded shadow-sm" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                {m.name} — Online
              </TooltipContent>
            </Tooltip>
          ))}

          {/* Offline Members Loop (Limited to 2 to prevent overcrowding) */}
          {offline.slice(0, 2).map((m) => (
            <Tooltip key={m.id}>
              <TooltipTrigger asChild>
                <div className="transition-transform hover:z-10 hover:scale-110">
                  <Avatar className="h-8 w-8 border-2 border-background opacity-40 grayscale-[0.5] shadow-sm">
                    <AvatarFallback className="text-[10px] font-medium bg-muted">
                      {m.initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                {m.name} — Offline
              </TooltipContent>
            </Tooltip>
          ))}
          
          {/* If there are more than 2 offline people, show a counter */}
          {offline.length > 2 && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium text-muted-foreground shadow-sm">
              +{offline.length - 2}
            </div>
          )}
        </div>

        {/* Text Summary */}
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          {online.length} Active {online.length === 1 ? 'user' : 'users'}
        </span>
      </div>
    </TooltipProvider>
  );
}