"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import {
  Button,
  Card,
  ErrorText,
  Input,
  ListStatus,
  PageTitle,
  Pagination,
  Select,
} from "@/components/ui";
import { backend } from "@/lib/api";
import { splitList } from "@/lib/format";
import type { User } from "@/lib/types";
import { usePagedList } from "@/lib/use-paged-list";
import { useSession } from "@/lib/use-session";
import { useSubmit } from "@/lib/use-submit";

function UserFields({ user }: { user?: User }) {
  return (
    <>
      <Input label="Name" name="name" defaultValue={user?.name} minLength={2} required />
      <Input label="Email" name="email" type="email" defaultValue={user?.email} required />
      <Input
        label={user ? "New password (leave empty to keep)" : "Password"}
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required={!user}
      />
      <Select label="Role" name="role" defaultValue={user?.role ?? "user"}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </Select>
      <Input
        label="Interests (comma separated)"
        name="interests"
        defaultValue={user?.interests.join(", ")}
      />
    </>
  );
}

function readUserForm(element: HTMLFormElement) {
  const form = new FormData(element);
  const password = String(form.get("password"));

  return {
    name: form.get("name"),
    email: form.get("email"),
    role: form.get("role"),
    interests: splitList(form.get("interests")),
    ...(password && { password }),
  };
}

function CreateUser({ onCreated }: { onCreated: () => void }) {
  const { run, busy, error } = useSubmit();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const element = event.currentTarget;

    run(async () => {
      await backend("/users", { method: "POST", body: readUserForm(element) });
      element.reset();
      onCreated();
    });
  }

  return (
    <Card>
      <h2 className="font-semibold">Add user</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <UserFields />
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
  const [editing, setEditing] = useState(false);
  const { run, busy, error } = useSubmit();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const element = event.currentTarget;

    run(async () => {
      await backend(`/users/${user.id}`, { method: "PATCH", body: readUserForm(element) });
      setEditing(false);
      onChanged();
    });
  }

  function remove() {
    if (!window.confirm(`Delete ${user.name}?`)) return;
    run(async () => {
      await backend(`/users/${user.id}`, { method: "DELETE" });
      onChanged();
    });
  }

  if (editing) {
    return (
      <Card>
        <form onSubmit={handleSubmit} className="space-y-3">
          <UserFields user={user} />
          <ErrorText>{error}</ErrorText>
          <div className="flex gap-2">
            <Button type="submit" disabled={busy}>
              Save
            </Button>
            <Button type="button" variant="secondary" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="font-semibold">
        {user.name} <span className="text-xs font-normal text-muted">{user.role}</span>
      </h2>
      <p className="text-sm">{user.email}</p>
      {user.interests.length > 0 && (
        <p className="text-sm text-muted">{user.interests.join(", ")}</p>
      )}
      <ErrorText>{error}</ErrorText>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => setEditing(true)}>
          Edit
        </Button>
        {user.id !== currentUser?.id && (
          <Button variant="danger" disabled={busy} onClick={remove}>
            Delete
          </Button>
        )}
      </div>
    </Card>
  );
}

export default function AdminUsersPage() {
  const list = usePagedList<User[]>("/users");
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
