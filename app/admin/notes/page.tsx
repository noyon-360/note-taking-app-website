"use client";

import Link from "next/link";

import { Card, ListStatus, PageTitle, Pagination } from "@/components/ui";
import { formatDate } from "@/lib/format";
import type { Note } from "@/lib/types";
import { usePagedList } from "@/lib/use-paged-list";

export default function AdminNotesPage() {
  const list = usePagedList<Note[]>("/admin/notes");
  const notes = list.data ?? [];

  return (
    <>
      <PageTitle>All notes</PageTitle>
      <ListStatus list={list} isEmpty={notes.length === 0} emptyText="No notes yet." />
      {notes.map((note) => (
        <Card key={note.id}>
          <h2 className="font-semibold">{note.title}</h2>
          <p className="whitespace-pre-wrap text-sm">{note.content}</p>
          <p className="text-xs text-muted">
            Owner{" "}
            <Link href={`/admin/users/${note.ownerId}`} className="text-accent">
              {note.ownerId}
            </Link>{" "}
            · Updated {formatDate(note.updatedAt)}
          </p>
        </Card>
      ))}
      <Pagination list={list} />
    </>
  );
}
