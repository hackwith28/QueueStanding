import { useEffect, useMemo, useState } from "react";

const BASE_URL = "https://queuestanding.onrender.com";

function UserPage({ userName, onLogout }) {
  const [orgs, setOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [queue, setQueue] = useState([]);
  const [name, setName] = useState(userName || "");
  const [myToken, setMyToken] = useState(null);
  const [loadingOrgs, setLoadingOrgs] = useState(false);
  const [loadingQueue, setLoadingQueue] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  const loadOrgs = async () => {
    setLoadingOrgs(true);
    try {
      const response = await fetch(`${BASE_URL}/org`);
      const data = await response.json();
      setOrgs(data || []);
    } finally {
      setLoadingOrgs(false);
    }
  };

  const loadQueue = async (orgId) => {
    if (!orgId) return;
    setLoadingQueue(true);
    try {
      const response = await fetch(`${BASE_URL}/queue/${orgId}`);
      const data = await response.json();
      setQueue(data || []);
    } finally {
      setLoadingQueue(false);
    }
  };

  const joinQueue = async () => {
    if (!name.trim()) {
      setError("Please enter your name before joining.");
      return;
    }

    if (!selectedOrg) {
      setError("Choose an organization first.");
      return;
    }

    setJoining(true);
    setError("");

    try {
      const response = await fetch(
        `${BASE_URL}/queue/join?name=${encodeURIComponent(name.trim())}&orgId=${selectedOrg.id}`,
        { method: "POST" },
      );
      const data = await response.json();
      setMyToken(data);
      await loadQueue(selectedOrg.id);
    } finally {
      setJoining(false);
    }
  };

  useEffect(() => {
    loadOrgs();
  }, []);

  useEffect(() => {
    if (!selectedOrg) return;

    // 🔥 Load immediately
    loadQueue(selectedOrg.id);

    const interval = setInterval(() => {
      loadQueue(selectedOrg.id);
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedOrg]);

  const position = useMemo(() => {
    if (!myToken || !queue.length) return null;
    return queue.findIndex((t) => t.id === myToken.id) + 1 || null;
  }, [myToken, queue]);

  if (!selectedOrg) {
    return (
      <div className="page-shell">
        <div className="auth-card">
          <div className="auth-brand">
            <div className="brand-badge">Choose</div>
            <div>
              <h2>Pick an Organization</h2>
              <p className="subheading">
                Browse live queues and join the line in one click.
              </p>
            </div>
          </div>

          <div className="button-grid">
            {loadingOrgs ? (
              <div className="empty-state">Loading organizations…</div>
            ) : (
              orgs.map((org) => (
                <button
                  key={org.id}
                  className="card-button"
                  onClick={() => {
                    setSelectedOrg(org);
                    loadQueue(org.id); // 🔥 LOAD IMMEDIATELY
                  }}
                >
                  {org.name}
                </button>
              ))
            )}
          </div>

          <button className="link-button" onClick={onLogout}>
            Log out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <div>
            <h2>{selectedOrg.name}</h2>
            <p className="subheading">
              Live queue for your selected organization.
            </p>
          </div>
          <div className="header-actions">
            <button
              className="secondary-button"
              onClick={() => setSelectedOrg(null)}
            >
              Change Org
            </button>
            <button className="secondary-button" onClick={onLogout}>
              Log out
            </button>
          </div>
        </div>

        <div className="queue-overview">
          <div className="stat-card">
            <span className="stat-title">Queue length</span>
            <strong>{queue.length}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-title">Next token</span>
            <strong>{queue[0]?.tokenNumber ?? "—"}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-title">Your position</span>
            <strong>{position ? `#${position}` : "Not joined"}</strong>
          </div>
        </div>

        <div className="form-panel">
          <h3>Join the queue</h3>
          <p className="hint">
            Enter your display name and receive a token instantly.
          </p>
          <div className="form-row">
            <input
              className="form-control"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
            />
            <button
              className="primary-button"
              onClick={joinQueue}
              disabled={joining || !name.trim()}
            >
              {joining ? "Joining…" : "Join Queue"}
            </button>
          </div>
          {error && <div className="error-text">{error}</div>}
        </div>

        {myToken && (
          <div className="highlight-panel">
            <span className="badge">Your token</span>
            <strong className="token-value">{myToken.tokenNumber}</strong>
            <p className="hint">Keep this token visible while you wait.</p>
          </div>
        )}

        <div className="section">
          <div className="section-title-row">
            <h3>Current queue</h3>
            <button
              className="link-button"
              onClick={() => loadQueue(selectedOrg.id)}
            >
              Refresh
            </button>
          </div>

          {loadingQueue ? (
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
            <div className="empty-state">Nobody is waiting yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserPage;
