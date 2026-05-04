import React from "react";
import { addRule, deleteRule } from "./actions";

export const dynamic = "force-dynamic";

interface PolicyRule {
  id: number;
  ruleType: string;
  ruleValue: string;
  active: boolean;
}

interface AuditRecord {
  id: number;
  filename: string;
  action: string;
  timestamp: string;
}

async function getRules(): Promise<{
  rules: PolicyRule[];
  error: string | null;
}> {
  try {
    const res = await fetch(`${process.env.JAVA_API_URL}/rules`, {
      headers: { "X-API-KEY": process.env.SENTINEL_API_KEY || "" },
      cache: "no-store",
    });
    if (!res.ok) return { rules: [], error: `Server Error (${res.status})` };
    return { rules: await res.json(), error: null };
  } catch (err) {
    return { rules: [], error: "Backend offline." };
  }
}

async function getAuditLogs(): Promise<AuditRecord[]> {
  try {
    const baseUrl = process.env.JAVA_API_URL?.replace("/policy", "/audit");
    const res = await fetch(`${baseUrl}/logs`, {
      headers: { "X-API-KEY": process.env.SENTINEL_API_KEY || "" },
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
}

export default async function Dashboard() {
  const [{ rules, error }, auditLogs] = await Promise.all([
    getRules(),
    getAuditLogs(),
  ]);

  return (
    <main className="min-h-screen bg-[#030014] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1d143a] via-[#030014] to-[#000000] text-gray-300 p-10 font-sans selection:bg-purple-500/30">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-end justify-between pb-6 border-b border-white/10">
          <div>
            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 tracking-tight">
              Sentinel Vault
            </h1>
            <p className="text-indigo-200/50 mt-2 font-medium tracking-wide uppercase text-xs">
              Central Security Policy Matrix
            </p>
          </div>

          {error ? (
            <div className="flex items-center gap-2 bg-red-950/30 text-red-400 px-4 py-2 rounded-full border border-red-900/50 shadow-[0_0_15px_rgba(220,38,38,0.15)] text-sm font-mono backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              SYS_OFFLINE
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-emerald-950/30 text-emerald-400 px-4 py-2 rounded-full border border-emerald-900/50 shadow-[0_0_15px_rgba(16,185,129,0.15)] text-sm font-mono backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              SYS_ONLINE
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div
            className={`lg:col-span-1 relative bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/5 p-6 shadow-2xl h-fit ${error ? "opacity-50 pointer-events-none" : ""}`}
          >
            <h2 className="text-lg font-medium text-white mb-5 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Inject Rule
            </h2>
            <form
              action={addRule}
              className="flex flex-col gap-4 relative z-10"
            >
              <input
                type="text"
                name="ruleValue"
                placeholder="Blacklist keyword..."
                required
                disabled={!!error}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm"
              />
              <button
                type="submit"
                disabled={!!error}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-3 rounded-xl font-medium shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all disabled:opacity-50"
              >
                Enforce
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden shadow-2xl flex flex-col h-full max-h-80">
            <div className="p-5 border-b border-white/5 bg-white/[0.01] sticky top-0">
              <h2 className="text-lg font-medium text-white flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Active Directives
              </h2>
            </div>
            <div className="overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <tbody className="divide-y divide-white/5">
                  {error ? (
                    <tr>
                      <td className="p-8 text-center text-red-400/80 font-mono text-sm">
                        ERR_CONNECTION_REFUSED
                      </td>
                    </tr>
                  ) : rules.length === 0 ? (
                    <tr>
                      <td className="p-8 text-center text-gray-600 font-mono text-sm">
                        [ NO RULES FOUND ]
                      </td>
                    </tr>
                  ) : (
                    rules.map((rule) => (
                      <tr
                        key={rule.id}
                        className="hover:bg-white/[0.03] transition-colors group"
                      >
                        <td className="p-4 text-gray-500 font-mono text-sm pl-6">
                          00{rule.id}
                        </td>
                        <td className="p-4 text-gray-200 font-medium">
                          "{rule.ruleValue}"
                        </td>
                        <td className="p-4 text-right pr-6">
                          <form action={deleteRule.bind(null, rule.id)}>
                            <button
                              type="submit"
                              className="text-gray-600 hover:text-red-400 font-mono text-xs uppercase tracking-widest transition-colors opacity-0 group-hover:opacity-100"
                            >
                              [ Revoke ]
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-black/60 backdrop-blur-2xl rounded-2xl border border-cyan-900/30 overflow-hidden shadow-[0_0_30px_rgba(8,145,178,0.05)] mt-8">
          <div className="p-5 border-b border-cyan-900/30 flex justify-between items-center bg-cyan-950/10">
            <h2 className="text-lg font-medium text-cyan-400 flex items-center gap-2 font-mono">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Live Security Feed
            </h2>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-500/20 border border-cyan-500/50"></span>
              <span className="w-3 h-3 rounded-full bg-cyan-500/20 border border-cyan-500/50"></span>
            </div>
          </div>

          <div className="overflow-x-auto p-2">
            <table className="w-full text-left font-mono text-sm border-collapse">
              <thead>
                <tr className="text-cyan-700 uppercase tracking-widest text-xs border-b border-cyan-900/20">
                  <th className="p-4 font-semibold">Timestamp</th>
                  <th className="p-4 font-semibold">Target File</th>
                  <th className="p-4 font-semibold">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-900/10">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="p-8 text-center text-cyan-900 font-mono text-sm"
                    >
                      [ AWAITING INCOMING TRAFFIC... ]
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-cyan-950/20 transition-colors"
                    >
                      <td className="p-4 text-cyan-500/50">
                        {log.timestamp
                          ? new Date(log.timestamp).toLocaleString()
                          : "Just now"}
                      </td>
                      <td className="p-4 text-cyan-200">{log.filename}</td>
                      <td className="p-4">
                        {log.action === "BLOCKED" || log.action === "DENIED" ? (
                          <span className="text-red-400 bg-red-950/40 px-3 py-1 rounded border border-red-900/50 inline-flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            BLOCKED
                          </span>
                        ) : (
                          <span className="text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded border border-emerald-900/50 inline-flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            VAULTED
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
