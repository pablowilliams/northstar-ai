import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
}) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

export function IconBadge({
  icon: Icon,
  tone = "green",
}: {
  icon: LucideIcon;
  tone?: "green" | "yellow" | "ink" | "red";
}) {
  return (
    <span className={`icon-badge icon-badge--${tone}`}>
      <Icon size={17} strokeWidth={1.8} />
    </span>
  );
}

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`surface ${className}`}>{children}</section>;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div className="page-header__copy">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </header>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  detail,
  action,
}: {
  eyebrow: string;
  title: string;
  detail?: string;
  action?: ReactNode;
}) {
  return (
    <header className="section-title">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2>{title}</h2>
        {detail && <p>{detail}</p>}
      </div>
      {action}
    </header>
  );
}

export function StatCard({
  label,
  value,
  detail,
  delta,
  icon: Icon,
  tone = "green",
}: {
  label: string;
  value: string;
  detail: string;
  delta?: string;
  icon: LucideIcon;
  tone?: "green" | "yellow" | "ink" | "red";
}) {
  return (
    <article className="stat-card">
      <div className="stat-card__top">
        <IconBadge icon={Icon} tone={tone} />
        {delta && (
          <span className={`stat-delta stat-delta--${tone}`}>{delta}</span>
        )}
      </div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </article>
  );
}

export function ProgressBar({
  value,
  tone = "green",
  label,
}: {
  value: number;
  tone?: "green" | "yellow" | "red";
  label?: string;
}) {
  return (
    <div
      className="progress"
      aria-label={label}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <i>
        <b
          className={`progress--${tone}`}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </i>
      {label && <span>{label}</span>}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  detail,
}: {
  icon: LucideIcon;
  title: string;
  detail: string;
}) {
  return (
    <div className="empty-state">
      <Icon size={28} />
      <b>{title}</b>
      <p>{detail}</p>
    </div>
  );
}

export function Skeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="skeleton" aria-label="Loading">
      <i className="skeleton__title" />
      {Array.from({ length: lines }).map((_, index) => (
        <i key={index} style={{ width: `${92 - index * 11}%` }} />
      ))}
    </div>
  );
}
