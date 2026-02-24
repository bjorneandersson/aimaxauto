export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand to-brand-hover flex items-center justify-center mx-auto text-white font-bold text-2xl">
          Ai
        </div>
        <h1 className="text-3xl font-bold text-text-primary">Aimaxauto</h1>
        <p className="text-text-secondary max-w-md">
          AI-Powered Car Ownership — Manage, value, and trade your vehicles.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/garage"
            className="px-6 py-3 bg-brand text-white rounded-xl font-semibold hover:bg-brand-hover transition-colors"
          >
            Open Garage
          </a>
          <a
            href="/admin"
            className="px-6 py-3 border border-border text-text-primary rounded-xl font-semibold hover:bg-surface-card transition-colors"
          >
            Admin Panel
          </a>
        </div>
      </div>
    </div>
  );
}
