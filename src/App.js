import React, { useState } from "react";
import JsonInput from "./components/JsonInput";
import D3Visualization from "./components/D3Visualization";
import "bootstrap/dist/css/bootstrap.min.css";
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
    <div class="col-md-6">左侧内容</div>
    <div class="col-md-6">右侧内容</div>
  </div>
      <div className="row h-100">
        <div className="col-3 bg-light border-right overflow-auto">
          <JsonInput onJsonChange={handleJsonChange} />
        </div>
        <div className="col-6 bg-white overflow-auto">
          <D3Visualization jsonData={jsonData} />
        </div>
      </div>
    </div>
  );
}

export default App;