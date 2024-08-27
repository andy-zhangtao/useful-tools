import React from "react";
import ReactDOM from "react-dom/client"; // 修改导入路径
import App from "./App";
import "./styles.css";

// 使用 createRoot 替代 ReactDOM.render
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
