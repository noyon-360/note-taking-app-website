"use client";

import { useState } from "react";

import { NoteForm } from "@/components/note-form";
import { Button, Card, ErrorText, ListStatus, PageTitle, Pagination } from "@/components/ui";
import { backend } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { Note } from "@/lib/types";
import { usePagedList } from "@/lib/use-paged-list";
import { useSubmit } from "@/lib/use-submit";

function NoteItem({ note, onChanged }: { note: Note; onChanged: () => void }) {
  const [editing, setEditing] = useState(false);
  const { run, busy, error } = useSubmit();

  async function save(values: { title: string; content: string }) {
    await backend(`/notes/${note.id}`, { method: "PATCH", body: values });
    setEditing(false);
    onChanged();
  }

  function remove() {
    if (!window.confirm(`Delete "${note.title}"?`)) return;
    run(async () => {
      await backend(`/notes/${note.id}`, { method: "DELETE" });
      onChanged();
    });
  }

  if (editing) {
    return (
      <Card>
        <NoteForm
          initial={note}
          submitLabel="Save"
          onSubmit={save}
          onCancel={() => setEditing(false)}
        />
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="font-semibold">{note.title}</h2>
      <p className="whitespace-pre-wrap text-sm">{note.content}</p>
      <p className="text-xs text-muted">Updated {formatDate(note.updatedAt)}</p>
      <ErrorText>{error}</ErrorText>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => setEditing(true)}>
          Edit
        </Button>
        <Button variant="danger" disabled={busy} onClick={remove}>
          Delete
        </Button>
      </div>
    </Card>
  );
}

export default function NotesPage() {
  const list = usePagedList<Note[]>("/notes");
  const notes = list.data ?? [];

  async function create(values: { title: string; content: string }) {
    await backend("/notes", { method: "POST", body: values });
    list.setPage(1);
    list.reload();
  }

  return (
    <>
      <PageTitle>My notes</PageTitle>
      <Card>
        <NoteForm submitLabel="Add note" onSubmit={create} />
      </Card>
      <ListStatus list={list} isEmpty={notes.length === 0} emptyText="No notes yet." />
      {notes.map((note) => (
        <NoteItem key={note.id} note={note} onChanged={list.reload} />
      ))}
      <Pagination list={list} />
    </>
  );
}
