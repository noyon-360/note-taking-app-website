"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";

import { Button, Card, Input, ListStatus, PageTitle, Pagination } from "@/components/ui";
import { splitList } from "@/lib/format";
import type { InterestGroup } from "@/lib/types";
import { usePagedList } from "@/lib/use-paged-list";

export default function InterestsPage() {
  const [interests, setInterests] = useState<string[]>([]);
  const query = interests.map((item) => `interests=${encodeURIComponent(item)}`).join("&");
  const list = usePagedList<InterestGroup[]>(`/admin/grouped_by_interests${query && `?${query}`}`);
  const groups = list.data ?? [];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setInterests(splitList(new FormData(event.currentTarget).get("interests")));
  }

  return (
    <>
      <PageTitle>Users by interest</PageTitle>
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="flex-1">
          <Input
            label="Filter by interests (comma separated, empty shows all)"
            name="interests"
            placeholder="music, travel"
          />
        </div>
        <Button type="submit">Apply</Button>
      </form>
      <ListStatus list={list} isEmpty={groups.length === 0} emptyText="No matching interests." />
      {groups.map((group) => (
        <Card key={group.interest}>
          <h2 className="font-semibold">
            {group.interest} ({group.userCount})
          </h2>
          {group.users.length < group.userCount && (
            <p className="text-xs text-muted">
              Showing the first {group.users.length} users.
            </p>
          )}
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {group.users.map((user) => (
              <li key={user.id}>
                <Link href={`/users/${user.id}/posts`} className="text-accent">
                  {user.name}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      ))}
      <Pagination list={list} />
    </>
  );
}
