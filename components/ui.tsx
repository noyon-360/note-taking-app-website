import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";

import type { PagedList } from "@/lib/use-paged-list";

export const control =
  "w-full rounded-lg border border-line bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted hover:border-muted focus:border-accent focus:ring-2 focus:ring-accent/25";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
}) {
  const colors = {
    primary: "bg-accent text-white hover:brightness-110",
    secondary: "border border-line hover:bg-subtle",
    danger: "border border-danger text-danger hover:bg-danger/10",
  }[variant];

  return (
    <button
      className={`cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-50 ${colors} ${className}`}
      {...props}
    />
  );
}

export function Input({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block space-y-1 text-sm">
      <span className="font-medium">{label}</span>
      <input className={control} {...props} />
    </label>
  );
}

export function Textarea({
  label,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="block space-y-1 text-sm">
      <span className="font-medium">{label}</span>
      <textarea className={control} rows={4} {...props} />
    </label>
  );
}

export function ErrorText({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
      {children}
    </p>
  );
}

export function Card({ children }: { children: ReactNode }) {
  return <section className="space-y-3 rounded-lg border border-line p-4">{children}</section>;
}

export function PageTitle({ children }: { children: ReactNode }) {
  return <h1 className="text-2xl font-semibold">{children}</h1>;
}

// Shows the loading, error, unfinished-endpoint and empty states shared by every list.
export function ListStatus<T>({
  list,
  isEmpty,
  emptyText,
}: {
  list: PagedList<T>;
  isEmpty: boolean;
  emptyText: string;
}) {
  if (list.notReady) {
    return (
      <p className="rounded-md border border-line bg-subtle p-3 text-sm">
        This list needs a backend endpoint that isn&apos;t finished yet. It will
        work as soon as the endpoint is ready.
      </p>
    );
  }
  if (list.error) return <ErrorText>{list.error}</ErrorText>;
  if (list.loading && !list.data) return <p className="text-sm text-muted">Loading…</p>;
  if (isEmpty) return <p className="text-sm text-muted">{emptyText}</p>;
  return null;
}

export function Pagination<T>({ list }: { list: PagedList<T> }) {
  const { meta, page, setPage, loading } = list;
  if (!meta || meta.totalPages < 2) return null;

  return (
    <nav aria-label="Pagination" className="flex items-center gap-3 text-sm">
      <Button
        variant="secondary"
        disabled={loading || page <= 1}
        onClick={() => setPage(page - 1)}
      >
        Previous
      </Button>
      <span>
        Page {page} of {meta.totalPages} ({meta.total} total)
      </span>
      <Button
        variant="secondary"
        disabled={loading || page >= meta.totalPages}
        onClick={() => setPage(page + 1)}
      >
        Next
      </Button>
    </nav>
  );
}
