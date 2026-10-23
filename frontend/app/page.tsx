import { Suspense } from "react";

import { ThemeToggle } from "@/components/theme-toggle";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { WelcomePanel } from "@/components/welcome-panel";

export default function Home() {
  return (
    <>
      <header className="flex items-center justify-end px-6 py-3">
        <ThemeToggle />
      </header>
      <Suspense fallback={<WelcomeSkeleton />}>
        <WelcomePanel />
      </Suspense>
    </>
  );
}

function WelcomeSkeleton() {
  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-sm border shadow-md animate-pulse">
        <CardHeader>
          <div className="h-6 w-24 bg-muted rounded mb-2" />
          <div className="h-4 w-48 bg-muted rounded" />
        </CardHeader>
        <CardContent className="flex gap-2">
          <div className="h-9 flex-1 bg-muted rounded" />
          <div className="h-9 flex-1 bg-muted rounded" />
        </CardContent>
      </Card>
    </main>
  );
}
