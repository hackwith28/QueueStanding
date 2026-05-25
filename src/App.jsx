import { useState } from "react";
import "./App.css";
import LoginPage from "./LoginPage";
import UserPage from "./UserPage";
import OrgDashboard from "./OrgDashboard";

function App() {
  const [role, setRole] = useState(null);
  const [userName, setUserName] = useState(null);
  const [org, setOrg] = useState(null);

  const logout = () => {
    setRole(null);
    setUserName(null);
    setOrg(null);
  };

  if (!role) {
    return (
      <LoginPage setRole={setRole} setUserName={setUserName} setOrg={setOrg} />
    );
  }

  if (role === "USER") {
    return <UserPage userName={userName} onLogout={logout} />;
  }

  if (role === "ORG") {
    return <OrgDashboard org={org} onLogout={logout} />;
  }
}

export default App;
