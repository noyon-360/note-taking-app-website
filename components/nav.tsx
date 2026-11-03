"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui";
import { logout } from "@/lib/api";
import { useSession } from "@/lib/use-session";

const LINKS = [
  { href: "/notes", label: "My notes" },
  { href: "/posts", label: "Posts" },
];

const ADMIN_LINKS = [
  { href: "/admin/users", label: "Users" },
  { href: "/admin/notes", label: "All notes" },
  { href: "/admin/interests", label: "Interests" },
];

export function Nav() {
  const { user } = useSession();
  const pathname = usePathname();

  if (!user) return null;

  const links = user.role === "admin" ? [...LINKS, ...ADMIN_LINKS] : LINKS;

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
        <Link
          href="/profile"
          aria-current={pathname === "/profile" ? "page" : undefined}
          className={`ml-auto ${pathname === "/profile" ? "font-semibold" : "text-muted"}`}
        >
          {user.name}
        </Link>
        <Button variant="secondary" onClick={logout}>
          Log out
        </Button>
      </div>
    </header>
  );
}
