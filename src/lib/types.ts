export type RiskLevel = "low" | "medium" | "high" | "critical";

export type StepKind = "reasoning" | "tool_call" | "retrieval" | "final_answer";

export interface AgentStep {
  id: string;
  kind: StepKind;
  label: string;
  startedAt: string;
  durationMs: number;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  toolName?: string;
  success: boolean;
  risk: RiskLevel;
  notes: string;
}

export interface EvalScenario {
  id: string;
  title: string;
  domain: string;
  expectedOutcome: string;
  severity: RiskLevel;
  tags: string[];
}

export interface AgentRun {
  id: string;
  agentName: string;
  model: string;
  scenarioId: string;
  createdAt: string;
  outcome: "pass" | "warn" | "fail";
  humanReviewRequired: boolean;
  steps: AgentStep[];
}

export interface PolicyRule {
  id: string;
  label: string;
  description: string;
  weight: number;
  evaluate: (run: AgentRun, scenario: EvalScenario) => number;
}

export interface EvalScore {
  runId: string;
  scenarioId: string;
  reliability: number;
  safety: number;
  efficiency: number;
  toolUse: number;
  total: number;
  verdict: "ship" | "monitor" | "block";
  flags: string[];
}

export interface EvaluationSummary {
  scores: EvalScore[];
  averages: {
    reliability: number;
    safety: number;
    efficiency: number;
    toolUse: number;
    total: number;
  };
  verdictMix: Record<EvalScore["verdict"], number>;
  totalCostUsd: number;
  totalLatencyMs: number;
  passRate: number;
}
