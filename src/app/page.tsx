import { redirect } from "next/navigation";
import { farewellLetterData } from "@/data/farewell-letter";

// Redirect root to the letter page for convenience
// Or return a blank page if you don't want any redirect
export default function Home() {
  redirect(`/letter/${farewellLetterData.slug}`);
}
