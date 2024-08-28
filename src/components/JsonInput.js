import React, { useEffect, useState } from "react";
import "./JsonInput.css";

function JsonInput({ onJsonChange }) {
  const [inputValue, setInputValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    formatJson(inputValue);
  }, [inputValue]);

  const formatJson = (value) => {
    try {
      const json = JSON.parse(value);
      const formatted = JSON.stringify(json, null, 2);
      setFormattedValue(formatted);
      setError(null);
      onJsonChange(json);
    } catch (error) {
      setFormattedValue(value);
      const errorPosition = getErrorPosition(error);
      setError(`JSON 格式错误: ${error.message} at position ${errorPosition}`);
    }
  };

  const getErrorPosition = (error) => {
    const match = error.message.match(/at position (\d+)/);
    return match ? match[1] : "未知";
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="json-input-container">
      <textarea
        value={inputValue}
        onChange={handleChange}
        placeholder="输入JSON数据"
        className="json-input"
      />
      <pre className="json-output">{formattedValue}</pre>
      {error && <div className="json-error">{error}</div>}
    </div>
  );
}

export default JsonInput;
