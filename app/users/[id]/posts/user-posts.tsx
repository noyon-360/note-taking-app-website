"use client";

import { PostItem } from "@/components/post-item";
import { ListStatus, PageTitle, Pagination } from "@/components/ui";
import type { UserPosts as UserPostsData } from "@/lib/types";
import { usePagedList } from "@/lib/use-paged-list";

export function UserPosts({ userId }: { userId: string }) {
  const list = usePagedList<UserPostsData>(`/users/${userId}/posts`);
  const posts = list.data?.posts ?? [];

  return (
    <>
      <PageTitle>{list.data ? `Posts by ${list.data.user.name}` : "User posts"}</PageTitle>
      <ListStatus list={list} isEmpty={posts.length === 0} emptyText="This user has no posts." />
      {posts.map((post) => (
        <PostItem key={post.id} post={post} linked />
      ))}
      <Pagination list={list} />
    </>
  );
}
