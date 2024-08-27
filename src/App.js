import React, { useState } from "react";
import D3Visualization from "./components/D3Visualization";
import JsonInput from "./components/JsonInput";
import "./styles.css";

function App() {
  const [jsonData, setJsonData] = useState(null);

  const handleJsonChange = (json) => {
    console.log("Received JSON in App:", json);
    setJsonData(json);
  };

  return (
    <div className="App flex h-screen">
      <div className="left-panel w-1/2 bg-gray-200 border-r-2 border-gray-400 h-full overflow-auto">
        <JsonInput onJsonChange={handleJsonChange} />
      </div>
      <div className="right-panel w-1/2 bg-gray-100 h-full overflow-auto">
        <D3Visualization jsonData={jsonData} />
      </div>
    </div>
  );
}

export default App;
