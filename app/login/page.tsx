"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

import { Button, Card, ErrorText, Input, PageTitle } from "@/components/ui";
import { signIn } from "@/lib/api";
import { useSession } from "@/lib/use-session";
import { useSubmit } from "@/lib/use-submit";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useSession();
  const { run, busy, error } = useSubmit();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    run(async () => {
      const user = await signIn("login", {
        email: form.get("email"),
        password: form.get("password"),
      });
      setUser(user);
      router.replace("/notes");
    });
  }

  return (
    <div className="mx-auto max-w-sm space-y-4 pt-10">
      <PageTitle>Log in</PageTitle>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input label="Email" name="email" type="email" autoComplete="email" required />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            minLength={6}
            required
          />
          <ErrorText>{error}</ErrorText>
          <Button type="submit" disabled={busy}>
            {busy ? "Logging in…" : "Log in"}
          </Button>
        </form>
      </Card>
      <p className="text-sm text-muted">
        No account?{" "}
        <Link href="/register" className="text-accent">
          Register
        </Link>
      </p>
    </div>
  );
}
