import { PrismaClient } from "@prisma/client";
import { sanitizeBioHTML } from "../lib/sanitize";

const prisma = new PrismaClient();

// A 1x1 sand-toned placeholder blur so seeded images never cause layout shift.
const BLUR =
  "data:image/webp;base64,UklGRhIAAABXRUJQVlA4TAYAAAAvAAAAAAfQ//73v/+BiOh/AAA=";

async function main() {
  // ── Admin (moderation principal for stubbed auth) ──────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: "admin@southportpier.co.uk" },
    update: {},
    create: { email: "admin@southportpier.co.uk", name: "Archive Curator", role: "ADMIN" },
  });

  // ── Founding Friends (civic partnerships, tier FOUNDER) ────────────────────
  await prisma.directoryListing.upsert({
    where: { slug: "mettle-therapy" },
    update: {},
    create: {
      businessName: "Mettle Therapy",
      slug: "mettle-therapy",
      contactName: "Chris Brotherton, Integrative Counsellor",
      description:
        "Men's mental health support and restorative therapy, led by local integrative counsellor Chris Brotherton.",
      bioHTML: sanitizeBioHTML(
        "<p>Mettle Therapy provides men's mental health support and restorative therapy in Southport, led by local integrative counsellor <strong>Chris Brotherton</strong>.</p><p>As a founding participant in the Friends of Southport Pier ecosystem, Mettle Therapy supports the community archive while offering a steady, confidential space for men navigating difficult seasons of life.</p>",
      ),
      websiteURL: "https://mettletherapy.co.uk",
      category: "MIND_WELLBEING",
      membershipTier: "FOUNDER",
      isPaid: false,
      approvalStatus: "APPROVED",
      approvedById: admin.id,
    },
  });

  await prisma.directoryListing.upsert({
    where: { slug: "richard-owens" },
    update: {},
    create: {
      businessName: "Richard Owens",
      slug: "richard-owens",
      contactName: "Richard Owens",
      description:
        "Social impact work across Southport through Compassion Acts and Identity Dads CIC.",
      bioHTML: sanitizeBioHTML(
        "<p>Richard Owens leads social impact work across Southport, including his contributions to <strong>Compassion Acts</strong> and <strong>Identity Dads CIC</strong>.</p><p>A founding participant in the Friends of Southport Pier ecosystem, his work supports families and individuals through practical community action and fatherhood support.</p>",
      ),
      websiteURL: "https://compassionacts.uk",
      category: "COMMUNITY_ACTION",
      membershipTier: "FOUNDER",
      isPaid: false,
      approvalStatus: "APPROVED",
      approvedById: admin.id,
    },
  });

  // ── A couple of standard approved listings for directory texture ───────────
  await prisma.directoryListing.upsert({
    where: { slug: "ribble-coast-joinery" },
    update: {},
    create: {
      businessName: "Ribble Coast Joinery",
      slug: "ribble-coast-joinery",
      contactName: "A. Hartley",
      description: "Heritage joinery and timber restoration, rooted in Southport since 1998.",
      bioHTML: sanitizeBioHTML("<p>Independent heritage joiners specialising in timber restoration.</p>"),
      websiteURL: "https://example.com/ribble-coast-joinery",
      category: "LOCAL_TRADE",
      membershipTier: "PAID_DIRECTORY",
      isPaid: true,
      approvalStatus: "APPROVED",
      approvedById: admin.id,
    },
  });

  // ── Memories: one approved, one pending (to exercise moderation) ───────────
  const memoryCount = await prisma.memoryPost.count();
  if (memoryCount === 0) {
    await prisma.memoryPost.create({
      data: {
        title: "Sunday walks to the end and back",
        story:
          "Every Sunday after church my grandad would take us to the very end of the pier. He'd buy us a paper bag of mint humbugs and tell us about the trams that used to run the length of it. The wind off the Ribble could nearly knock you over, but he never once turned back early.",
        residentName: "Margaret H.",
        memoryDate: "Summer 1958",
        imageURL: "",
        imageAlt: null,
        approvalStatus: "APPROVED",
        isApproved: true,
        approvedById: admin.id,
      },
    });
    await prisma.memoryPost.create({
      data: {
        title: "The end-of-pier arcade",
        story:
          "I spent every penny of my pocket money in the little arcade at the pier head in the 1980s. The penny falls, the smell of the sea, the lights — it felt like the edge of the world to a ten year old.",
        residentName: "Dave P.",
        memoryDate: "1983",
        imageURL: "",
        approvalStatus: "PENDING",
        isApproved: false,
      },
    });
  }

  // ── Mural media (with blur primitives for CLS-free rendering) ──────────────
  const mediaCount = await prisma.uploadedMedia.count();
  if (mediaCount === 0) {
    const dims = [
      [1200, 800], [800, 1000], [1400, 900], [900, 900], [1000, 1300], [1500, 1000],
    ];
    for (let i = 0; i < dims.length; i++) {
      const [width, height] = dims[i];
      await prisma.uploadedMedia.create({
        data: {
          url: `https://picsum.photos/seed/pier-${i}/${width}/${height}`,
          blurDataURL: BLUR,
          width,
          height,
          alt: `Archival photograph of Southport Pier, plate ${i + 1}`,
          credit: "Community Archive",
          yearTaken: 1960 + i * 8,
          description: "A photograph contributed to the Southport Pier community mural.",
        },
      });
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
