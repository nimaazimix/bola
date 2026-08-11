import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@bola/ui/components/sidebar";
import { Link } from "@tanstack/react-router";
import { HouseIcon, InboxIcon, SettingsIcon } from "lucide-react";

const items = [
  { title: "Home", url: "/home", icon: HouseIcon },
  { title: "Inbox", url: "/inbox", icon: InboxIcon },
  { title: "Settings", url: "/settings", icon: SettingsIcon },
];

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton tooltip={item.title} asChild>
              <Link
                from="/$workspaceSlug"
                to={`/$workspaceSlug/${item.url}`}
                activeProps={{
                  className: "bg-sidebar-accent text-sidebar-accent-foreground border",
                }}
              >
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
