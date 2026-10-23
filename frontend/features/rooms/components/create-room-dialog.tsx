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
import { createRoomAction } from "../actions";
import { roomSchema, type RoomValues } from "../schemas";

export function CreateRoomDialog() {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<RoomValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: { name: "", description: "" },
  });

  function onSubmit(values: RoomValues) {
    setServerError(null);
    startTransition(async () => {
      const result = await createRoomAction(values);
      if (result?.error) {
        setServerError(result.error);
      } else {
        setOpen(false);
        form.reset();
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>New room</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a room</DialogTitle>
          <DialogDescription>
            Give your meeting room a name and an optional description.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="create-room-name">Name</FieldLabel>
              <Input
                id="create-room-name"
                placeholder="Engineering sync"
                aria-invalid={!!form.formState.errors.name}
                {...form.register("name")}
              />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="create-room-description">
                Description
              </FieldLabel>
              <Textarea
                id="create-room-description"
                placeholder="What is this room for?"
                aria-invalid={!!form.formState.errors.description}
                {...form.register("description")}
              />
              <FieldError errors={[form.formState.errors.description]} />
            </Field>
            {serverError && <FieldError>{serverError}</FieldError>}
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating…" : "Create room"}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
