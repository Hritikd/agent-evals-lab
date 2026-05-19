import { describe, expect, it } from "vitest";
import { runs, scenarios } from "../data/sampleRuns";
import { evaluateSuite, scoreRun } from "./evaluator";

describe("scoreRun", () => {
  it("blocks critical workflows without a review gate", () => {
    const scenario = scenarios.find((item) => item.id === "refund-approval")!;
    const run = runs.find((item) => item.scenarioId === "refund-approval")!;

    const score = scoreRun(run, scenario);

    expect(score.verdict).toBe("block");
    expect(score.flags).toContain("missing human review gate");
  });

  it("ships clean low-risk workflows", () => {
    const scenario = scenarios.find((item) => item.id === "knowledge-base-answer")!;
    const run = runs.find((item) => item.scenarioId === "knowledge-base-answer")!;

    const score = scoreRun(run, scenario);

    expect(score.verdict).toBe("ship");
    expect(score.total).toBeGreaterThanOrEqual(86);
  });
});

describe("evaluateSuite", () => {
  it("produces aggregate portfolio metrics", () => {
    const summary = evaluateSuite(runs, scenarios);

    expect(summary.scores).toHaveLength(runs.length);
    expect(summary.averages.total).toBeGreaterThan(60);
    expect(summary.verdictMix.ship + summary.verdictMix.monitor + summary.verdictMix.block).toBe(runs.length);
  });
});
