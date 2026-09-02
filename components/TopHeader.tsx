import { Bell } from "lucide-react";
import { ConnectWalletButton } from "./ConnectWalletButton";

interface Props {
  title: string;
  subtitle: string;
  expiringSoonCount?: number;
}

export function TopHeader({ title, subtitle, expiringSoonCount = 0 }: Props) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">{subtitle}</p>
      </div>
      <div className="flex items-center gap-4">
        <ConnectWalletButton />
        <button
          className="relative w-11 h-11 rounded-full border flex items-center justify-center"
          style={{ borderColor: "var(--color-border)" }}
        >
          <Bell size={17} strokeWidth={2} />
          {expiringSoonCount > 0 && (
            <span
              className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full text-[10px] font-bold flex items-center justify-center gradient-accent text-[#0a0a0a]"
              style={{ minWidth: 18, height: 18 }}
            >
              {expiringSoonCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
