"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { revalidateApproval } from "@/lib/revalidate";

export type ModerationResult = { ok: boolean; message: string };

/**
 * Approve a pending memory. On success we flip approvalStatus -> APPROVED (the single
 * source of truth) and sync the derived isApproved mirror in ONE update, then fire
 * on-demand revalidation so the public, statically-cached pages update instantly.
 */
export async function approveMemory(id: string): Promise<ModerationResult> {
  const admin = await requireAdmin();
  await prisma.memoryPost.update({
    where: { id },
    data: { approvalStatus: "APPROVED", isApproved: true, approvedById: admin.id },
  });
  revalidateApproval();
  revalidatePath("/memories");
  return { ok: true, message: "Memory approved and published." };
}

export async function rejectMemory(id: string): Promise<ModerationResult> {
  await requireAdmin();
  await prisma.memoryPost.update({
    where: { id },
    data: { approvalStatus: "REJECTED", isApproved: false },
  });
  // Removing previously-approved content must also purge the public cache.
  revalidateApproval();
  revalidatePath("/memories");
  return { ok: true, message: "Memory rejected." };
}

export async function approveListing(id: string): Promise<ModerationResult> {
  const admin = await requireAdmin();
  const listing = await prisma.directoryListing.update({
    where: { id },
    data: { approvalStatus: "APPROVED", approvedById: admin.id },
  });
  revalidateApproval();
  revalidatePath("/friends");
  revalidatePath(`/friends/${listing.slug}`);
  return { ok: true, message: "Listing approved and published." };
}

export async function rejectListing(id: string): Promise<ModerationResult> {
  await requireAdmin();
  const listing = await prisma.directoryListing.update({
    where: { id },
    data: { approvalStatus: "REJECTED" },
  });
  revalidateApproval();
  revalidatePath("/friends");
  revalidatePath(`/friends/${listing.slug}`);
  return { ok: true, message: "Listing rejected." };
}
