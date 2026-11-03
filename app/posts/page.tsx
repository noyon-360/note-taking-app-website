"use client";

import Link from "next/link";
import { useState } from "react";

import { Dialog } from "@/components/dialog";
import { NoteForm } from "@/components/note-form";
import { PostItem } from "@/components/post-item";
import { Button, ListStatus, PageTitle, Pagination } from "@/components/ui";
import { backend } from "@/lib/api";
import type { Post } from "@/lib/types";
import { usePagedList } from "@/lib/use-paged-list";

export default function PostsPage() {
  const list = usePagedList<Post[]>("/posts");
  const posts = list.data ?? [];
  const [creating, setCreating] = useState(false);

  async function create(values: { title: string; content: string }) {
    await backend("/posts", { method: "POST", body: values });
    setCreating(false);
    list.setPage(1);
    list.reload();
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <PageTitle>Posts</PageTitle>
        <Button onClick={() => setCreating(true)}>New post</Button>
      </div>
      {creating && (
        <Dialog title="New post" onClose={() => setCreating(false)}>
          <NoteForm
            submitLabel="Publish post"
            onSubmit={create}
            onCancel={() => setCreating(false)}
          />
        </Dialog>
      )}
      <ListStatus list={list} isEmpty={posts.length === 0} emptyText="No posts yet." />
      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          linked
          footer={
            <Link href={`/users/${post.authorId}/posts`} className="text-sm text-accent">
              All posts by this author
            </Link>
          }
        />
      ))}
      <Pagination list={list} />
    </>
  );
}
