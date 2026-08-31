interface Props {
  title: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, children }: Props) {
  return (
    <section
      className="rounded-3xl p-7 border"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      <h2 className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase mb-5">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function SettingsRow({
  label,
  description,
  control,
}: {
  label: string;
  description?: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6">
      <div>
        <div className="text-sm font-semibold">{label}</div>
        {description && <div className="text-xs text-[var(--color-text-dim)] mt-0.5">{description}</div>}
      </div>
      {control}
    </div>
  );
}

export function Toggle({ enabled }: { enabled: boolean }) {
  return (
    <div
      className="w-11 h-6 rounded-full relative transition-colors shrink-0"
      style={{ background: enabled ? "var(--color-accent)" : "var(--color-border)" }}
    >
      <div
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
        style={{ left: enabled ? 22 : 2 }}
      />
    </div>
  );
}
