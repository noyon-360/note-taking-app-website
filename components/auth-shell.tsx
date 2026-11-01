import type { ReactNode } from "react";

import { PageTitle } from "@/components/ui";

const FEATURES = [
  "Write and edit notes from any browser",
  "Share posts with other members",
  "Find people who share your interests",
];

function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 font-semibold ${className}`}>
      <span className="flex size-8 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/25">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="size-4.5">
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
      </span>
      Secure Notes
    </span>
  );
}

function NotePreview() {
  return (
    <div aria-hidden className="relative h-32 w-full max-w-56">
      <div className="absolute inset-x-4 top-0 h-28 rotate-6 rounded-xl bg-white/10 ring-1 ring-white/15" />
      <div className="absolute inset-x-2 top-1 h-28 -rotate-3 space-y-2.5 rounded-xl bg-white p-4 shadow-xl">
        <div className="h-2 w-2/3 rounded-full bg-[#1f3f8f]" />
        <div className="h-1.5 w-full rounded-full bg-[#1f3f8f]/20" />
        <div className="h-1.5 w-full rounded-full bg-[#1f3f8f]/20" />
        <div className="h-1.5 w-1/2 rounded-full bg-[#1f3f8f]/20" />
      </div>
    </div>
  );
}

function BrandPanel() {
  return (
    <aside className="relative hidden flex-col justify-between gap-8 overflow-hidden bg-linear-to-br from-[#1f3f8f] to-[#2f5fd0] p-8 text-white md:flex">
      <div aria-hidden className="absolute -right-20 -top-20 size-64 rounded-full bg-white/10 blur-2xl" />
      <Logo className="relative" />
      <NotePreview />
      <div className="relative space-y-4">
        <p className="text-2xl font-semibold leading-tight text-balance">Write it down. Keep it safe.</p>
        <ul className="space-y-2 text-sm text-white/85">
          {FEATURES.map((feature) => (
            <li key={feature} className="flex gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="mt-0.5 size-4 shrink-0">
                <path d="m5 12 5 5 9-10" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

// The page frame shared by log in and register.
export function AuthShell({
  title,
  subtitle,
  footer,
  children,
}: {
  title: string;
  subtitle: string;
  footer: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100dvh-3rem)] items-center">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(60rem_32rem_at_50%_-10%,color-mix(in_srgb,var(--accent)_20%,transparent),transparent)]"
      />
      <div className="grid w-full overflow-hidden rounded-2xl border border-line bg-background shadow-xl md:grid-cols-[5fr_6fr]">
        <BrandPanel />
        <div className="space-y-6 p-6 sm:p-8">
          <div className="md:hidden">
            <span className="inline-flex rounded-lg bg-linear-to-br from-[#1f3f8f] to-[#2f5fd0] px-3 py-2 text-sm text-white">
              <Logo />
            </span>
          </div>
          <div className="space-y-1">
            <PageTitle>{title}</PageTitle>
            <p className="text-sm text-muted">{subtitle}</p>
          </div>
          {children}
          <p className="text-sm text-muted">{footer}</p>
        </div>
      </div>
    </div>
  );
}
