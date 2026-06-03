import React from 'react';

const WorkerHomeFeed = ({ user }) => {
  // Standard structured visualization metrics layer mapped to state contexts
  const metrics = [
    { label: "Gross Payout Revenue", val: "₹18,450", icon: "💰", color: "text-status-success bg-status-success/10 border-status-success/20" },
    { label: "Completed Assignments", val: "14 Jobs", icon: "💼", color: "text-brand bg-brand-light border-brand/20" },
    { label: "Performance Quality Index", val: "4.95 ★", icon: "⭐", color: "text-status-warning bg-status-warning/10 border-status-warning/20" }
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex items-center justify-between pb-6 border-b border-surface-border">
        <div>
          <h1 className="text-3xl text-ink-main">Provider Command Canvas</h1>
          <p className="mt-1 text-sm text-ink-muted">Review operational updates, active workflow dispatch sheets, and metrics pipeline targets.</p>
        </div>
        <div className="badge-success font-semibold !px-4 !py-2">🟢 Dispatch Available</div>
      </div>

      {/* METRIC PIPELINE HUB */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {metrics.map((m, idx) => (
          <div key={idx} className="flex items-center justify-between p-6 modern-card">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-ink-muted">{m.label}</span>
              <p className="mt-2 text-3xl font-bold tracking-tight text-ink-main">{m.val}</p>
            </div>
            <div className={`w-14 h-14 rounded-xl text-2xl border flex items-center justify-center ${m.color}`}>
              {m.icon}
            </div>
          </div>
        ))}
      </div>

      {/* DISPATCH QUEUE LAYERS */}
      <div className="space-y-6">
        <h2 className="text-xl text-ink-main">Live Open Inbound Contracts</h2>
        <div className="p-8 text-center border-2 border-dashed modern-card bg-surface/50">
          <p className="text-sm font-medium text-ink-muted">Inbound job streams are currently static. New geofenced requests from clients will render here automatically.</p>
        </div>
      </div>
    </div>
  );
};

export default WorkerHomeFeed;