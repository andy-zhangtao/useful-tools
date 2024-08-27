import React, { useState } from "react";

function JsonInput({ onJsonChange }) {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event) => {
    setInputValue(event.target.value);
    try {
      const json = JSON.parse(event.target.value);
      onJsonChange(json);
    } catch (error) {
      console.error("Invalid JSON input", error);
    }
  };

  return (
    <textarea
      value={inputValue}
      onChange={handleChange}
      placeholder="输入JSON数据"
      className="w-full h-full p-2"
    />
  );
}

export default JsonInput;
