"use client";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="dashboard-error">
      <div className="dashboard-error-card">
        <span className="eyebrow">SHOPKIT</span>
        <h1>Something went wrong</h1>
        <p>We could not load your dashboard. Try refreshing the page.</p>
        <button type="button" className="primary-button" onClick={reset}>
          Try again
        </button>
      </div>
    </main>
  );
}
