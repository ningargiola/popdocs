import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

/**
 * Diagram component for rendering Mermaid diagrams with clickable nodes.
 * 
 * Props:
 *  - code: Mermaid diagram code as a string
 *  - onNodeClick: function(filename) => void
 */
export default function Diagram({ code, onNodeClick }) {
  const ref = useRef();

  useEffect(() => {
    // Render Mermaid diagram into the container div
    mermaid.init(undefined, ref.current);

    // After rendering, find SVG nodes and attach click handlers
    // Mermaid generates <g> elements with id or data-label
    // We'll look for those and bind listeners
    setTimeout(() => {
      // Find all SVG nodes by class (Mermaid assigns 'node' class)
      const svg = ref.current.querySelector("svg");
      if (svg) {
        // Select all nodes (rect, ellipse, etc.)
        const nodes = svg.querySelectorAll(".node");
        nodes.forEach(node => {
          // Get the label or title (often inside a <title> or <text> tag)
          const titleTag = node.querySelector("title");
          const label = titleTag ? titleTag.textContent : null;
          if (label && onNodeClick) {
            node.style.cursor = "pointer";
            node.onclick = () => onNodeClick(label);
          }
        });
      }
    }, 0); // Wait for Mermaid to finish rendering
  }, [code, onNodeClick]);

  return (
    <div ref={ref} style={{ minHeight: 300 }}>
      {code}
    </div>
  );
}
