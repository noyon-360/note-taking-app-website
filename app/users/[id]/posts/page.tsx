import { Suspense } from "react";

import { UserPosts } from "./user-posts";

type Props = PageProps<"/users/[id]/posts">;

async function Content({ params }: Pick<Props, "params">) {
  const { id } = await params;
  return <UserPosts userId={id} />;
}

export default function UserPostsPage({ params }: Props) {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
      <Content params={params} />
    </Suspense>
  );
}
