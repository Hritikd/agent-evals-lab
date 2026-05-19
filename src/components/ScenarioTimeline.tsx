import { CheckCircle2, CircleAlert, ShieldAlert, Wrench } from "lucide-react";
import type { AgentRun } from "../lib/types";

interface ScenarioTimelineProps {
  run: AgentRun;
}

const icons = {
  reasoning: CircleAlert,
  retrieval: CheckCircle2,
  tool_call: Wrench,
  final_answer: ShieldAlert
};

export function ScenarioTimeline({ run }: ScenarioTimelineProps) {
  return (
    <section className="panel timeline-panel">
      <div className="section-heading">
        <p>Trace Explorer</p>
        <h2>{run.agentName}</h2>
      </div>
      <div className="timeline">
        {run.steps.map((step) => {
          const Icon = icons[step.kind];
          return (
            <article className="timeline-step" key={step.id}>
              <div className={`timeline-node ${step.risk}`}>
                <Icon size={18} />
              </div>
              <div>
                <header>
                  <strong>{step.label}</strong>
                  <span>{(step.durationMs / 1000).toFixed(1)}s</span>
                </header>
                <p>{step.notes}</p>
                <footer>
                  <span>{step.kind.replace("_", " ")}</span>
                  <span>${step.costUsd.toFixed(3)}</span>
                  <span>{step.risk} risk</span>
                </footer>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
