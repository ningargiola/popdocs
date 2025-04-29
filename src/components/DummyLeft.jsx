import React, { useState, useMemo, useCallback, useEffect } from "react";
import ReactFlow, { MiniMap, Controls, Background, useReactFlow } from "reactflow";
import "reactflow/dist/style.css";
import { treeToFlow } from "../utils/treeToFlow";
import { treeToFlowVertical } from "../utils/treeToFlowVertical";
import docsTree from "../docsTree.json";
import AnimatedNode from "./AnimatedNode";
import { debug } from "../utils/debug";
import { useTheme } from '../utils/ThemeContext';

// Utility: recursively build visible tree based on expanded ids
function buildVisibleTree(tree, expandedIds) {
  debug.flow('Building visible tree with expanded IDs:', expandedIds);
  const visible = [];
  
  function addBranch(nodeId) {
    const node = tree.byId[nodeId];
    if (node && !visible.find(n => n.id === nodeId)) {
      visible.push(node);
      if (expandedIds.includes(nodeId)) {
        // Use the children array directly from the node
        node.children.forEach(childId => addBranch(childId));
      }
    }
  }
  
  addBranch("docs/");
  debug.flow('Visible tree built:', visible.length, 'nodes');
  return visible;
}

const nodeTypes = { animated: AnimatedNode };

// Custom edge style
const edgeOptions = {
  type: 'smoothstep',
  animated: true,
  style: { 
    stroke: '#2e3147', 
    strokeWidth: 2,
    zIndex: 0
  }
};

// Custom minimap style
const minimapStyle = {
  backgroundColor: '#f8f8ff',
  maskColor: 'rgba(30,32,60,0.1)',
  borderRadius: 8,
  border: '1px solid #eeeef5'
};

function DummyLeft({ setSelectedNode }) {
  const [expandedIds, setExpandedIds] = useState(["docs/"]);
  const [isHorizontal, setIsHorizontal] = useState(true);
  const reactFlow = useReactFlow();
  const { theme } = useTheme();

  const { nodes, edges } = useMemo(() => {
    debug.flow('Recalculating flow layout');
    const visibleBranch = buildVisibleTree(docsTree, expandedIds);
    const result = isHorizontal ? treeToFlow(visibleBranch) : treeToFlowVertical(visibleBranch);
    debug.flow('Flow layout updated:', { 
      nodes: result.nodes.length, 
      edges: result.edges.length,
      expandedIds,
      layout: isHorizontal ? 'horizontal' : 'vertical'
    });
    return result;
  }, [expandedIds, isHorizontal]);

  // Node click: expand folders and select first markdown or node
  const onNodeClick = useCallback((event, node) => {
    const treeNode = docsTree.byId[node.id];
    debug.nodes('Node clicked:', node.id, treeNode);
    
    if (treeNode.isDir) {
      // If it's a directory, expand it
      if (!expandedIds.includes(node.id)) {
        setExpandedIds(ids => [...ids, node.id]);
      }
      
      // If directory has a first markdown file, select it
      if (treeNode.firstMarkdownId) {
        const mdNode = docsTree.byId[treeNode.firstMarkdownId];
        debug.nodes('Auto-selecting markdown file:', mdNode.label);
        setSelectedNode({
          id: mdNode.id,
          label: mdNode.label,
          isDir: false
        });
      } else {
        // If no markdown file found, just select the folder
        setSelectedNode({
          id: node.id,
          label: treeNode.label,
          isDir: true
        });
      }
    } else {
      // If it's a file, just select it
      setSelectedNode({
        id: node.id,
        label: treeNode.label,
        isDir: false
      });
    }
  }, [expandedIds, setSelectedNode]);

  // Back button: collapse most recent
  const onBack = () => {
    debug.flow('Back button clicked, collapsing last expanded folder');
    if (expandedIds.length > 1) {
      const newIds = expandedIds.slice(0, -1);
      debug.flow('New expanded IDs:', newIds);
      setExpandedIds(newIds);
    }
  };

  // Center/zoom on latest expanded node
  useEffect(() => {
    if (!reactFlow || nodes.length === 0) return;
    const latestId = expandedIds[expandedIds.length - 1];
    const node = nodes.find(n => n.id === latestId);
    if (node) {
      debug.flow('Centering on node:', latestId, node.position);
      reactFlow.setCenter(node.position.x, node.position.y, { zoom: 1.5, duration: 400 });
    }
  }, [expandedIds, nodes, reactFlow]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: theme.background,
        color: theme.text,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontSize: "1em",
        paddingTop: 16,
        boxSizing: "border-box",
      }}
    >
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingLeft: 16,
        paddingRight: 16,
        marginBottom: 10
      }}>
        {/* Back button */}
        {expandedIds.length > 1 && (
          <button
            onClick={onBack}
            style={{
              background: theme.dirBackground,
              color: theme.text,
              border: "none",
              borderRadius: 8,
              padding: "8px 20px",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
              ':hover': {
                background: theme.dirBackgroundHover,
                transform: "translateY(-1px)",
                boxShadow: "0 3px 6px rgba(0,0,0,0.1)"
              }
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>←</span>
            Back
          </button>
        )}

        {/* Layout switch */}
        <div style={{
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: theme.switchBackground,
          padding: '4px',
          borderRadius: '8px',
          border: `1px solid ${theme.switchBorder}`
        }}>
          <button
            onClick={() => setIsHorizontal(true)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              background: isHorizontal ? theme.switchActiveBackground : 'transparent',
              color: isHorizontal ? theme.text : theme.textDim,
              fontWeight: isHorizontal ? 600 : 400,
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'all 0.2s ease'
            }}
          >
            Horizontal
          </button>
          <button
            onClick={() => setIsHorizontal(false)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              background: !isHorizontal ? theme.switchActiveBackground : 'transparent',
              color: !isHorizontal ? theme.text : theme.textDim,
              fontWeight: !isHorizontal ? 600 : 400,
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'all 0.2s ease'
            }}
          >
            Vertical
          </button>
        </div>
      </div>

      <div style={{ flex: 1, width: "100%", minHeight: 350 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={{
            ...edgeOptions,
            style: {
              ...edgeOptions.style,
              stroke: theme.edgeColor
            }
          }}
          fitView
          minZoom={0.5}
          maxZoom={2}
          zoomOnScroll={true}
          panOnDrag={true}
          preventScrolling={false}
          snapToGrid={false}
          elementsSelectable={true}
          nodesConnectable={false}
          nodesDraggable={false}
          style={{ background: theme.flowBackground }}
        >
          <MiniMap 
            style={{
              backgroundColor: theme.miniMapBackground,
              maskColor: theme.miniMapMask,
              borderRadius: 8,
              border: `1px solid ${theme.switchBorder}`
            }} 
            zoomable 
            pannable 
          />
          <Controls 
            style={{
              borderRadius: 8,
              border: `1px solid ${theme.switchBorder}`,
              boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
              backgroundColor: theme.controlsBackground
            }}
          />
          <Background color={theme.flowBackgroundPattern} gap={20} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}

export default DummyLeft;
