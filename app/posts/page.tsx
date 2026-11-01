"use client";

import Link from "next/link";

import { NoteForm } from "@/components/note-form";
import { PostItem } from "@/components/post-item";
import { Card, ListStatus, PageTitle, Pagination } from "@/components/ui";
import { backend } from "@/lib/api";
import type { Post } from "@/lib/types";
import { usePagedList } from "@/lib/use-paged-list";

export default function PostsPage() {
  const list = usePagedList<Post[]>("/posts");
  const posts = list.data ?? [];

  async function create(values: { title: string; content: string }) {
    await backend("/posts", { method: "POST", body: values });
    list.setPage(1);
    list.reload();
  }

  return (
    <>
      <PageTitle>Posts</PageTitle>
      <Card>
        <NoteForm submitLabel="Publish post" onSubmit={create} />
      </Card>
      <ListStatus list={list} isEmpty={posts.length === 0} emptyText="No posts yet." />
      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
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
