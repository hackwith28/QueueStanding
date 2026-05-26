import { useEffect, useState } from "react";

const BASE_URL = "https://queuestanding.onrender.com";

function OrgDashboard({ org, onLogout }) {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serving, setServing] = useState(false);

  const loadQueue = async () => {
    if (!org?.id) return;
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/queue/${org.id}`);
      const data = await response.json();
      setQueue(data || []);
    } finally {
      setLoading(false);
    }
  };

  const serveNext = async () => {
    if (!org?.id) return;
    setServing(true);
    try {
      await fetch(`${BASE_URL}/queue/serve/${org.id}`, {
        method: "POST",
      });
      await loadQueue();
    } finally {
      setServing(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, [org]);

  useEffect(() => {
    if (!org?.id) return;

    const interval = setInterval(() => {
      loadQueue();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [org]);

  return (
    <div className="page-shell">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <div>
            <h2>{org?.name ?? "Organization"} Dashboard</h2>
            <p className="subheading">
              See the live queue, serve visitors, and keep your line moving.
            </p>
          </div>
          <button className="secondary-button" onClick={onLogout}>
            Log out
          </button>
        </div>

        <div className="queue-overview">
          <div className="stat-card">
            <span className="stat-title">Active queue</span>
            <strong>{queue.length}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-title">Next to serve</span>
            <strong>{queue[0]?.tokenNumber ?? "—"}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-title">Waiting</span>
            <strong>{queue.length}</strong>
          </div>
        </div>

        <div className="section-title-row">
          <h3>Queue</h3>
          <button className="link-button" onClick={loadQueue}>
            Refresh
          </button>
        </div>

        <div className="section">
          {loading ? (
            <div className="empty-state">Loading queue…</div>
          ) : queue.length ? (
            queue.map((t, index) => (
              <div
                key={t.id}
                className={`list-item ${index === 0 ? "next-item" : ""}`}
              >
                <span>{t.tokenNumber}</span>
                <div>
                  <strong>{t.userName}</strong>
                  <div className="item-subtitle">Position {index + 1}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">No customers waiting right now.</div>
          )}
        </div>

        <button
          className="primary-button large"
          onClick={serveNext}
          disabled={!queue.length || serving}
        >
          {serving ? "Serving…" : "Serve Next"}
        </button>
      </div>
    </div>
  );
}

export default OrgDashboard;
