"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { Button, Card, ErrorText, Input, ListStatus, PageTitle } from "@/components/ui";
import { backend, logout, refreshSession } from "@/lib/api";
import { splitList } from "@/lib/format";
import type { User } from "@/lib/types";
import { usePagedList } from "@/lib/use-paged-list";
import { useSession } from "@/lib/use-session";
import { useSubmit } from "@/lib/use-submit";

function ProfileDetails({ profile, onChanged }: { profile: User; onChanged: () => void }) {
  const { setUser } = useSession();
  const [editing, setEditing] = useState(false);
  const { run, busy, error } = useSubmit();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    run(async () => {
      await backend("/users", {
        method: "PATCH",
        body: {
          name: form.get("name"),
          email: form.get("email"),
          interests: splitList(form.get("interests")),
        },
      });
      setUser(await refreshSession());
      setEditing(false);
      onChanged();
    });
  }

  if (editing) {
    return (
      <Card>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            label="Name"
            name="name"
            autoComplete="name"
            defaultValue={profile.name}
            minLength={2}
            maxLength={100}
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={profile.email}
            required
          />
          <Input
            label="Interests (comma separated)"
            name="interests"
            defaultValue={profile.interests.join(", ")}
          />
          <ErrorText>{error}</ErrorText>
          <div className="flex gap-2">
            <Button type="submit" disabled={busy}>
              {busy ? "Saving…" : "Save"}
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
        {profile.name} <span className="text-xs font-normal text-muted">{profile.role}</span>
      </h2>
      <p className="text-sm">{profile.email}</p>
      {profile.interests.length > 0 && (
        <p className="text-sm text-muted">{profile.interests.join(", ")}</p>
      )}
      <Button variant="secondary" onClick={() => setEditing(true)}>
        Edit
      </Button>
    </Card>
  );
}

function DeleteAccount() {
  const { run, busy, error } = useSubmit();

  function remove() {
    if (!window.confirm("Permanently delete your account? This can't be undone.")) return;
    run(async () => {
      await backend("/users", { method: "DELETE" });
      await logout();
    });
  }

  return (
    <Card>
      <h2 className="font-semibold">Delete account</h2>
      <p className="text-sm text-muted">This permanently removes your account.</p>
      <ErrorText>{error}</ErrorText>
      <Button variant="danger" disabled={busy} onClick={remove}>
        Delete my account
      </Button>
    </Card>
  );
}

export default function ProfilePage() {
  const list = usePagedList<User>("/users");

  return (
    <>
      <PageTitle>Profile</PageTitle>
      <ListStatus list={list} isEmpty={false} emptyText="" />
      {list.data && (
        <>
          <ProfileDetails profile={list.data} onChanged={list.reload} />
          {/* The API refuses this for admins. */}
          {list.data.role !== "admin" && <DeleteAccount />}
        </>
      )}
    </>
  );
}
