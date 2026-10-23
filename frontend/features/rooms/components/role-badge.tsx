import { cn } from "@/lib/utils";
import type { RoomRole } from "../types";

export function RoleBadge({
  role,
  className,
}: {
  role: RoomRole;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "rounded-md px-1.5 py-0.5 text-xs font-medium",
        role === "ADMIN"
          ? "bg-primary/10 text-primary"
          : "bg-muted text-muted-foreground",
        className,
      )}
    >
      {role === "ADMIN" ? "Admin" : "User"}
    </span>
  );
}
