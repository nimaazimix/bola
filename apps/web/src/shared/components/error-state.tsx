import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@bola/ui/components/empty";

interface ErrorStateProps extends React.ComponentProps<typeof Empty> {
  icon: React.ReactNode;
  title: string;
  message: string;
}

export function ErrorState({ icon, title, message, className, children }: ErrorStateProps) {
  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyMedia variant="icon">{icon}</EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{message}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">{children}</EmptyContent>
    </Empty>
  );
}
