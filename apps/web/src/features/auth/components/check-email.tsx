import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@bola/ui/components/empty";
import { IconArrowLeft, IconMail } from "@tabler/icons-react";

interface CheckEmailProps {
  email: string;
  onBackToSignup: () => void;
}

export function CheckEmail({ email, onBackToSignup }: CheckEmailProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconMail />
        </EmptyMedia>
        <EmptyTitle className="text-lg">Check your email</EmptyTitle>
        <EmptyDescription>
          <p>We&apos;ve sent you a temporary verification link</p>
          <p>
            Please check your inbox at <span className="text-foreground">{email}</span>
          </p>
        </EmptyDescription>
      </EmptyHeader>
      <button onClick={onBackToSignup} className="flex cursor-pointer items-center gap-1 text-sm">
        <IconArrowLeft className="size-4" />
        Back to sign up
      </button>
    </Empty>
  );
}
