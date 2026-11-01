"use client";

import { useState } from "react";
import type { ComponentProps } from "react";

import { Input, control } from "@/components/ui";

export function PasswordInput(props: Omit<ComponentProps<typeof Input>, "type">) {
  const [visible, setVisible] = useState(false);
  const action = `${visible ? "Hide" : "Show"} ${props.label.toLowerCase()}`;

  return (
    <div className="relative">
      <Input {...props} type={visible ? "text" : "password"} className={`${control} pr-10`} />
      <button
        type="button"
        aria-label={action}
        title={action}
        onClick={() => setVisible(!visible)}
        className="absolute bottom-px right-px flex size-9 items-center justify-center rounded-lg text-muted outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/40"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="size-4">
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
          {visible && <path d="m4 4 16 16" />}
        </svg>
      </button>
    </div>
  );
}
