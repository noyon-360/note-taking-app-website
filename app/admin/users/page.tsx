"use client";

import Link from "next/link";
import type { FormEvent } from "react";

import { PasswordInput } from "@/components/password-input";
import {
  Button,
  Card,
  ErrorText,
  Input,
  ListStatus,
  PageTitle,
  Pagination,
} from "@/components/ui";
import { backend } from "@/lib/api";
import { splitList } from "@/lib/format";
import type { User } from "@/lib/types";
import { usePagedList } from "@/lib/use-paged-list";
import { useSession } from "@/lib/use-session";
import { useSubmit } from "@/lib/use-submit";

function CreateUser({ onCreated }: { onCreated: () => void }) {
  const { run, busy, error } = useSubmit();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const element = event.currentTarget;
    const form = new FormData(element);

    run(async () => {
      await backend("/admin/user", {
        method: "POST",
        body: {
          name: form.get("name"),
          email: form.get("email"),
          password: form.get("password"),
          confirmPassword: form.get("confirmPassword"),
          interests: splitList(form.get("interests")),
        },
      });
      element.reset();
      onCreated();
    });
  }

  return (
    <Card>
      <h2 className="font-semibold">Add user</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input label="Name" name="name" minLength={2} maxLength={100} required />
        <Input label="Email" name="email" type="email" required />
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
        <Input label="Interests (comma separated)" name="interests" />
        <ErrorText>{error}</ErrorText>
        <Button type="submit" disabled={busy}>
          Add user
        </Button>
      </form>
    </Card>
  );
}

function UserItem({ user, onChanged }: { user: User; onChanged: () => void }) {
  const { user: currentUser } = useSession();
  const { run, busy, error } = useSubmit();
  const nextRole = user.role === "admin" ? "user" : "admin";

  function changeRole() {
    if (!window.confirm(`Change ${user.name}'s role to ${nextRole}?`)) return;
    run(async () => {
      await backend(`/admin/user/${user.id}/role`, {
        method: "PATCH",
        body: { role: nextRole },
      });
      onChanged();
    });
  }

  function remove() {
    if (!window.confirm(`Delete ${user.name} and all their content?`)) return;
    run(async () => {
      await backend(`/admin/user/${user.id}`, { method: "DELETE" });
      onChanged();
    });
  }

  return (
    <Card>
      <h2 className="font-semibold">
        <Link href={`/admin/users/${user.id}`} className="text-accent">
          {user.name}
        </Link>{" "}
        <span className="text-xs font-normal text-muted">{user.role}</span>
      </h2>
      <p className="text-sm">{user.email}</p>
      {user.interests.length > 0 && (
        <p className="text-sm text-muted">{user.interests.join(", ")}</p>
      )}
      <ErrorText>{error}</ErrorText>
      {user.id !== currentUser?.id && (
        <div className="flex gap-2">
          <Button variant="secondary" disabled={busy} onClick={changeRole}>
            Make {nextRole}
          </Button>
          <Button variant="danger" disabled={busy} onClick={remove}>
            Delete
          </Button>
        </div>
      )}
    </Card>
  );
}

export default function AdminUsersPage() {
  const list = usePagedList<User[]>("/admin/users");
  const users = list.data ?? [];

  return (
    <>
      <PageTitle>Users</PageTitle>
      <CreateUser onCreated={list.reload} />
      <ListStatus list={list} isEmpty={users.length === 0} emptyText="No users yet." />
      {users.map((user) => (
        <UserItem key={user.id} user={user} onChanged={list.reload} />
      ))}
      <Pagination list={list} />
    </>
  );
}
