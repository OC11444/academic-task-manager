import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  GraduationCap,
  Upload,
  BookOpen,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
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

export function AppSidebar({ role }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const items = role === "staff" ? staffItems : studentItems;

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
            {role === "staff" ? "Lecturer" : "Student"}
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
        {!collapsed && (
          <div className="flex items-center gap-2 rounded-lg bg-sidebar-accent/50 px-3 py-2">
            <div className="h-7 w-7 rounded-full bg-sidebar-primary/20" />
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-sidebar-foreground">
                {role === "staff" ? "Dr. Sarah Patel" : "Amara Osei"}
              </p>
              <p className="text-[10px] text-sidebar-foreground/50">
                {role === "staff" ? "Lecturer" : "Student"}
              </p>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
