import type { ExposureAlert } from "@/lib/types";

export function AlertsList({ alerts }: { alerts: ExposureAlert[] }) {
  if (alerts.length === 0) return null;

  return (
    <section className="space-y-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="flex items-center justify-between gap-4 rounded-2xl px-5 py-3.5 border"
          style={{ background: "var(--color-accent-dim)", borderColor: "rgba(245, 166, 35, 0.25)" }}
        >
          <span className="text-sm font-medium">{alert.message}</span>
          {alert.actionLabel && (
            <button
              className="text-xs font-bold whitespace-nowrap px-3 py-1.5 rounded-full transition-opacity hover:opacity-80"
              style={{ background: "var(--color-accent)", color: "#0a0a0a" }}
            >
              {alert.actionLabel}
            </button>
          )}
        </div>
      ))}
    </section>
  );
}
