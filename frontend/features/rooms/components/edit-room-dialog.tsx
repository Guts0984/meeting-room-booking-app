"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateRoomAction } from "../actions";
import { roomSchema, type RoomValues } from "../schemas";
import type { RoomWithMembers } from "../types";

export function EditRoomDialog({ room }: { room: RoomWithMembers }) {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<RoomValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: { name: room.name, description: room.description ?? "" },
  });

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      form.reset({ name: room.name, description: room.description ?? "" });
      setServerError(null);
    }
  }

  function onSubmit(values: RoomValues) {
    setServerError(null);
    startTransition(async () => {
      const result = await updateRoomAction(room.id, values);
      if (result?.error) {
        setServerError(result.error);
      } else {
        setOpen(false);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="outline" />}>
        Edit room
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit room</DialogTitle>
          <DialogDescription>
            Update the room&apos;s name or description.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="edit-room-name">Name</FieldLabel>
              <Input
                id="edit-room-name"
                aria-invalid={!!form.formState.errors.name}
                {...form.register("name")}
              />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="edit-room-description">
                Description
              </FieldLabel>
              <Textarea
                id="edit-room-description"
                placeholder="What is this room for?"
                aria-invalid={!!form.formState.errors.description}
                {...form.register("description")}
              />
              <FieldError errors={[form.formState.errors.description]} />
            </Field>
            {serverError && <FieldError>{serverError}</FieldError>}
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : "Save changes"}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
