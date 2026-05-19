import type { AgentRun, EvalScore } from "../lib/types";

interface RunTableProps {
  runs: AgentRun[];
  scores: EvalScore[];
}

const verdictLabel: Record<EvalScore["verdict"], string> = {
  ship: "Ship",
  monitor: "Monitor",
  block: "Block"
};

export function RunTable({ runs, scores }: RunTableProps) {
  const scoreByRun = new Map(scores.map((score) => [score.runId, score]));

  return (
    <section className="panel table-panel">
      <div className="section-heading">
        <p>Run Ledger</p>
        <h2>Agent behavior under production-like scenarios</h2>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Agent</th>
              <th>Model</th>
              <th>Score</th>
              <th>Verdict</th>
              <th>Risk flags</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => {
              const score = scoreByRun.get(run.id);
              return (
                <tr key={run.id}>
                  <td>
                    <strong>{run.agentName}</strong>
                    <span>{run.id}</span>
                  </td>
                  <td>{run.model}</td>
                  <td>{score?.total ?? "-"}</td>
                  <td>
                    <span className={`verdict ${score?.verdict ?? "monitor"}`}>
                      {score ? verdictLabel[score.verdict] : "Pending"}
                    </span>
                  </td>
                  <td>{score?.flags.join(", ") || "none"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
