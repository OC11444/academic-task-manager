import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { TeamMember } from "@/stores/mockData";

interface TeamPresenceProps {
  members: TeamMember[];
}

export function TeamPresence({ members }: TeamPresenceProps) {
  const online = members.filter((m) => m.isOnline);
  const offline = members.filter((m) => !m.isOnline);

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {online.map((m) => (
          <Tooltip key={m.id}>
            <TooltipTrigger asChild>
              <div className="relative">
                <Avatar className="h-8 w-8 border-2 border-background">
                  <AvatarFallback
                    className="text-xs font-semibold"
                    style={{ backgroundColor: m.color, color: "#fff" }}
                  >
                    {m.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-status-graded" />
              </div>
            </TooltipTrigger>
            <TooltipContent>{m.name} — Online</TooltipContent>
          </Tooltip>
        ))}
        {offline.slice(0, 2).map((m) => (
          <Tooltip key={m.id}>
            <TooltipTrigger asChild>
              <Avatar className="h-8 w-8 border-2 border-background opacity-50">
                <AvatarFallback className="text-xs">{m.initials}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>{m.name} — Offline</TooltipContent>
          </Tooltip>
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {online.length} online
      </span>
    </div>
  );
}
