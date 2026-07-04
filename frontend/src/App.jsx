import { useState } from "react";

import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-[#f7f7f5]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <Dashboard />
    </div>
  );
}

export default App;