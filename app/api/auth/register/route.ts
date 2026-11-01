import { forwardAuth } from "@/lib/auth-route";

export async function POST(request: Request) {
  return forwardAuth("/auth/register", request);
}
