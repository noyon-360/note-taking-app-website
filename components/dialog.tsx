"use client";

import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";

// Mount it to open it. The browser handles focus, Escape and the backdrop.
export function Dialog({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      className="m-auto w-[calc(100%-2rem)] max-w-lg space-y-4 rounded-lg border border-line bg-background p-5 text-foreground backdrop:bg-black/60"
    >
      <h2 id={titleId} className="text-lg font-semibold">
        {title}
      </h2>
      {children}
    </dialog>
  );
}
