"use client";

import type { FormEvent } from "react";

import { Button, ErrorText, Input, Textarea } from "@/components/ui";
import { useSubmit } from "@/lib/use-submit";

type NoteValues = { title: string; content: string };

export function NoteForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: NoteValues;
  submitLabel: string;
  onSubmit: (values: NoteValues) => Promise<void>;
  onCancel?: () => void;
}) {
  const { run, busy, error } = useSubmit();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const element = event.currentTarget;
    const form = new FormData(element);

    run(async () => {
      await onSubmit({
        title: String(form.get("title")),
        content: String(form.get("content")),
      });
      element.reset();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input label="Title" name="title" defaultValue={initial?.title} maxLength={200} required />
      <Textarea
        label="Content"
        name="content"
        defaultValue={initial?.content}
        maxLength={20000}
        required
      />
      <ErrorText>{error}</ErrorText>
      <div className="flex gap-2">
        <Button type="submit" disabled={busy}>
          {busy ? "Saving…" : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
