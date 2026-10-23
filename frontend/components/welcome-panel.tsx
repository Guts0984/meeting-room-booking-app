import { getSessionUser } from "@/features/auth/session";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";

export async function WelcomePanel() {
  const user = await getSessionUser();
  if (user) redirect("/dashboard");

  return (
    <main className="flex flex-1 items-center justify-center p-4 mb-10">
      <Card className="w-full max-w-sm border shadow-md">
        <CardHeader>
          <CardTitle>Hello!</CardTitle>
          <CardDescription>
            To continue, please log into your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button
            className="flex-1"
            nativeButton={false}
            render={<Link href="/login" />}
          >
            Sign in
          </Button>
          <Button
            className="flex-1"
            variant="outline"
            nativeButton={false}
            render={<Link href="/register" />}
          >
            Sign up
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
