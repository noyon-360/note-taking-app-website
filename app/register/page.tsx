"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

import { Button, Card, ErrorText, Input, PageTitle } from "@/components/ui";
import { signIn } from "@/lib/api";
import { splitList } from "@/lib/format";
import { useSession } from "@/lib/use-session";
import { useSubmit } from "@/lib/use-submit";

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useSession();
  const { run, busy, error } = useSubmit();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    run(async () => {
      const user = await signIn("register", {
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
        confirmPassword: form.get("confirmPassword"),
        interests: splitList(form.get("interests")),
      });
      setUser(user);
      router.replace("/notes");
    });
  }

  return (
    <div className="mx-auto max-w-sm space-y-4 pt-10">
      <PageTitle>Create an account</PageTitle>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input label="Name" name="name" autoComplete="name" minLength={2} required />
          <Input label="Email" name="email" type="email" autoComplete="email" required />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={6}
            required
          />
          <Input
            label="Confirm password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
          />
          <Input
            label="Interests (comma separated)"
            name="interests"
            placeholder="music, travel"
          />
          <ErrorText>{error}</ErrorText>
          <Button type="submit" disabled={busy}>
            {busy ? "Creating account…" : "Register"}
          </Button>
        </form>
      </Card>
      <p className="text-sm text-muted">
        Already registered?{" "}
        <Link href="/login" className="text-accent">
          Log in
        </Link>
      </p>
    </div>
  );
}
