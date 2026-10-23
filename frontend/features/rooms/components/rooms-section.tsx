import { requireUser } from "@/features/auth/session";
import { CreateRoomDialog } from "@/features/rooms/components/create-room-dialog";
import { RoleBadge } from "@/features/rooms/components/role-badge";
import { getRooms } from "@/features/rooms/data";
import Link from "next/link";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

export default async function RoomsSection() {
  await requireUser();
  const rooms = await getRooms();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Your rooms</h1>
        <CreateRoomDialog />
      </div>
      {rooms.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          You&apos;re not a member of any rooms yet. Create one to get started.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <Link
              key={room.id}
              href={`/rooms/${room.id}`}
              className="block rounded-xl transition-shadow focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <Card className="h-full transition-colors hover:bg-muted/40">
                <CardHeader>
                  <CardTitle>{room.name}</CardTitle>
                  <CardAction>
                    <RoleBadge role={room.role} />
                  </CardAction>
                  <CardDescription>
                    {room.description ?? "No description"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Created{" "}
                    {new Date(room.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
