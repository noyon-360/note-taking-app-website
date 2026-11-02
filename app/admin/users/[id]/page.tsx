import { Suspense } from "react";

import { UserDetail } from "./user-detail";

type Props = PageProps<"/admin/users/[id]">;

async function Content({ params }: Pick<Props, "params">) {
  const { id } = await params;
  return <UserDetail userId={id} />;
}

export default function AdminUserPage({ params }: Props) {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
      <Content params={params} />
    </Suspense>
  );
}
