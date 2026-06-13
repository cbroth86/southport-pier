import "server-only";
import { prisma } from "@/lib/db";

/**
 * STUBBED AUTH — moderation gate.
 *
 * This is a deliberate stub for the v1 build: it resolves the seeded ADMIN user
 * so the moderation UI and Server Actions can attribute approvals (approvedById).
 * Swap the body for a real session lookup (Auth.js / Supabase Auth) later WITHOUT
 * changing call sites — the contract is `requireAdmin(): Promise<{ id, email }>`.
 */

const SEED_ADMIN_EMAIL = "admin@southportpier.co.uk";

export type AdminPrincipal = { id: string; email: string; name: string | null };

export async function getCurrentAdmin(): Promise<AdminPrincipal | null> {
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN", email: SEED_ADMIN_EMAIL },
    select: { id: true, email: true, name: true },
  });
  return admin;
}

export async function requireAdmin(): Promise<AdminPrincipal> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error("Unauthorised: no administrator session.");
  }
  return admin;
}
