import {
  Activity,
  Banknote,
  Gauge,
  GitBranch,
  ShieldCheck,
  Sparkles,
  TimerReset
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { MetricCard } from "./components/MetricCard";
import { RunTable } from "./components/RunTable";
import { ScenarioTimeline } from "./components/ScenarioTimeline";
import { runs, scenarios } from "./data/sampleRuns";
import { evaluateSuite } from "./lib/evaluator";
import { generateRecommendations } from "./lib/recommendations";
import "./styles.css";

const summary = evaluateSuite(runs, scenarios);
const recommendations = generateRecommendations(summary, runs, scenarios);
const primaryRun = runs.find((run) => run.id === "run-refund-002") ?? runs[0];

const chartRows = summary.scores.map((score) => {
  const scenario = scenarios.find((item) => item.id === score.scenarioId);
  return {
    name: scenario?.title.split(" ").slice(0, 2).join(" ") ?? score.runId,
    reliability: score.reliability,
    safety: score.safety,
    efficiency: score.efficiency,
    toolUse: score.toolUse,
    total: score.total,
    verdict: score.verdict
  };
});

const verdictColors = {
  ship: "#207868",
  monitor: "#b7791f",
  block: "#c2413d"
};

export default function App() {
  return (
    <main>
      <section className="hero">
        <nav className="topbar" aria-label="Project">
          <div className="brand">
            <span aria-hidden="true">
              <Sparkles size={18} />
            </span>
            Agent Evals Lab
          </div>
          <a href="https://github.com/Hritikd" target="_blank" rel="noreferrer">
            View GitHub
          </a>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">AI agent reliability workbench</p>
            <h1>Evaluate agent traces before they reach production.</h1>
            <p>
              A TypeScript evaluation engine and dashboard for scoring AI agents on task success,
              safety, tool discipline, latency, and cost.
            </p>
            <div className="hero-actions" aria-label="Project highlights">
              <span>
                <GitBranch size={16} /> CI-ready eval suite
              </span>
              <span>
                <ShieldCheck size={16} /> Risk gates
              </span>
              <span>
                <Activity size={16} /> Trace analytics
              </span>
            </div>
          </div>

          <div className="hero-panel" aria-label="Evaluation summary">
            <div>
              <p>Average score</p>
              <strong>{summary.averages.total}</strong>
            </div>
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={chartRows}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: "rgba(32, 120, 104, 0.08)" }} />
                <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                  {chartRows.map((row) => (
                    <Cell key={row.name} fill={verdictColors[row.verdict as keyof typeof verdictColors]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="metrics-grid" aria-label="Metrics">
        <MetricCard
          icon={ShieldCheck}
          label="Safety"
          value={`${summary.averages.safety}/100`}
          detail={`${summary.verdictMix.block} blocked runs`}
        />
        <MetricCard
          icon={Gauge}
          label="Reliability"
          value={`${summary.averages.reliability}/100`}
          detail={`${Math.round(summary.passRate * 100)}% ship rate`}
        />
        <MetricCard
          icon={TimerReset}
          label="Latency"
          value={`${(summary.totalLatencyMs / 1000).toFixed(1)}s`}
          detail="across all traces"
        />
        <MetricCard
          icon={Banknote}
          label="Cost"
          value={`$${summary.totalCostUsd.toFixed(2)}`}
          detail="sample suite spend"
        />
      </section>

      <section className="workspace">
        <section className="panel chart-panel">
          <div className="section-heading">
            <p>Score Breakdown</p>
            <h2>Reliability, safety, and efficiency by scenario</h2>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartRows}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="reliability" stroke="#1f6f8b" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="safety" stroke="#207868" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="efficiency" stroke="#8b5d33" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="toolUse" stroke="#7c5caa" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </section>

        <section className="panel recommendations">
          <div className="section-heading">
            <p>Actions</p>
            <h2>Engineering recommendations</h2>
          </div>
          {recommendations.map((item) => (
            <article key={item.title}>
              <span className={`impact ${item.impact}`}>{item.impact}</span>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </section>
      </section>

      <section className="workspace lower">
        <RunTable runs={runs} scores={summary.scores} />
        <ScenarioTimeline run={primaryRun} />
      </section>
    </main>
  );
}
