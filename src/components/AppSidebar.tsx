import { LayoutDashboard, GraduationCap } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuthUser } from "@/hooks/useAuthUser";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  role: "staff" | "student";
}

const staffItems = [
  { title: "Dashboard", url: "/staff", icon: LayoutDashboard },
];

const studentItems = [
  { title: "Dashboard", url: "/student", icon: LayoutDashboard },
];

function roleLabel(r: "staff" | "student") {
  return r === "staff" ? "Lecturer" : "Student";
}

export function AppSidebar({ role }: AppSidebarProps) {
  const user = useAuthUser();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const items = role === "staff" ? staffItems : studentItems;
  const effectiveRole = user?.role ?? role;
  const primaryName =
    user?.displayName?.trim() || user?.username?.trim() || "";
  const initials =
    primaryName.length > 0 ? primaryName.substring(0, 2).toUpperCase() : "U";
  const roleLine =
    user?.roleDisplay?.trim() || roleLabel(effectiveRole);

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <div className="px-3 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
                <GraduationCap className="h-4 w-4 text-sidebar-primary-foreground" />
              </div>
              {!collapsed && (
                <div>
                  <p className="text-sm font-bold text-sidebar-foreground">Collab</p>
                  <p className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">
                    Task Manager
                  </p>
                </div>
              )}
            </div>
          </div>

          <SidebarGroupLabel className="text-sidebar-foreground/50">
            {roleLine}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/staff" || item.url === "/student"}
                      className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <div
          className={
            collapsed
              ? "flex justify-center"
              : "flex items-center gap-3 rounded-lg bg-sidebar-accent/50 p-3"
          }
        >
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary/15 text-[10px] font-bold text-sidebar-primary"
            aria-hidden
          >
            {initials}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {primaryName || "Account"}
              </p>
              <p className="text-[10px] font-medium uppercase tracking-wide text-sidebar-foreground/50">
                {roleLine}
              </p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
