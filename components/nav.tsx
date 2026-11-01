"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui";
import { useSession } from "@/lib/use-session";

const LINKS = [
  { href: "/notes", label: "My notes" },
  { href: "/posts", label: "Posts" },
  { href: "/interests", label: "Interests" },
];

const ADMIN_LINKS = [
  { href: "/admin/users", label: "Users" },
  { href: "/admin/notes", label: "All notes" },
];

export function Nav() {
  const { user } = useSession();
  const pathname = usePathname();

  if (!user) return null;

  const links = user.role === "admin" ? [...LINKS, ...ADMIN_LINKS] : LINKS;

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    // A full reload also drops previous pages kept in memory, so the next
    // person on this browser can't see the last user's notes.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign("/login");
  }

  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 text-sm">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname === href ? "page" : undefined}
            className={pathname === href ? "font-semibold" : "text-muted"}
          >
            {label}
          </Link>
        ))}
        <span className="ml-auto text-muted">{user.name}</span>
        <Button variant="secondary" onClick={logout}>
          Log out
        </Button>
      </div>
    </header>
  );
}
