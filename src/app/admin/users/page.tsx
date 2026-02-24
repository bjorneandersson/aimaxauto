import { prisma } from "@/lib/prisma";
import UserTable from "@/components/admin/UserTable";

async function getUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      plan: true,
      createdAt: true,
      airaCredits: true,
      airaTokensUsed: true,
      _count: { select: { vehicles: true, posts: true } },
    },
    take: 100,
  });
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Users</h1>
        <p className="text-text-secondary text-sm mt-1">
          {users.length} registered users
        </p>
      </div>

      <UserTable users={JSON.parse(JSON.stringify(users))} />
    </div>
  );
}
