import * as d3 from "d3";
import React, { useEffect, useRef } from "react";
import "./Visualization.css";

const D3Visualization = ({ jsonData }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // 清空之前的内容

    if (!jsonData) {
      return;
    }

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // 将输入的JSON对象转换为适合d3.hierarchy的格式
    const hierarchyData = transformData(jsonData);

    const root = d3.hierarchy(hierarchyData);
    const treeLayout = d3.tree().size([width, height - 100]);
    treeLayout(root);

    // 将根节点移动到 SVG 中央
    const rootNode = root.descendants()[0];
    const offsetX = width / 2 - rootNode.x;
    const offsetY = 50; // 给顶部留出一些空间
    root.descendants().forEach((d) => {
      d.x += offsetX;
      d.y += offsetY;
    });

    // Links
    svg
      .selectAll("line")
      .data(root.links())
      .enter()
      .append("line")
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y)
      .attr("stroke", "#ccc");

    // Nodes
    const nodes = svg
      .selectAll("g")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .call(
        d3
          .drag()
          .on("start", (event, d) => {
            d3.select(event.sourceEvent.target).raise().attr("stroke", "black");
          })
          .on("drag", (event, d) => {
            d.x = event.x;
            d.y = event.y;
            d3.select(event.sourceEvent.target.parentNode).attr(
              "transform",
              `translate(${d.x},${d.y})`
            );
            svg
              .selectAll("line")
              .attr("x1", (d) => d.source.x)
              .attr("y1", (d) => d.source.y)
              .attr("x2", (d) => d.target.x)
              .attr("y2", (d) => d.target.y);
          })
          .on("end", (event, d) => {
            d3.select(event.sourceEvent.target).attr("stroke", null);
          })
      );

    nodes
      .append("circle")
      .attr("r", 5)
      .attr("fill", "#fff")
      .attr("stroke", "#000");

    nodes
      .append("text")
      .attr("dy", 20) // 增加文本与节点的距离
      .attr("text-anchor", "middle")
      .text((d) => d.data.name);
  }, [jsonData]);

  // 修改后的transformData函数
  function transformData(data, key = "root") {
    if (typeof data !== "object" || data === null) {
      return { name: `${key}: ${data}` };
    }

    const result = { name: key, children: [] };

    for (const [childKey, value] of Object.entries(data)) {
      if (typeof value === "object" && value !== null) {
        result.children.push(transformData(value, childKey));
      } else {
        result.children.push({ name: `${childKey}: ${value}` });
      }
    }

    return result;
  }

  return <svg ref={svgRef} className="w-full h-full"></svg>;
};

export default D3Visualization;
