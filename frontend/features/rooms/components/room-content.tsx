import { requireUser } from "@/features/auth/session";
import { getRoom } from "../data";
import { getBookings } from "@/features/bookings/data";
import { redirect } from "next/navigation";
import Link from "next/link";
import { RoleBadge } from "./role-badge";
import { EditRoomDialog } from "./edit-room-dialog";
import { DeleteRoomDialog } from "./delete-room-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingFormDialog } from "@/features/bookings/components/booking-form-dialog";
import { Button } from "@/components/ui/button";
import { BookingsList } from "@/features/bookings/components/bookings-list";
import { AddMemberForm } from "./add-member-form";
import { MembersList } from "./members-list";

export default async function RoomContent({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const user = await requireUser();
  const [room, bookings] = await Promise.all([
    getRoom(roomId),
    getBookings(roomId),
  ]);

  if (!room) redirect("/dashboard");

  const role =
    room.members.find((member) => member.userId === user.id)?.role ?? "USER";
  const isAdmin = role === "ADMIN";

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-3">
        <Link
          href="/dashboard"
          className="w-fit text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; Back to rooms
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">{room.name}</h1>
            <RoleBadge role={role} />
          </div>
          {isAdmin && (
            <div className="flex items-center gap-2">
              <EditRoomDialog room={room} />
              <DeleteRoomDialog roomId={room.id} roomName={room.name} />
            </div>
          )}
        </div>
        {room.description && (
          <p className="text-sm text-muted-foreground">{room.description}</p>
        )}
      </div>

      <Tabs defaultValue="bookings">
        <TabsList>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>
        <TabsContent value="bookings" className="flex flex-col gap-4 pt-4">
          {isAdmin && (
            <div>
              <BookingFormDialog
                roomId={room.id}
                trigger={<Button>New booking</Button>}
              />
            </div>
          )}
          <BookingsList
            roomId={room.id}
            bookings={bookings}
            currentUserId={user.id}
            isAdmin={isAdmin}
          />
        </TabsContent>
        <TabsContent value="members" className="flex flex-col gap-4 pt-4">
          {isAdmin && <AddMemberForm roomId={room.id} />}
          <MembersList
            roomId={room.id}
            members={room.members}
            currentUserId={user.id}
            isAdmin={isAdmin}
          />
        </TabsContent>
      </Tabs>
    </main>
  );
}
