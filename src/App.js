import "bootstrap/dist/css/bootstrap.min.css";
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
    <div className="App container-fluid h-100">
      <div class="row">
        <div class="col-md-6"></div>
        <div class="col-md-6"></div>
      </div>
      <div className="row h-100">
        <div className="col-4 bg-light border-right overflow-auto">
          <JsonInput onJsonChange={handleJsonChange} />
        </div>
        <div className="col-8 bg-white overflow-auto">
          <D3Visualization jsonData={jsonData} />
        </div>
      </div>
    </div>
  );
}

export default App;
