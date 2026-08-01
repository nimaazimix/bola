import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@bola/ui/components/sidebar";
import { Link } from "@tanstack/react-router";
import { IconHome, IconInbox, IconSettings } from "@tabler/icons-react";

const items = [
  { title: "Home", url: "/", icon: IconHome },
  { title: "Inbox", url: "/inbox", icon: IconInbox },
  { title: "Settings", url: "/settings", icon: IconSettings },
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
                activeOptions={{ exact: true }}
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
