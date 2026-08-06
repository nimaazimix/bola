import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@bola/ui/components/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@bola/ui/components/dropdown-menu";
import { Avatar, AvatarFallback } from "@bola/ui/components/avatar";
import {
  IconAdjustments,
  IconLogout,
  IconSelector,
  IconSettings,
  IconUserHexagon,
} from "@tabler/icons-react";

import { useAuthStore } from "#/shared/stores/auth.store";
import { useSignOut } from "#/features/auth";
import { getInitial } from "#/shared/lib/string";

export function NavUser() {
  const { isMobile } = useSidebar();

  const user = useAuthStore((state) => state.user);
  const { mutate: signOut } = useSignOut();

  if (!user) return;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="after:rounded-lg">
                <AvatarFallback className="rounded-lg">{getInitial(user.name)}</AvatarFallback>
              </Avatar>
              <div className="grid leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <IconSelector className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side={isMobile ? "bottom" : "right"}
            sideOffset={6}
            align="end"
            className="min-w-56"
          >
            <DropdownMenuLabel className="text-foreground flex items-center gap-2 text-sm font-normal">
              <Avatar className="after:rounded-lg">
                <AvatarFallback className="rounded-lg">{getInitial(user.name)}</AvatarFallback>
              </Avatar>
              <div className="grid leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconUserHexagon />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconAdjustments />
                Preferences
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconSettings />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => signOut()}>
              <IconLogout />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
