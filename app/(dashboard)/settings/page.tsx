"use client";

import { TopHeader } from "@/components/TopHeader";
import { SettingsSection, SettingsRow, Toggle } from "@/components/SettingsSection";
import { ExternalLink } from "lucide-react";

const LINKS = [
  { label: "DreamDEX Event Contracts docs", href: "https://docs.dreamdex.io/developers/event-contracts" },
  { label: "Somnia oracle explorer", href: "https://prd.oracle.somnia.host" },
  { label: "Flotilla on GitHub", href: "https://github.com/MIKELELE001/flotilla" },
];

export default function SettingsPage() {
  return (
    <>
      <TopHeader title="Settings" subtitle="Wallet, alerts, and network details." />

      <div className="space-y-5 max-w-2xl">
        <SettingsSection title="Wallet">
          <SettingsRow
            label="Connected wallet"
            description="0xfa0bf249...322ed4736"
            control={
              <button
                className="text-xs font-semibold px-4 py-2 rounded-full border"
                style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
              >
                Disconnect
              </button>
            }
          />
        </SettingsSection>

        <SettingsSection title="Alert Preferences">
          <SettingsRow
            label="Concentration alerts"
            description="Notify when one asset exceeds 60% of exposure"
            control={<Toggle enabled />}
          />
          <SettingsRow
            label="Expiry alerts"
            description="Notify when positions expire within 5 minutes"
            control={<Toggle enabled />}
          />
          <SettingsRow
            label="Direction bias alerts"
            description="Notify when portfolio leans heavily UP or DOWN"
            control={<Toggle enabled={false} />}
          />
        </SettingsSection>

        <SettingsSection title="Network">
          <SettingsRow
            label="Somnia Shannon"
            description="Testnet · Chain ID 50312"
            control={
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: "var(--color-up-dim)", color: "var(--color-up)" }}
              >
                Connected
              </span>
            }
          />
        </SettingsSection>

        <SettingsSection title="Resources">
          <div className="space-y-3">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                {l.label}
                <ExternalLink size={14} />
              </a>
            ))}
          </div>
        </SettingsSection>
      </div>
    </>
  );
}
