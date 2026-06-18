import { useState, useEffect } from "react";
import "./App.css";

const API = "http://localhost:8080";

export default function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  if (!token) {
    return (
      <Login
        onLogin={(t, r) => {
          setToken(t);
          setRole(r);
        }}
      />
    );
  }

  return (
    <Dashboard
      token={token}
      role={role}
      onLogout={() => {
        setToken(null);
        setRole(null);
      }}
    />
  );
}

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        setError("Invalid username or password.");
        return;
      }
      const data = await res.json();
      onLogin(data.token, data.role);
    } catch {
      setError("Could not reach the server. Is the backend running on port 8080?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="logo-icon">⚕</span>
          <h1>SafeHarbor</h1>
        </div>
        <p className="subtitle">Secure biomedical data platform</p>

        <form onSubmit={handleLogin}>
          <label className="field-label" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            autoComplete="username"
            disabled={loading}
          />
          <label className="field-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoComplete="current-password"
            disabled={loading}
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {error && <p className="error-msg">{error}</p>}

        <div className="demo-hint">
          <p className="demo-title">Demo accounts</p>
          <p>
            <strong>researcher</strong> / password123
          </p>
          <p>
            <strong>admin</strong> / admin123
          </p>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ token, role, onLogout }) {
  const isAdmin = role === "ADMIN";
  const headers = { Authorization: `Bearer ${token}` };

  const [datasets, setDatasets] = useState([]);
  const [datasetsStatus, setDatasetsStatus] = useState("loading");

  const [deidentified, setDeidentified] = useState([]);
  const [deidentifiedStatus, setDeidentifiedStatus] = useState("loading");

  const [showRawPhi, setShowRawPhi] = useState(false);
  const [rawPatients, setRawPatients] = useState([]);
  const [rawStatus, setRawStatus] = useState("idle");

  const [auditLogs, setAuditLogs] = useState([]);
  const [auditStatus, setAuditStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    async function loadDatasets() {
      setDatasetsStatus("loading");
      try {
        const res = await fetch(`${API}/datasets`, { headers });
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!cancelled) {
          setDatasets(data);
          setDatasetsStatus("ok");
        }
      } catch {
        if (!cancelled) setDatasetsStatus("error");
      }
    }

    async function loadDeidentified() {
      setDeidentifiedStatus("loading");
      try {
        const res = await fetch(`${API}/patients/deidentified`, { headers });
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!cancelled) {
          setDeidentified(data);
          setDeidentifiedStatus("ok");
        }
      } catch {
        if (!cancelled) setDeidentifiedStatus("error");
      }
    }

    async function loadAudit() {
      if (!isAdmin) return;
      setAuditStatus("loading");
      try {
        const res = await fetch(`${API}/audit`, { headers });
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!cancelled) {
          setAuditLogs(data);
          setAuditStatus("ok");
        }
      } catch {
        if (!cancelled) setAuditStatus("error");
      }
    }

    loadDatasets();
    loadDeidentified();
    loadAudit();

    return () => {
      cancelled = true;
    };
  }, [token, isAdmin]);

  useEffect(() => {
    if (!showRawPhi || !isAdmin) {
      setRawPatients([]);
      setRawStatus("idle");
      return;
    }

    let cancelled = false;
    setRawStatus("loading");

    async function loadRaw() {
      try {
        const res = await fetch(`${API}/patients`, { headers });
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!cancelled) {
          setRawPatients(data);
          setRawStatus("ok");
        }
      } catch {
        if (!cancelled) setRawStatus("error");
      }
    }

    loadRaw();
    return () => {
      cancelled = true;
    };
  }, [showRawPhi, isAdmin, token]);

  function toggleRawPhi() {
    setShowRawPhi((prev) => !prev);
  }

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div className="dash-brand">
          <span className="logo-icon sm">⚕</span>
          <div>
            <h1>SafeHarbor</h1>
            <span className={`role-badge ${isAdmin ? "admin" : "researcher"}`}>
              {role}
            </span>
          </div>
        </div>
        <button className="btn-ghost" onClick={onLogout}>
          Log out
        </button>
      </header>

      <main className="dash-main">
        <section className="panel">
          <div className="panel-header">
            <h2>Datasets</h2>
            {datasetsStatus === "ok" && (
              <span className="panel-meta">{datasets.length} records</span>
            )}
          </div>
          {datasetsStatus === "loading" && <p className="status-msg">Loading…</p>}
          {datasetsStatus === "error" && (
            <p className="status-msg error">Failed to load datasets.</p>
          )}
          {datasetsStatus === "ok" && (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Sensitivity</th>
                  </tr>
                </thead>
                <tbody>
                  {datasets.map((d) => (
                    <tr key={d.id}>
                      <td className="cell-strong">{d.name}</td>
                      <td>{d.description}</td>
                      <td>
                        <span className={`tag ${d.sensitivity}`}>
                          {d.sensitivity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>Patients</h2>
            {deidentifiedStatus === "ok" && (
              <span className="panel-meta">{deidentified.length} records</span>
            )}
          </div>
          <p className="section-label">De-identified (Safe Harbor)</p>
          {deidentifiedStatus === "loading" && (
            <p className="status-msg">Loading…</p>
          )}
          {deidentifiedStatus === "error" && (
            <p className="status-msg error">
              Failed to load de-identified patients.
            </p>
          )}
          {deidentifiedStatus === "ok" && (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Pseudo ID</th>
                    <th>Birth Year</th>
                    <th>Gender</th>
                    <th>State</th>
                  </tr>
                </thead>
                <tbody>
                  {deidentified.map((p) => (
                    <tr key={p.pseudoId}>
                      <td className="cell-mono">{p.pseudoId}</td>
                      <td>{p.birthYear}</td>
                      <td>{p.gender}</td>
                      <td>{p.state}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {isAdmin && (
            <div className="admin-phi">
              <button
                className={`btn-toggle ${showRawPhi ? "active" : ""}`}
                onClick={toggleRawPhi}
              >
                {showRawPhi ? "Hide raw PHI" : "Reveal raw PHI"}
              </button>

              {showRawPhi && (
                <div className="phi-reveal">
                  <div className="phi-banner">
                    <strong>Warning:</strong> You are viewing protected health
                    information (PHI). Access is logged and monitored.
                  </div>
                  {rawStatus === "loading" && (
                    <p className="status-msg">Loading raw patient data…</p>
                  )}
                  {rawStatus === "error" && (
                    <p className="status-msg error">
                      Failed to load raw patient records.
                    </p>
                  )}
                  {rawStatus === "ok" && (
                    <div className="table-wrap">
                      <table className="phi-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Birth Date</th>
                            <th>Gender</th>
                            <th>SSN</th>
                            <th>Address</th>
                            <th>City</th>
                            <th>State</th>
                            <th>Zip</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rawPatients.map((p) => (
                            <tr key={p.id}>
                              <td>{p.id}</td>
                              <td className="cell-strong">
                                {p.firstName} {p.lastName}
                              </td>
                              <td>{p.birthDate}</td>
                              <td>{p.gender}</td>
                              <td className="cell-mono cell-sensitive">
                                {p.ssn}
                              </td>
                              <td>{p.address}</td>
                              <td>{p.city}</td>
                              <td>{p.state}</td>
                              <td>{p.zip}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>

        {isAdmin && (
          <section className="panel">
            <div className="panel-header">
              <h2>Audit Log</h2>
              {auditStatus === "ok" && (
                <span className="panel-meta">{auditLogs.length} entries</span>
              )}
            </div>
            {auditStatus === "loading" && (
              <p className="status-msg">Loading…</p>
            )}
            {auditStatus === "error" && (
              <p className="status-msg error">Failed to load audit log.</p>
            )}
            {auditStatus === "ok" && auditLogs.length === 0 && (
              <p className="status-msg muted">No audit entries yet.</p>
            )}
            {auditStatus === "ok" && auditLogs.length > 0 && (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Action</th>
                      <th>Resource</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((entry) => (
                      <tr key={entry.id}>
                        <td className="cell-strong">{entry.username}</td>
                        <td>
                          <span className="action-pill">{entry.action}</span>
                        </td>
                        <td>{entry.resource}</td>
                        <td className="cell-timestamp">
                          {formatTimestamp(entry.timestamp)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="dash-footer">
        <p>SafeHarbor &mdash; HIPAA-aligned data access controls</p>
      </footer>
    </div>
  );
}

function formatTimestamp(ts) {
  if (!ts) return "—";
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return ts;
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return ts;
  }
}
