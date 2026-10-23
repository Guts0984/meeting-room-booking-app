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
import { RegisterForm } from "@/features/auth/register/register-form";
import { getSessionUser } from "@/features/auth/session";

export default function RegisterPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-4 mb-10">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Fill in the details below to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?
            <Link
              href="/login"
              className="text-primary underline-offset-4 hover:underline"
            >
              Sign in
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
