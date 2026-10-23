import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { requireUser } from "@/features/auth/session";

export async function AppHeader() {
  const user = await requireUser();

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/dashboard" className="text-base font-semibold">
          Meeting Rooms
        </Link>
        <div className="flex items-center gap-3">
          <span className=" text-sm text-muted-foreground ">{user.name}</span>
          <ThemeToggle />
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}

export function AppHeaderFallback() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <span className="text-base font-semibold">Meeting Rooms</span>
        <div className="h-8 w-32 animate-pulse rounded-lg bg-muted" />
      </div>
    </header>
  );
}
