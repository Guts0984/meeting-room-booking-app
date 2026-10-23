import { Suspense } from "react";
import { AppHeader, AppHeaderFallback } from "@/components/app-header";
import RoomContent from "@/features/rooms/components/room-content";

export default function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  return (
    <>
      <Suspense fallback={<AppHeaderFallback />}>
        <AppHeader />
      </Suspense>
      <Suspense fallback={null}>
        <RoomContent params={params} />
      </Suspense>
    </>
  );
}
