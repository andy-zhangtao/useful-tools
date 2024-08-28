import * as d3 from "d3";
import React, { useEffect, useRef, useState } from "react";
import "./Visualization.css";

const D3Visualization = ({ jsonData }) => {
  const svgRef = useRef();
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // 清空之前的内容

    if (!jsonData) {
      return;
    }

    const width = 2000; // 设置一个较大的初始宽度
    const height = 2000; // 设置一个较大的初始高度

    svg.attr("width", width).attr("height", height);

    const g = svg.append("g");

    // 添加缩放行为
    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // 将输入的JSON对象转换为适合d3.hierarchy的格式
    const hierarchyData = transformData(jsonData);

    const root = d3.hierarchy(hierarchyData);
    const treeLayout = d3.tree().size([height - 100, width - 200]);

    // 折叠节点的逻辑保持不变
    root.descendants().forEach((d) => {
      if (d.depth >= 2 && !expandedNodes.has(d.data.name)) {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        }
      }
    });

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

    function update(source) {
      const duration = 750;

      // 重新计算布局
      treeLayout(root);

      // 更新节点位置
      const nodes = root.descendants();
      nodes.forEach((d) => {
        const tempX = d.x;
        d.x = d.y + offsetX;
        d.y = tempX + offsetY;
      });

      // 更新节点
      const node = g.selectAll("g.node").data(nodes, (d) => d.data.name);

      const nodeEnter = node
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", (d) => `translate(${source.x0},${source.y0})`)
        .on("click", handleClick);

      nodeEnter
        .append("circle")
        .attr("r", 5)
        .attr("fill", "#fff")
        .attr("stroke", "#000");

      nodeEnter
        .append("text")
        .attr("dy", 3)
        .attr("x", (d) => (d.children || d._children ? -8 : 8))
        .attr("text-anchor", (d) =>
          d.children || d._children ? "end" : "start"
        )
        .text((d) => d.data.name);

      const nodeUpdate = nodeEnter.merge(node);

      nodeUpdate
        .transition()
        .duration(duration)
        .attr("transform", (d) => `translate(${d.x},${d.y})`);

      const nodeExit = node
        .exit()
        .transition()
        .duration(duration)
        .attr("transform", (d) => `translate(${source.x},${source.y})`)
        .remove();

      // 更新连接线
      const link = g
        .selectAll("path")
        .data(root.links(), (d) => d.target.data.name);

      const linkEnter = link
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr("d", () => {
          const o = { x: source.x0, y: source.y0 };
          return linkHorizontal({ source: o, target: o });
        });

      const linkUpdate = linkEnter.merge(link);

      linkUpdate.transition().duration(duration).attr("d", linkHorizontal);

      link
        .exit()
        .transition()
        .duration(duration)
        .attr("d", () => {
          const o = { x: source.x, y: source.y };
          return linkHorizontal({ source: o, target: o });
        })
        .remove();

      // 保存旧位置用于过渡动画
      nodes.forEach((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    function handleClick(event, d) {
      if (d._children) {
        d.children = d._children;
        d._children = null;
        setExpandedNodes(new Set([...expandedNodes, d.data.name]));
      } else if (d.children) {
        d._children = d.children;
        d.children = null;
        const newExpandedNodes = new Set(expandedNodes);
        newExpandedNodes.delete(d.data.name);
        setExpandedNodes(newExpandedNodes);
      }
      update(d);
    }

    function linkHorizontal(d) {
      return d3.linkHorizontal()({
        source: [d.source.x || 0, d.source.y || 0],
        target: [d.target.x || 0, d.target.y || 0],
      });
    }

    update(root);
  }, [jsonData, expandedNodes]);

  function transformData(data, key = "root") {
    if (Array.isArray(data)) {
      return {
        name: key,
        children: data.map((item, index) => transformData(item, `[${index}]`)),
      };
    } else if (typeof data !== "object" || data === null) {
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

  return (
    <div style={{ width: "100%", height: "600px", overflow: "auto" }}>
      <svg ref={svgRef} style={{ minWidth: "100%", minHeight: "100%" }}></svg>
    </div>
  );
};

export default D3Visualization;
