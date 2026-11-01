"use client";

import { useCallback, useEffect, useState } from "react";

import { ApiError, backend } from "@/lib/api";
import type { PageMeta } from "@/lib/types";

type Result<T> = {
  key: string;
  data: T | null;
  meta: PageMeta | null;
  error: string | null;
  notReady: boolean;
};

export type PagedList<T> = Omit<Result<T>, "key"> & {
  page: number;
  loading: boolean;
  setPage: (page: number) => void;
  reload: () => void;
};

export function usePagedList<T>(path: string, limit = 10): PagedList<T> {
  const [position, setPosition] = useState({ path, page: 1 });
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState<Result<T> | null>(null);

  // A new path (for example a changed filter) starts again from page 1.
  const page = position.path === path ? position.page : 1;
  const key = `${path}|${page}|${version}`;

  useEffect(() => {
    let active = true;
    const separator = path.includes("?") ? "&" : "?";

    backend<T>(`${path}${separator}page=${page}&limit=${limit}`)
      .then(({ data, metadata }) => {
        if (!active) return;
        const last = metadata?.totalPages ?? 0;
        // Deleting the only item on the last page leaves us past the end.
        if (last > 0 && page > last) setPosition({ path, page: last });
        setResult({ key, data, meta: metadata ?? null, error: null, notReady: false });
      })
      .catch((error: Error) => {
        if (!active) return;
        setResult({
          key,
          data: null,
          meta: null,
          error: error.message,
          notReady: error instanceof ApiError && error.notReady,
        });
      });

    return () => {
      active = false;
    };
  }, [key, path, page, limit]);

  const reload = useCallback(() => setVersion((value) => value + 1), []);
  const setPage = useCallback(
    (next: number) => setPosition({ path, page: next }),
    [path],
  );

  return {
    data: result?.data ?? null,
    meta: result?.meta ?? null,
    error: result?.error ?? null,
    notReady: result?.notReady ?? false,
    loading: result?.key !== key,
    page,
    setPage,
    reload,
  };
}
