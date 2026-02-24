import { prisma } from "@/lib/prisma";

async function getStats() {
  const [userCount, vehicleCount, postCount, flaggedCount, recentUsers, recentVehicles] =
    await Promise.all([
      prisma.user.count(),
      prisma.vehicle.count(),
      prisma.post.count(),
      prisma.post.count({ where: { isFlagged: true, isHidden: false } }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, email: true, role: true, createdAt: true, plan: true },
      }),
      prisma.vehicle.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { user: { select: { name: true, email: true } } },
      }),
    ]);

  return { userCount, vehicleCount, postCount, flaggedCount, recentUsers, recentVehicles };
}

export default async function DashboardPage() {
  const stats = await getStats();

  const statCards = [
    { label: "Total Users", value: stats.userCount, icon: "👥", color: "text-status-info" },
    { label: "Vehicles", value: stats.vehicleCount, icon: "🚗", color: "text-brand" },
    { label: "Posts", value: stats.postCount, icon: "💬", color: "text-status-success" },
    { label: "Flagged", value: stats.flaggedCount, icon: "🚩", color: "text-status-error" },
  ];

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary text-sm mt-1">Overview of Aimaxauto platform activity</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface-card border border-border rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <div className={`text-3xl font-bold font-mono ${stat.color}`}>
              {stat.value.toLocaleString()}
            </div>
            <div className="text-xs text-text-tertiary mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-surface-card border border-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-semibold text-text-primary">Recent Users</h2>
          </div>
          <div className="divide-y divide-border">
            {stats.recentUsers.length === 0 ? (
              <div className="p-4 text-sm text-text-tertiary text-center">No users yet</div>
            ) : (
              stats.recentUsers.map((user) => (
                <div key={user.id} className="p-3 px-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-text-primary">
                      {user.name || "Unnamed"}
                    </div>
                    <div className="text-xs text-text-tertiary">{user.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-surface-element text-text-secondary">
                      {user.plan}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        user.role === "ADMIN"
                          ? "bg-brand-dim text-brand"
                          : "bg-surface-element text-text-tertiary"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Vehicles */}
        <div className="bg-surface-card border border-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-semibold text-text-primary">Recent Vehicles</h2>
          </div>
          <div className="divide-y divide-border">
            {stats.recentVehicles.length === 0 ? (
              <div className="p-4 text-sm text-text-tertiary text-center">No vehicles yet</div>
            ) : (
              stats.recentVehicles.map((v) => (
                <div key={v.id} className="p-3 px-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-text-primary">
                      {v.brand} {v.model} {v.year}
                    </div>
                    <div className="text-xs text-text-tertiary">
                      {v.user.name || v.user.email} · {v.mileage.toLocaleString()} mi
                    </div>
                  </div>
                  <div className="text-xs font-mono text-text-secondary">
                    {v.lastValuation ? `$${v.lastValuation.toLocaleString()}` : "—"}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
