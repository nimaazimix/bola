import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@bola/ui/components/empty";
import type { IconProps } from "@tabler/icons-react";

export interface ErrorStateProps extends React.ComponentProps<typeof Empty> {
  icon: React.ComponentType<IconProps>;
  title: string;
  message: string;
}

export function ErrorState({ icon: Icon, title, message, className, children }: ErrorStateProps) {
  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{message}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">{children}</EmptyContent>
    </Empty>
  );
}
