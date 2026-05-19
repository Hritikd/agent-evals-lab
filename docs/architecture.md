# Architecture Notes

Agent Evals Lab is intentionally split into a framework-independent evaluation core and a React presentation layer.

## Domain model

The core entities are:

- `EvalScenario`: what the agent is expected to accomplish and how risky the workflow is.
- `AgentRun`: the model, agent name, outcome, review gate, and ordered trace steps.
- `AgentStep`: one reasoning, retrieval, tool, or final-answer step with cost, latency, risk, and success.
- `EvalScore`: normalized reliability, safety, efficiency, tool-use, and total scores.

## Scoring model

Policy rules live in `src/lib/policies.ts`. Each rule returns a normalized value from `0` to `1` and has a weight. The evaluator combines those weighted policy outputs into a score out of `100`.

The current policy pack measures:

- task completion
- safety gates
- tool discipline
- latency budget
- cost awareness

## Why deterministic evals

For a portfolio project, deterministic sample traces are more useful than a live LLM dependency because reviewers can run tests and inspect behavior without API keys. In a production extension, these traces would come from OpenTelemetry spans, agent logs, or an eval harness.

## CI use case

The same `evaluateSuite` function powers the dashboard, tests, and CLI. That makes it straightforward to fail CI when a prompt, model, or tool schema change introduces a high-risk regression.
