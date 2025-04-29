import dagre from "dagre";

export function treeToFlowVertical(visibleNodes) {
  console.log("Starting treeToFlowVertical with nodes:", visibleNodes.map(n => ({
    id: n.id,
    parent: n.parent,
    label: n.label
  })));

  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ 
    rankdir: "TB",     // Top to bottom direction
    nodesep: 100,      // Increased horizontal spacing between nodes
    ranksep: 50,       // Slightly reduced vertical spacing for tighter tree
    edgesep: 20,       // Reduced edge spacing for better alignment
    align: 'DL',       // Down-left alignment for better centering
    marginx: 40,       // Increased horizontal margin
    marginy: 40        // Increased vertical margin
  });

  // First pass: Add all nodes
  visibleNodes.forEach(item => {
    g.setNode(item.id, { 
      label: item.label, 
      width: 180,
      height: 45       // Slightly increased height for better vertical spacing
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

  // Apply layout
  dagre.layout(g);

  // Find the root node and its position for centering calculation
  const rootNode = g.nodes().find(id => id === "docs/");
  const rootNodeData = rootNode ? g.node(rootNode) : null;
  const rootX = rootNodeData ? rootNodeData.x : 0;

  // Build React Flow nodes/edges
  const nodes = [];
  const edges = [];
  
  // Create nodes with handles, adjusting positions relative to centered root
  g.nodes().forEach(id => {
    const node = g.node(id);
    const original = visibleNodes.find(n => n.id === id);
    
    // For non-root nodes, adjust x position relative to root
    const xOffset = id === "docs/" ? 0 : node.x - rootX;
    
    nodes.push({
      id,
      type: 'animated',
      data: { 
        label: original.label,
        isDir: original.isDir,
        firstMarkdownId: original.firstMarkdownId
      },
      position: { 
        x: id === "docs/" ? rootX : rootX + xOffset,
        y: node.y
      },
      sourcePosition: 'bottom',
      targetPosition: 'top',
      handleBounds: {
        source: [{ 
          id: `${id}-source`, 
          position: 'bottom'
        }],
        target: [{ 
          id: `${id}-target`, 
          position: 'top'
        }]
      },
      style: {
        zIndex: id === "docs/" ? 2 : 1,  // Keep root node above others
        padding: '6px 12px'
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
      type: 'straight',  // Use straight lines for cleaner vertical connections
      style: {
        stroke: '#2e3147',
        strokeWidth: 1.5,
        zIndex: 0
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