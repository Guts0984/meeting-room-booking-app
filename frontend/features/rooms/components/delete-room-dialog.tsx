"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/field";
import { deleteRoomAction } from "../actions";

export function DeleteRoomDialog({
  roomId,
  roomName,
}: {
  roomId: string;
  roomName: string;
}) {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onDelete() {
    setServerError(null);
    startTransition(async () => {
      const result = await deleteRoomAction(roomId);
      if (result?.error) setServerError(result.error);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="destructive" />}>
        Delete room
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {roomName}?</DialogTitle>
          <DialogDescription>
            This will permanently delete the room and all of its bookings.
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {serverError && <FieldError>{serverError}</FieldError>}
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={onDelete}
          >
            {isPending ? "Deleting…" : "Delete room"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
