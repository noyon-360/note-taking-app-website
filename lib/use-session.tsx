"use client";

import { createContext, use, useEffect, useState } from "react";
import type { ReactNode } from "react";

import type { User } from "@/lib/types";

type Session = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((response) => response.json())
      .then((json) => setUser(json.data))
      .catch(() => setUser(null));
  }, []);

  return <SessionContext value={{ user, setUser }}>{children}</SessionContext>;
}

export function useSession() {
  const session = use(SessionContext);
  if (!session) throw new Error("useSession must be used within SessionProvider");
  return session;
}
