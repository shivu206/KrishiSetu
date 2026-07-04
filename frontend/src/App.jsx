import { useEffect, useState } from "react";

import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard/Dashboard";
import { getFields } from "./services/api";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [fields, setFields] = useState([]);

  useEffect(() => {
    getFields()
      .then((backendFields) => {
        setFields(backendFields);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  }, []);

  if (fields.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7f5]">
        <p className="text-primary-green font-medium">
          Loading KrishiSetu field data...
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f7f7f5]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <Dashboard fields={fields} />
    </div>
  );
}

export default App;