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
    const treeLayout = d3.tree().size([height, width - 200]);
    treeLayout(root);

    // 将根节点移动到 SVG 左侧
    const rootNode = root.descendants()[0];
    const offsetX = 100;
    const offsetY = height / 2 - rootNode.x;
    root.descendants().forEach((d) => {
      const tempX = d.x;
      d.x = d.y + offsetX;
      d.y = tempX + offsetY;
    });

    const g = svg.append("g");

    // Links
    const links = g
      .selectAll("path")
      .data(root.links())
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("d", linkHorizontal);

    // Nodes
    const nodes = g
      .selectAll("g.node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .call(
        d3
          .drag()
          .on("start", dragStarted)
          .on("drag", dragged)
          .on("end", dragEnded)
      );

    nodes
      .append("circle")
      .attr("r", 5)
      .attr("fill", "#fff")
      .attr("stroke", "#000");

    nodes
      .append("text")
      .attr("dy", 3)
      .attr("x", (d) => (d.children ? -8 : 8))
      .attr("text-anchor", (d) => (d.children ? "end" : "start"))
      .text((d) => d.data.name);

    function dragStarted(event, d) {
      d3.select(this).raise().classed("active", true);
    }

    function dragged(event, d) {
      d.x = event.x;
      d.y = event.y;
      d3.select(this).attr("transform", `translate(${d.x},${d.y})`);
      updateLinks();
    }

    function dragEnded(event, d) {
      d3.select(this).classed("active", false);
    }

    function updateLinks() {
      links.attr("d", linkHorizontal);
    }

    function linkHorizontal(d) {
      return d3.linkHorizontal()({
        source: [d.source.x || 0, d.source.y || 0],
        target: [d.target.x || 0, d.target.y || 0],
      });
    }
  }, [jsonData]);

  // transformData函数保持不变
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
