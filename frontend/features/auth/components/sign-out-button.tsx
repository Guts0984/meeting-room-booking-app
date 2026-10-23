"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "../actions";

export function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() => startTransition(() => logoutAction())}
    >
      {isPending ? "Signing out…" : "Sign out"}
    </Button>
  );
}
