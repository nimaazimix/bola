import { useEffect } from "react";
import { useRefresh } from "#/features/auth";
import { Loader } from "@bola/ui/components/loader";

export function AuthProvider({ children }: React.PropsWithChildren) {
  const { mutate: refresh, isIdle, isPending } = useRefresh();

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (isIdle || isPending) {
    return (
      <div className="centered min-h-screen">
        <Loader />
      </div>
    );
  }

  return children;
}
