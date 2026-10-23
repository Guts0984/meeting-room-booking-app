import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/features/auth/login/login-form";
import { getSessionUser } from "@/features/auth/session";

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-4 mb-10">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-primary underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
      <Suspense fallback={null}>
        <GuestOnly />
      </Suspense>
    </main>
  );
}

async function GuestOnly() {
  const user = await getSessionUser();
  if (user) redirect("/dashboard");
  return null;
}
