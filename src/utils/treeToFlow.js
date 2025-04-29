// utils/treeToFlow.js
import dagre from "dagre";

export function treeToFlow(visibleNodes) {
  console.log("Starting treeToFlow with nodes:", visibleNodes.map(n => ({
    id: n.id,
    parent: n.parent,
    label: n.label
  })));

  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ 
    rankdir: "LR",     // Left to right direction
    nodesep: 50,       // Vertical spacing between nodes
    ranksep: 120,      // Horizontal spacing between ranks
    edgesep: 40,       // Edge spacing
    align: 'UL'        // Upper-left alignment
  });

  // First pass: Add all nodes
  visibleNodes.forEach(item => {
    // Increased node size to accommodate new styling
    g.setNode(item.id, { 
      label: item.label, 
      width: 180,  // Wider to fit icons and indicators
      height: 50   // Taller to fit new padding
    });
  });

  // Second pass: Add all edges
  const edgesList = [];
  visibleNodes.forEach(item => {
    if (item.parent) {
      const parentExists = visibleNodes.some(n => n.id === item.parent);
      console.log(`Checking edge ${item.parent} -> ${item.id}: parent exists? ${parentExists}`);
      if (parentExists) {
        edgesList.push({ source: item.parent, target: item.id });
        g.setEdge(item.parent, item.id);
      }
    }
  });

  console.log("Created edges:", edgesList);

  // Apply layout
  dagre.layout(g);

  // Build React Flow nodes/edges
  const nodes = [];
  const edges = [];
  
  // Create nodes with handles
  g.nodes().forEach(id => {
    const node = g.node(id);
    const original = visibleNodes.find(n => n.id === id);
    nodes.push({
      id,
      type: 'animated', // Use our AnimatedNode component
      data: { 
        label: original.label,
        isDir: original.isDir,
        firstMarkdownId: original.firstMarkdownId
      },
      position: { x: node.x, y: node.y },
      // Change handle positions for left-to-right layout
      sourcePosition: 'right',
      targetPosition: 'left',
      // Add handle IDs
      handleBounds: {
        source: [{ id: `${id}-source`, position: 'right' }],
        target: [{ id: `${id}-target`, position: 'left' }]
      },
      style: {
        zIndex: 1 // Ensure nodes are above edges
      }
    });
  });

  // Create edges with explicit handle references
  edgesList.forEach(({ source, target }) => {
    edges.push({
      id: `e-${source}-${target}`,
      source,
      target,
      sourceHandle: `${source}-source`,
      targetHandle: `${target}-target`,
      type: 'smoothstep',
      animated: true,
      style: {
        stroke: '#2e3147',
        strokeWidth: 2,
        zIndex: 0 // Ensure edges are below nodes
      }
    });
  });

  console.log("Final flow structure:", {
    nodeCount: nodes.length,
    edgeCount: edges.length,
    nodes: nodes.map(n => n.id),
    edges: edges.map(e => `${e.source} -> ${e.target}`)
  });

  return { nodes, edges };
}
