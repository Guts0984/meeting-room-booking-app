"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { removeMemberAction } from "../actions";
import type { RoomMember } from "../types";
import { RoleBadge } from "./role-badge";

export function MembersList({
  roomId,
  members,
  currentUserId,
  isAdmin,
}: {
  roomId: string;
  members: RoomMember[];
  currentUserId: string;
  isAdmin: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function onRemove(userId: string) {
    setError(null);
    setPendingId(userId);
    startTransition(async () => {
      const result = await removeMemberAction(roomId, userId);
      if (result?.error) setError(result.error);
      setPendingId(null);
    });
  }

  return (
    <div className="flex flex-col gap-2">
      {error && <FieldError>{error}</FieldError>}
      <ul className="flex flex-col divide-y divide-border rounded-xl bg-card ring-1 ring-foreground/10">
        {members.map((member) => (
          <li
            key={member.userId}
            className="flex items-center justify-between gap-3 px-4 py-3"
          >
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium">
                {member.user.name}
                {member.userId === currentUserId && (
                  <span className="ml-1.5 text-xs text-muted-foreground">
                    (you)
                  </span>
                )}
              </span>
              <span className="truncate text-sm text-muted-foreground">
                {member.user.email}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <RoleBadge role={member.role} />
              {isAdmin && member.userId !== currentUserId && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label={`Remove ${member.user.name}`}
                  disabled={pendingId === member.userId}
                  onClick={() => onRemove(member.userId)}
                >
                  <X />
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
