"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

import { AuthShell } from "@/components/auth-shell";
import { PasswordInput } from "@/components/password-input";
import { Button, ErrorText, Input } from "@/components/ui";
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
    <AuthShell
      title="Create an account"
      subtitle="Sign up to start writing notes and posts."
      footer={
        <>
          Already registered?{" "}
          <Link href="/login" className="font-medium text-accent hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          name="name"
          autoComplete="name"
          minLength={2}
          maxLength={100}
          required
        />
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
          autoComplete="new-password"
          minLength={6}
          maxLength={128}
          required
        />
        <PasswordInput
          label="Confirm password"
          name="confirmPassword"
          autoComplete="new-password"
          maxLength={128}
          required
        />
        <Input
          label="Interests (comma separated)"
          name="interests"
          placeholder="music, travel"
        />
        <ErrorText>{error}</ErrorText>
        <Button type="submit" disabled={busy} className="w-full py-2.5">
          {busy ? "Creating account…" : "Register"}
        </Button>
      </form>
    </AuthShell>
  );
}
