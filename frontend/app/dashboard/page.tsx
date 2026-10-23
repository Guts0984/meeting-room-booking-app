import { AppHeader, AppHeaderFallback } from "@/components/app-header";
import RoomsSection from "@/features/rooms/components/rooms-section";

import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <>
      <Suspense fallback={<AppHeaderFallback />}>
        <AppHeader />
      </Suspense>
      <Suspense fallback={null}>
        <RoomsSection />
      </Suspense>
    </>
  );
}
