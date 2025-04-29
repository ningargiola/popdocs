import React, { useState, useEffect } from "react";
import { ReactFlowProvider } from "reactflow";
import DummyLeft from "./components/DummyLeft";
import DummyRight from "./components/DummyRight";
import popdocs from "./assets/popdocs.png"; // <-- Update this path if needed
import { debug } from "./utils/debug";
import { ThemeProvider, useTheme } from './utils/ThemeContext';
import { HiSun, HiMoon } from "react-icons/hi";

// Theme toggle switch component
function ThemeToggle() {
  const { isDark, toggleTheme, theme } = useTheme();
  
  return (
    <div 
      onClick={toggleTheme}
      style={{
        position: 'relative',
        width: '48px',
        height: '24px',
        background: isDark ? theme.switchActiveBackground : theme.switchBackground,
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        border: `1px solid ${theme.switchBorder}`,
        display: 'flex',
        alignItems: 'center',
        padding: '2px'
      }}
    >
      {/* Icons */}
      <span style={{
        position: 'absolute',
        left: '6px',
        opacity: isDark ? 0.5 : 1,
        transition: 'opacity 0.2s ease',
        display: 'flex',
        alignItems: 'center'
      }}>
        <HiSun size={12} color={isDark ? theme.textDim : theme.textDim} />
      </span>
      <span style={{
        position: 'absolute',
        right: '6px',
        opacity: isDark ? 1 : 0.5,
        transition: 'opacity 0.2s ease',
        display: 'flex',
        alignItems: 'center'
      }}>
        <HiMoon size={12} color={isDark ? theme.text : theme.textDim} />
      </span>
      
      {/* Sliding circle */}
      <div style={{
        width: '18px',
        height: '18px',
        background: theme.background,
        borderRadius: '50%',
        transform: isDark ? 'translateX(30px)' : 'translateX(0)',
        transition: 'transform 0.2s ease',
        boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
        zIndex: 1
      }} />
    </div>
  );
}

function AppContent() {
  const [selectedNode, setSelectedNode] = useState({ id: "docs/", label: "docs/", isDir: true });
  const { theme } = useTheme();

  useEffect(() => {
    debug.app('App initialized');
  }, []);

  const handleNodeSelection = (node) => {
    debug.app('Node selection changed:', node);
    setSelectedNode(node);
  };

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      background: theme.background,
      color: theme.text,
      overflow: "hidden"
    }}>
      {/* Header */}
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "25px 20px",
        background: theme.background,
        borderBottom: `1px solid ${theme.border}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        zIndex: 10,
        height: "48px",
        boxSizing: "border-box"
      }}>
        <h1 style={{
          margin: 0,
          fontSize: "20px",
          fontWeight: 600,
          letterSpacing: "-0.5px"
        }}>
          PopDocs
        </h1>
        <ThemeToggle />
      </header>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: "flex",
        minHeight: 0
      }}>
        <div style={{
          width: "50%",
          height: "100%",
          position: "relative"
        }}>
          <ReactFlowProvider>
            <DummyLeft setSelectedNode={handleNodeSelection} />
          </ReactFlowProvider>
        </div>
        <div style={{
          width: "50%",
          height: "100%",
          borderLeft: `1px solid ${theme.border}`
        }}>
          <DummyRight selectedNode={selectedNode} />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
