"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

import { AuthShell } from "@/components/auth-shell";
import { PasswordInput } from "@/components/password-input";
import { Button, ErrorText, Input } from "@/components/ui";
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
    <AuthShell
      title="Welcome back"
      subtitle="Log in to get back to your notes."
      footer={
        <>
          No account?{" "}
          <Link href="/register" className="font-medium text-accent hover:underline">
            Register
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
        <PasswordInput
          label="Password"
          name="password"
          autoComplete="current-password"
          minLength={6}
          maxLength={128}
          required
        />
        <ErrorText>{error}</ErrorText>
        <Button type="submit" disabled={busy} className="w-full py-2.5">
          {busy ? "Logging in…" : "Log in"}
        </Button>
      </form>
    </AuthShell>
  );
}
