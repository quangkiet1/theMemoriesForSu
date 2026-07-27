import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { farewellLetterData } from "@/data/farewell-letter";
import { farewellMemories } from "@/data/farewell-memories";
import FarewellExperience from "@/components/farewell/FarewellExperience";

// ============================================================
// Route params
// ============================================================
interface PageProps {
  params: Promise<{ slug: string }>;
}

// ============================================================
// Metadata — no-index, private
// ============================================================
export const metadata: Metadata = {
  title: "Một bức thư dành riêng cho bạn",
  description: "",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: "Một bức thư dành riêng cho bạn",
    description: "",
  },
};

// ============================================================
// Page component
// ============================================================
export default async function FarewellPage({ params }: PageProps) {
  const { slug } = await params;

  // Only serve if slug matches the configured slug
  if (slug !== farewellLetterData.slug) {
    notFound();
  }

  return (
    <main>
      <FarewellExperience
        letterData={farewellLetterData}
        memories={farewellMemories}
      />
    </main>
  );
}
