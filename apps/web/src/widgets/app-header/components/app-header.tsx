import { SidebarTrigger } from "@bola/ui/components/sidebar";
import { Separator } from "@bola/ui/components/separator";
import { Breadcrumbs } from "./breadcrumbs";

export function AppHeader() {
  return (
    <header className="flex h-16 items-center border-b group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-1.5 data-vertical:h-4 data-vertical:self-center"
        />

        <Breadcrumbs />
      </div>
    </header>
  );
}
