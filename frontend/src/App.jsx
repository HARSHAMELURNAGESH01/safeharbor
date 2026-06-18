import { useState } from "react";
import "./App.css";

const API = "http://localhost:8080";

export default function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  if (!token) {
    return <Login onLogin={(t, r) => { setToken(t); setRole(r); }} />;
  }
  return <Dashboard token={token} role={role} onLogout={() => setToken(null)} />;
}

function Login({ onLogin }) {
  const [username, setUsername] = useState("researcher");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) { setError("Invalid username or password"); return; }
      const data = await res.json();
      onLogin(data.token, data.role);
    } catch {
      setError("Could not reach the server. Is the backend running?");
    }
  }

  return (
    <div className="auth-wrap">
      <div className="card">
        <h1>SafeHarbor</h1>
        <p className="subtitle">Secure biomedical data platform</p>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button onClick={handleLogin}>Log in</button>
        {error && <p className="error">{error}</p>}
        <p className="hint">Try: researcher / password123 &nbsp;•&nbsp; admin / admin123</p>
      </div>
    </div>
  );
}

function Dashboard({ token, role, onLogout }) {
  const [datasets, setDatasets] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loaded, setLoaded] = useState(false);

  async function loadData() {
    const headers = { Authorization: `Bearer ${token}` };
    const d = await fetch(`${API}/datasets`, { headers }).then((r) => r.json());
    const p = await fetch(`${API}/patients`, { headers }).then((r) => r.json());
    setDatasets(d);
    setPatients(p);
    setLoaded(true);
  }

  return (
    <div className="dash">
      <header>
        <div>
          <h1>SafeHarbor</h1>
          <span className="role">Signed in as {role}</span>
        </div>
        <button className="ghost" onClick={onLogout}>Log out</button>
      </header>

      {!loaded && <button onClick={loadData}>Load my data</button>}

      {loaded && (
        <>
          <section>
            <h2>Datasets</h2>
            <table>
              <thead><tr><th>Name</th><th>Description</th><th>Sensitivity</th></tr></thead>
              <tbody>
                {datasets.map((d) => (
                  <tr key={d.id}>
                    <td>{d.name}</td>
                    <td>{d.description}</td>
                    <td><span className={`tag ${d.sensitivity}`}>{d.sensitivity}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section>
            <h2>Patients <span className="count">({patients.length})</span></h2>
            <p className="warn">⚠ Showing raw PHI — de-identification coming next</p>
            <table>
              <thead><tr><th>Name</th><th>Birth date</th><th>Gender</th><th>SSN</th><th>City</th></tr></thead>
              <tbody>
                {patients.slice(0, 25).map((p) => (
                  <tr key={p.id}>
                    <td>{p.firstName} {p.lastName}</td>
                    <td>{p.birthDate}</td>
                    <td>{p.gender}</td>
                    <td>{p.ssn}</td>
                    <td>{p.city}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
}