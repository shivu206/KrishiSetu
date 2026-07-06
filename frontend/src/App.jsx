import { useState } from "react";

import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/dashboard/Dashboard";

function App() {
  const [activePage, setActivePage] = useState(
    "dashboard",
  );

  return (
    <div className="flex min-h-screen bg-[#f8f8f6]">
      <Sidebar
  activeTab={activePage}
  setActiveTab={setActivePage}
/>

      {activePage === "dashboard" && (
        <Dashboard />
      )}
    </div>
  );
}

export default App;