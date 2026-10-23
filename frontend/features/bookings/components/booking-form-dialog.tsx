"use client";

import { useState, useTransition, type ReactElement } from "react";
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
import { createBookingAction, updateBookingAction } from "../actions";
import { bookingSchema, type BookingValues } from "../schemas";
import type { Booking } from "../types";

function toLocalInputValue(iso: string): string {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function BookingFormDialog({
  roomId,
  booking,
  trigger,
}: {
  roomId: string;
  booking?: Booking;
  trigger: ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { description: "", start: "", end: "" },
  });

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      form.reset({
        description: booking?.description ?? "",
        start: booking ? toLocalInputValue(booking.startTime) : "",
        end: booking ? toLocalInputValue(booking.endTime) : "",
      });
      setServerError(null);
    }
  }

  function onSubmit(values: BookingValues) {
    setServerError(null);
    const payload: BookingValues = {
      ...values,
      start: new Date(values.start).toISOString(),
      end: new Date(values.end).toISOString(),
    };
    startTransition(async () => {
      const result = booking
        ? await updateBookingAction(roomId, booking.id, payload)
        : await createBookingAction(roomId, payload);
      if (result?.error) {
        setServerError(result.error);
      } else {
        setOpen(false);
        form.reset();
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{booking ? "Edit booking" : "New booking"}</DialogTitle>
          <DialogDescription>
            {booking
              ? "Update the booking details or time."
              : "Pick a time slot and add an optional description."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="booking-description">
                Description
              </FieldLabel>
              <Textarea
                id="booking-description"
                placeholder="What is this booking for?"
                aria-invalid={!!form.formState.errors.description}
                {...form.register("description")}
              />
              <FieldError errors={[form.formState.errors.description]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="booking-start">Start</FieldLabel>
              <Input
                id="booking-start"
                type="datetime-local"
                aria-invalid={!!form.formState.errors.start}
                {...form.register("start")}
              />
              <FieldError errors={[form.formState.errors.start]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="booking-end">End</FieldLabel>
              <Input
                id="booking-end"
                type="datetime-local"
                aria-invalid={!!form.formState.errors.end}
                {...form.register("end")}
              />
              <FieldError errors={[form.formState.errors.end]} />
            </Field>
            {serverError && <FieldError>{serverError}</FieldError>}
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Saving…"
                : booking
                  ? "Save changes"
                  : "Create booking"}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
