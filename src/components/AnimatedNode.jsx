import React, { useState } from "react";
import { Handle, Position } from 'reactflow';
import { useTheme } from '../utils/ThemeContext';

export default function AnimatedNode({ data, id, sourcePosition, targetPosition }) {
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();
  
  const isMarkdown = !data.isDir && data.label.endsWith('.md');
  
  return (
    <>
      {/* Target handle */}
      <Handle
        type="target"
        position={targetPosition || Position.Left}
        id={`${id}-target`}
        style={{
          background: theme.handleColor,
          width: 8,
          height: 8,
          border: `2px solid ${theme.background}`
        }}
      />

      <div
        className="animated-node"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
          transform: isHovered ? "translateX(2px)" : "translateX(0)",
          background: data.isDir 
            ? isHovered ? theme.dirBackgroundHover : theme.dirBackground
            : isHovered ? theme.nodeBackgroundHover : theme.nodeBackground,
          borderRadius: 12,
          fontWeight: data.isDir ? 600 : 400,
          fontFamily: "Inter, system-ui, -apple-system, sans-serif",
          color: theme.text,
          padding: "12px 24px",
          minWidth: 100,
          border: `1px solid ${data.isDir 
            ? isHovered ? theme.dirBorderHover : theme.dirBorder
            : isHovered ? theme.borderHover : theme.border}`,
          boxShadow: isHovered
            ? "0 4px 12px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.05)"
            : "0 2px 6px rgba(0,0,0,0.08)",
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "14px",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        {/* Icon based on node type */}
        <span style={{ opacity: 0.7 }}>
          {data.isDir ? "📁" : isMarkdown ? "📄" : "📎"}
        </span>
        
        {/* Label */}
        <span style={{ 
          opacity: isHovered ? 1 : 0.85,
          transition: "opacity 0.2s ease",
          color: theme.text
        }}>
          {/* Remove trailing slash for directories */}
          {data.label.endsWith('/') ? data.label.slice(0, -1) : data.label}
        </span>

        {/* Indicator for directories with markdown */}
        {data.isDir && data.firstMarkdownId && (
          <span style={{
            position: "absolute",
            right: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: theme.indicatorColor,
            opacity: isHovered ? 0.8 : 0.5,
            transition: "opacity 0.2s ease",
          }} />
        )}
      </div>

      {/* Source handle */}
      <Handle
        type="source"
        position={sourcePosition || Position.Right}
        id={`${id}-source`}
        style={{
          background: theme.handleColor,
          width: 8,
          height: 8,
          border: `2px solid ${theme.background}`
        }}
      />
    </>
  );
}
