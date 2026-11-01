import { Card } from "@/components/ui";
import { formatDate } from "@/lib/format";
import type { Post } from "@/lib/types";

export function PostItem({ post, footer }: { post: Post; footer?: React.ReactNode }) {
  return (
    <Card>
      <h2 className="font-semibold">{post.title}</h2>
      <p className="whitespace-pre-wrap text-sm">{post.content}</p>
      <p className="text-xs text-muted">Posted {formatDate(post.createdAt)}</p>
      {footer}
    </Card>
  );
}
