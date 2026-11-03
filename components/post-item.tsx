import Link from "next/link";

import { Card } from "@/components/ui";
import { formatDate } from "@/lib/format";
import type { Post } from "@/lib/types";

export function PostItem({
  post,
  footer,
  linked = false,
}: {
  post: Post;
  footer?: React.ReactNode;
  linked?: boolean;
}) {
  return (
    <Card>
      <h2 className="font-semibold">
        {linked ? (
          <Link href={`/posts/${post.id}`} className="text-accent">
            {post.title}
          </Link>
        ) : (
          post.title
        )}
      </h2>
      <p className="whitespace-pre-wrap text-sm">{post.content}</p>
      <p className="text-xs text-muted">Posted {formatDate(post.createdAt)}</p>
      {footer}
    </Card>
  );
}
