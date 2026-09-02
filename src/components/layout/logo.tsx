import { cn } from "@/lib/utils";

export function BocaLogo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className="boca-gradient flex size-9 shrink-0 items-center justify-center rounded-xl text-primary-foreground shadow-sm"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2.5" y="5" width="19" height="14" rx="3.5" />
          <path d="M3.5 8.5 12 14l8.5-5.5" strokeLinecap="round" />
        </svg>
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-[15px] font-extrabold tracking-tight">BOCA MAIL</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Suite de e-mail
          </span>
        </span>
      )}
    </span>
  );
}
