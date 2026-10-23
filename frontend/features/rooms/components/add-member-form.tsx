"use client";

import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addMemberAction } from "../actions";
import { addMemberSchema, type AddMemberValues } from "../schemas";

export function AddMemberForm({ roomId }: { roomId: string }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<AddMemberValues>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: { email: "", role: "user" },
  });

  function onSubmit(values: AddMemberValues) {
    setServerError(null);
    startTransition(async () => {
      const result = await addMemberAction(roomId, values);
      if (result?.error) {
        setServerError(result.error);
      } else {
        form.reset();
      }
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="@container rounded-xl bg-card p-4 ring-1 ring-foreground/10"
    >
      <FieldGroup>
        <div className="flex flex-col gap-4 @xl:flex-row @xl:items-start">
          <Field className="min-w-0 @xl:flex-1">
            <FieldLabel htmlFor="add-member-email">Email</FieldLabel>
            <Input
              id="add-member-email"
              type="email"
              placeholder="teammate@example.com"
              aria-invalid={!!form.formState.errors.email}
              {...form.register("email")}
            />
            <FieldError errors={[form.formState.errors.email]} />
          </Field>
          <Field className="@xl:w-36">
            <FieldLabel htmlFor="add-member-role">Role</FieldLabel>
            <Controller
              control={form.control}
              name="role"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger
                    id="add-member-role"
                    className="w-full"
                    aria-invalid={!!form.formState.errors.role}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[form.formState.errors.role]} />
          </Field>

          <Field className="@xl:w-auto">
            <FieldLabel aria-hidden className="invisible hidden @xl:block">
              &nbsp;
            </FieldLabel>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding…" : "Add member"}
            </Button>
          </Field>
        </div>
        {serverError && <FieldError>{serverError}</FieldError>}
      </FieldGroup>
    </form>
  );
}
