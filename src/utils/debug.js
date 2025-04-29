const DEBUG = true;  // Set to false to disable all debug logs in production

const colors = {
  app: '#2196F3',      // blue
  flow: '#4CAF50',     // green
  nodes: '#FF9800',    // orange
  selection: '#9C27B0', // purple
  error: '#F44336'     // red
};

export const debug = {
  app: (...args) => DEBUG && console.log('%c[App]', `color: ${colors.app}`, ...args),
  flow: (...args) => DEBUG && console.log('%c[Flow]', `color: ${colors.flow}`, ...args),
  nodes: (...args) => DEBUG && console.log('%c[Nodes]', `color: ${colors.nodes}`, ...args),
  selection: (...args) => DEBUG && console.log('%c[Selection]', `color: ${colors.selection}`, ...args),
  error: (...args) => DEBUG && console.error('%c[Error]', `color: ${colors.error}`, ...args)
}; 