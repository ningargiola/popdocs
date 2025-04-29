import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { debug } from "../utils/debug";
import docsTree from "../docsTree.json";

function DummyRight({ selectedNode }) {
  const [markdown, setMarkdown] = useState("Loading...");

  useEffect(() => {
    if (!selectedNode) {
      debug.selection('No node selected');
      setMarkdown("No node selected.");
      return;
    }

    debug.selection('Selected node:', selectedNode);
    let mdPath;

    if (selectedNode.isDir) {
      // For directories, use the pre-computed first markdown file
      const treeNode = docsTree.byId[selectedNode.id];
      if (treeNode && treeNode.firstMarkdownId) {
        mdPath = treeNode.firstMarkdownId;
        debug.selection('Using pre-computed first markdown:', mdPath);
      } else {
        // Fallback to architecture.md only if no markdown found
        mdPath = "/docs/architecture.md";
        debug.selection('No markdown found in folder, using fallback:', mdPath);
      }
    } else {
      mdPath = selectedNode.id;
      debug.selection('Using selected file directly:', mdPath);
    }

    // Remove the leading slash if present for fetch
    const fetchPath = mdPath.startsWith('/') ? mdPath.slice(1) : mdPath;
    debug.selection('Fetching markdown from:', fetchPath);

    fetch(fetchPath)
      .then(res => {
        debug.selection('Fetch response:', res.status, res.statusText);
        if (res.ok) return res.text();
        throw new Error("File not found");
      })
      .then(text => {
        debug.selection('Markdown loaded:', text.length, 'characters');
        setMarkdown(text);
      })
      .catch(error => {
        debug.error('Failed to load markdown:', error);
        setMarkdown("No documentation found.");
      });
  }, [selectedNode]);

  return (
    <div 
      style={{ 
        height: "100%",
        width: "100%",
        padding: '32px',
        overflow: 'auto',
        overflowX: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
}

export default DummyRight;
