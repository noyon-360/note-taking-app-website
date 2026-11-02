"use client";

import Link from "next/link";

import { Card, ListStatus, PageTitle } from "@/components/ui";
import type { User } from "@/lib/types";
import { usePagedList } from "@/lib/use-paged-list";

export function UserDetail({ userId }: { userId: string }) {
  const list = usePagedList<User>(`/admin/users/${userId}`);
  const user = list.data;

  return (
    <>
      <Link href="/admin/users" className="text-sm text-accent">
        Back to users
      </Link>
      <PageTitle>{user?.name ?? "User"}</PageTitle>
      <ListStatus list={list} isEmpty={false} emptyText="" />
      {user && (
        <Card>
          <p className="text-sm">{user.email}</p>
          <p className="text-sm text-muted">Role: {user.role}</p>
          {user.interests.length > 0 && (
            <p className="text-sm text-muted">{user.interests.join(", ")}</p>
          )}
          <p className="text-xs text-muted">ID {user.id}</p>
        </Card>
      )}
    </>
  );
}
