import { Suspense } from "react";

import { PostDetail } from "./post-detail";

type Props = PageProps<"/posts/[id]">;

async function Content({ params }: Pick<Props, "params">) {
  const { id } = await params;
  return <PostDetail postId={id} />;
}

export default function PostPage({ params }: Props) {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
      <Content params={params} />
    </Suspense>
  );
}
