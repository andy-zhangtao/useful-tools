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

    console.log("Rendering D3 visualization with data:", jsonData);
    console.log("Width:", width, "Height:", height);
    const root = d3.hierarchy(jsonData);
    const treeLayout = d3.tree().size([width, height]);
    treeLayout(root);

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
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    nodes
      .append("circle")
      .attr("r", 5)
      .attr("fill", "#fff")
      .attr("stroke", "#000");

    nodes
      .append("text")
      .attr("dy", -10)
      .attr("text-anchor", "middle")
      .text((d) => d.data.name || d.data.label || d.data.id);
  }, [jsonData]);

  return <svg ref={svgRef} className="w-full h-full"></svg>;
};

export default D3Visualization;
