import type { AgentRun, EvaluationSummary, EvalScenario } from "./types";

export interface Recommendation {
  title: string;
  detail: string;
  impact: "high" | "medium" | "low";
}

export function generateRecommendations(
  summary: EvaluationSummary,
  runs: AgentRun[],
  scenarios: EvalScenario[]
): Recommendation[] {
  const scenarioById = new Map(scenarios.map((scenario) => [scenario.id, scenario]));
  const blocked = summary.scores.filter((score) => score.verdict === "block");
  const highImpactBlocked = blocked.filter((score) => {
    const scenario = scenarioById.get(score.scenarioId);
    return scenario?.severity === "high" || scenario?.severity === "critical";
  });
  const toolFailures = runs.flatMap((run) => run.steps.filter((step) => step.kind === "tool_call" && !step.success));
  const riskyRuns = runs.filter((run) => run.steps.some((step) => step.risk === "high" || step.risk === "critical"));

  const recommendations: Array<Recommendation | undefined> = [
    highImpactBlocked.length > 0
      ? {
          title: "Add hard approval gates to critical workflows",
          detail: `${highImpactBlocked.length} high-impact scenario failed or missed human review. Require explicit approval before irreversible actions.`,
          impact: "high" as const
        }
      : undefined,
    toolFailures.length > 0
      ? {
          title: "Introduce typed tool contracts and retry budgets",
          detail: `${toolFailures.length} tool call failed. Schema validation plus capped retries will reduce hidden failure loops.`,
          impact: "medium" as const
        }
      : undefined,
    summary.averages.efficiency < 78
      ? {
          title: "Route routine cases to a cheaper model tier",
          detail: `Efficiency is ${summary.averages.efficiency}/100. Cache retrieval results and reserve frontier models for escalations.`,
          impact: "medium" as const
        }
      : undefined,
    riskyRuns.length > 0
      ? {
          title: "Log risk rationales next to every final answer",
          detail: `${riskyRuns.length} run had elevated risk. Persisting the risk reason improves audits and post-incident review.`,
          impact: "high" as const
        }
      : {
          title: "Promote this eval pack into CI",
          detail: "Current suite has no high-risk regressions. Run it on every prompt, model, or tool-policy change.",
          impact: "low" as const
        }
  ];

  return recommendations.filter((item): item is Recommendation => Boolean(item));
}
