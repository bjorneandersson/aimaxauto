import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Providers from "@/components/Providers";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Allow login page without auth
  // Middleware handles the actual redirect, but this is a safety check
  if (!session) {
    return <Providers>{children}</Providers>;
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR") {
    redirect("/admin/login?error=unauthorized");
  }

  return (
    <Providers>
      <div className="min-h-screen bg-surface-bg flex">
        <AdminSidebar user={session.user} />
        <main className="flex-1 ml-64 p-8">{children}</main>
      </div>
    </Providers>
  );
}
