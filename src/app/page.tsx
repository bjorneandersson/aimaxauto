import { redirect } from "next/navigation";

// Root redirects to main app
export default function HomePage() {
  redirect("/garage");
}
