import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
}

export function MetricCard({ label, value, detail, icon: Icon }: MetricCardProps) {
  return (
    <section className="metric-card">
      <div className="metric-icon" aria-hidden="true">
        <Icon size={20} />
      </div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <span>{detail}</span>
      </div>
    </section>
  );
}
