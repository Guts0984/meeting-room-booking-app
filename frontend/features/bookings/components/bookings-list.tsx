"use client";

import { useState, useSyncExternalStore, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription as ConfirmDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/field";
import {
  deleteBookingAction,
  joinBookingAction,
  leaveBookingAction,
} from "../actions";
import type { Booking } from "../types";
import { BookingFormDialog } from "./booking-form-dialog";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit",
});

function formatRange(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();
  if (sameDay) {
    return `${dateFormatter.format(start)}, ${timeFormatter.format(start)} – ${timeFormatter.format(end)}`;
  }
  return `${dateFormatter.format(start)}, ${timeFormatter.format(start)} – ${dateFormatter.format(end)}, ${timeFormatter.format(end)}`;
}

// Returns false on the server and during hydration, then true on the client.
// useSyncExternalStore avoids calling setState inside an effect.
const subscribe = () => () => {};

function useIsMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export function BookingsList({
  roomId,
  bookings,
  currentUserId,
  isAdmin,
}: {
  roomId: string;
  bookings: Booking[];
  currentUserId: string;
  isAdmin: boolean;
}) {
  const sorted = [...bookings].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
  );

  if (sorted.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No bookings yet.{isAdmin ? " Create one to reserve the room." : ""}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((booking) => (
        <BookingCard
          key={booking.id}
          roomId={roomId}
          booking={booking}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
}

function BookingCard({
  roomId,
  booking,
  currentUserId,
  isAdmin,
}: {
  roomId: string;
  booking: Booking;
  currentUserId: string;
  isAdmin: boolean;
}) {
  const mounted = useIsMounted();
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isCreator = booking.createdById === currentUserId;
  const isAttendee = booking.attendees.some((a) => a.userId === currentUserId);

  function handleConfirmOpenChange(open: boolean) {
    setConfirmOpen(open);
    setError(null);
  }

  function run(
    action: () => Promise<{ error: string } | undefined>,
    { closeConfirm = false } = {},
  ) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result?.error) {
        setError(result.error);
      } else if (closeConfirm) {
        setConfirmOpen(false);
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mounted ? formatRange(booking.startTime, booking.endTime) : "\u00A0"}
        </CardTitle>
        <CardDescription>Created by {booking.createdBy.name}</CardDescription>
        {isAdmin && (
          <CardAction className="flex">
            <BookingFormDialog
              roomId={roomId}
              booking={booking}
              trigger={
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              }
            />
            <Dialog open={confirmOpen} onOpenChange={handleConfirmOpenChange}>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={() => handleConfirmOpenChange(true)}
              >
                Cancel booking
              </Button>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cancel this booking?</DialogTitle>
                  <ConfirmDescription>
                    This will permanently remove the booking. This action cannot
                    be undone.
                  </ConfirmDescription>
                </DialogHeader>
                {error && <FieldError>{error}</FieldError>}
                <DialogFooter>
                  <DialogClose render={<Button variant="outline" />}>
                    Keep booking
                  </DialogClose>
                  <Button
                    variant="destructive"
                    disabled={isPending}
                    onClick={() =>
                      run(() => deleteBookingAction(roomId, booking.id), {
                        closeConfirm: true,
                      })
                    }
                  >
                    {isPending ? "Cancelling…" : "Cancel booking"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {booking.description && (
          <p className="text-sm">{booking.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Attendees:</span>
          {booking.attendees.length === 0 ? (
            <span className="text-xs text-muted-foreground">None yet</span>
          ) : (
            booking.attendees.map((attendee) => (
              <span
                key={attendee.userId}
                className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground"
              >
                {attendee.user.name}
              </span>
            ))
          )}
        </div>
        {error && !confirmOpen && <FieldError>{error}</FieldError>}
        {!isCreator && (
          <div>
            {isAttendee ? (
              <Button
                variant="outline"
                size="sm"
                disabled={isPending}
                onClick={() =>
                  run(() => leaveBookingAction(roomId, booking.id))
                }
              >
                Leave
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                disabled={isPending}
                onClick={() => run(() => joinBookingAction(roomId, booking.id))}
              >
                Join
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
