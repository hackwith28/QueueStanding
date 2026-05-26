import { useState } from "react";

const BASE_URL = "https://queuestanding.onrender.com";

function LoginPage({ setRole, setUserName, setOrg }) {
  const [authMode, setAuthMode] = useState(null);
  const [mode, setMode] = useState(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [orgName, setOrgName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const userLogin = () => {
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    setUserName(name.trim());
    setRole("USER");
  };

  const userSignup = userLogin; // Same as login for users

  const orgLogin = async () => {
    if (!orgName.trim() || !password.trim()) {
      setError("Org name and password are required.");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/org/login?name=${encodeURIComponent(orgName)}&password=${encodeURIComponent(password)}`,
        { method: "POST" },
      );

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      if (!data || !data.id) {
        throw new Error("Invalid credentials");
      }

      setOrg(data);
      setRole("ORG");
    } catch (err) {
      setError("Invalid organization credentials.");
    }
  };

  const orgSignup = async () => {
    if (!orgName.trim() || !password.trim() || !location.trim()) {
      setError("Organization name, location, and password are required.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/org/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: orgName.trim(),
          location: location.trim(),
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create organization");
      }

      const data = await response.json();
      setOrg(data);
      setRole("ORG");
    } catch (err) {
      setError("Failed to create organization. Please try again.");
    }
  };

  const resetMode = () => {
    setMode(null);
    setName("");
    setOrgName("");
    setLocation("");
    setPassword("");
    setError("");
  };

  const resetAuthMode = () => {
    setAuthMode(null);
    resetMode();
  };

  if (!authMode) {
    return (
      <div className="page-shell">
        <div className="auth-card">
          <div className="auth-brand">
            <div className="brand-badge">Queue</div>
            <div>
              <h2>Queue Standing</h2>
              <p className="subheading">
                Choose how you'd like to get started.
              </p>
            </div>
          </div>

          <div className="button-grid">
            <button
              className="primary-button"
              onClick={() => setAuthMode("login")}
            >
              Login
            </button>
            <button
              className="secondary-button"
              onClick={() => setAuthMode("signup")}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!mode) {
    const isLogin = authMode === "login";
    return (
      <div className="page-shell">
        <div className="auth-card">
          <div className="auth-brand">
            <div className="brand-badge">{isLogin ? "Login" : "Sign Up"}</div>
            <div>
              <h2>{isLogin ? "Login" : "Sign Up"}</h2>
              <p className="subheading">
                {isLogin
                  ? "Pick your role and continue."
                  : "Create a new account to get started."}
              </p>
            </div>
          </div>

          <div className="button-grid">
            <button className="primary-button" onClick={() => setMode("USER")}>
              {isLogin ? "Login as User" : "Sign Up as User"}
            </button>
            <button className="secondary-button" onClick={() => setMode("ORG")}>
              {isLogin ? "Login as Organization" : "Create Organization"}
            </button>
          </div>

          <button className="link-button" onClick={resetAuthMode}>
            Back
          </button>
        </div>
      </div>
    );
  }

  if (mode === "USER") {
    const isLogin = authMode === "login";
    return (
      <div className="page-shell">
        <div className="auth-card">
          <div className="auth-brand">
            <div className="brand-badge">User</div>
            <div>
              <h2>User {isLogin ? "Login" : "Sign Up"}</h2>
              <p className="subheading">
                {isLogin
                  ? "Enter your name to join the queue quickly."
                  : "Enter your name to create your account."}
              </p>
            </div>
          </div>

          <div className="form-panel">
            <input
              className="form-control"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
            />
            {error && <div className="error-text">{error}</div>}
            <div className="action-row">
              <button
                className="primary-button"
                onClick={isLogin ? userLogin : userSignup}
              >
                {isLogin ? "Continue" : "Sign Up"}
              </button>
              <button className="link-button" onClick={resetMode}>
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "ORG") {
    const isLogin = authMode === "login";
    return (
      <div className="page-shell">
        <div className="auth-card">
          <div className="auth-brand">
            <div className="brand-badge">Org</div>
            <div>
              <h2>Organization {isLogin ? "Login" : "Sign Up"}</h2>
              <p className="subheading">
                {isLogin
                  ? "Manage your queue and serve visitors faster."
                  : "Create your organization to start managing queues."}
              </p>
            </div>
          </div>

          <div className="form-panel">
            <input
              className="form-control"
              placeholder="Organization Name"
              value={orgName}
              onChange={(e) => {
                setOrgName(e.target.value);
                setError("");
              }}
            />
            <input
              className="form-control"
              placeholder="Location"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setError("");
              }}
            />
            <input
              className="form-control"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />
            {error && <div className="error-text">{error}</div>}
            <div className="action-row">
              <button
                className="primary-button"
                onClick={isLogin ? orgLogin : orgSignup}
              >
                {isLogin ? "Login" : "Create Organization"}
              </button>
              <button className="link-button" onClick={resetMode}>
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginPage;
