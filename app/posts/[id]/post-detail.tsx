"use client";

import Link from "next/link";

import { PostItem } from "@/components/post-item";
import { ListStatus, PageTitle } from "@/components/ui";
import type { Post } from "@/lib/types";
import { usePagedList } from "@/lib/use-paged-list";

export function PostDetail({ postId }: { postId: string }) {
  const list = usePagedList<Post>(`/posts/${postId}`);
  const post = list.data;

  return (
    <>
      <Link href="/posts" className="text-sm text-accent">
        Back to posts
      </Link>
      <PageTitle>Post</PageTitle>
      <ListStatus list={list} isEmpty={false} emptyText="" />
      {post && (
        <PostItem
          post={post}
          footer={
            <Link href={`/users/${post.authorId}/posts`} className="text-sm text-accent">
              All posts by this author
            </Link>
          }
        />
      )}
    </>
  );
}
