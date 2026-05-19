import { runs, scenarios } from "../src/data/sampleRuns";
import { evaluateSuite } from "../src/lib/evaluator";
import { generateRecommendations } from "../src/lib/recommendations";

const summary = evaluateSuite(runs, scenarios);
const recommendations = generateRecommendations(summary, runs, scenarios);

console.log("Agent Evals Lab report");
console.log("=======================");
console.log(`Runs evaluated: ${summary.scores.length}`);
console.log(`Average score: ${summary.averages.total}/100`);
console.log(`Pass rate: ${Math.round(summary.passRate * 100)}%`);
console.log(`Total latency: ${(summary.totalLatencyMs / 1000).toFixed(1)}s`);
console.log(`Total cost: $${summary.totalCostUsd.toFixed(2)}`);
console.log("");
console.table(
  summary.scores.map((score) => ({
    run: score.runId,
    score: score.total,
    verdict: score.verdict,
    flags: score.flags.join(", ") || "none"
  }))
);
console.log("");
console.log("Top recommendations");
recommendations.forEach((item, index) => {
  console.log(`${index + 1}. [${item.impact}] ${item.title}`);
  console.log(`   ${item.detail}`);
});
