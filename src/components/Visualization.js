import React from "react";
import CytoscapeComponent from "react-cytoscapejs";
import "./Visualization.css";

function convertJsonToElements(jsonData, parentId = "main", elements = []) {
  if (!jsonData) {
    return [];
  }

  if (parentId === "main") {
    elements.push({ data: { id: "main", label: "用户信息" } }); // 添加主节点
  }

  Object.keys(jsonData).forEach((key) => {
    const value = jsonData[key];
    const nodeId = `${parentId}-${key}`;
    let label = `${key}`;

    if (Array.isArray(value)) {
      label += `: [Array]`;
      elements.push({ data: { id: nodeId, label: label } });
      elements.push({ data: { source: parentId, target: nodeId } });
      value.forEach((item, index) => {
        const itemId = `${nodeId}-${index}`;
        elements.push({
          data: { id: itemId, label: `${index}: ${JSON.stringify(item)}` },
        });
        elements.push({ data: { source: nodeId, target: itemId } });
        if (typeof item === "object" && item !== null) {
          convertJsonToElements(item, itemId, elements);
        }
      });
    } else if (typeof value === "object" && value !== null) {
      label += `: [Object]`;
      elements.push({ data: { id: nodeId, label: label } });
      elements.push({ data: { source: parentId, target: nodeId } });
      convertJsonToElements(value, nodeId, elements);
    } else {
      label += `: ${value}`;
      elements.push({ data: { id: nodeId, label: label } }); // 添加属性节点
      elements.push({ data: { source: parentId, target: nodeId } }); // 连接节点
    }
  });

  return elements;
}

function Visualization({ jsonData }) {
  const elements = convertJsonToElements(jsonData);

  // 添加一个默认节点
  if (elements.length === 0) {
    elements.push({ data: { id: "main", label: "根节点" } });
  }

  console.log("Rendering elements:", elements); // 添加日志输出渲染的元素

  return (
    <div className="cyto-container">
      <CytoscapeComponent
        elements={elements}
        style={{ width: "100%", height: "100%" }}
        layout={{ name: "breadthfirst" }}
        stylesheet={[
          {
            selector: "node",
            style: {
              label: "data(label)",
              "text-valign": "center",
              color: "#000",
              "background-color": "#fff",
              "border-width": 1,
              "border-color": "#000",
              "font-size": 10,
              width: 20,
              height: 20,
            },
          },
          {
            selector: "edge",
            style: {
              width: 1,
              "line-color": "#ccc",
              "target-arrow-color": "#ccc",
              "target-arrow-shape": "triangle",
              "curve-style": "bezier",
            },
          },
        ]}
        cy={(cy) => {
          cy.center(); // 将图形居中
        }}
      />
    </div>
  );
}

export default Visualization;
