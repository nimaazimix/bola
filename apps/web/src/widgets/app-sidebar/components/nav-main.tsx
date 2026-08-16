import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@bola/ui/components/sidebar";
import { Link } from "@tanstack/react-router";
import { FolderKanbanIcon, InboxIcon, LayoutDashboardIcon, SettingsIcon } from "lucide-react";

const items = [
  { title: "Home", url: "/home", icon: LayoutDashboardIcon },
  { title: "Inbox", url: "/inbox", icon: InboxIcon },
  { title: "Boards", url: "/boards", icon: FolderKanbanIcon },
  { title: "Settings", url: "/settings", icon: SettingsIcon },
];

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu className="gap-0.5">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} asChild>
                <Link
                  from="/$workspaceSlug"
                  to={`/$workspaceSlug/${item.url}`}
                  activeProps={{
                    className: "bg-sidebar-accent text-sidebar-accent-foreground border",
                  }}
                  activeOptions={{ exact: true }}
                >
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
