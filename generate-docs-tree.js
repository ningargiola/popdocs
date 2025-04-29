// generate-docs-tree.js
import fs from "fs";
import path from "path";

function findFirstMarkdown(dir, tree) {
  // First check direct children
  const directMd = tree.find(node => 
    !node.isDir && 
    node.parent === dir && 
    node.label.endsWith('.md')
  );
  if (directMd) return directMd.id;

  // Then check subdirectories
  for (const node of tree) {
    if (node.isDir && node.parent === dir) {
      const childMd = findFirstMarkdown(node.id, tree);
      if (childMd) return childMd;
    }
  }
  return null;
}

function scanDir(dir, parent = null, depth = 0) {
  let result = [];
  const entries = fs.readdirSync(dir);

  let index = 0;
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const isDir = fs.lstatSync(fullPath).isDirectory();
    const nodeId = path.relative('.', fullPath).replace(/\\/g, '/');
    
    // Create the node
    const node = {
      id: nodeId,
      label: entry + (isDir ? '/' : ''),
      parent,
      position: { x: index * 250, y: depth * 120 },
      isDir,
      children: [], // Will be populated later for directories
      firstMarkdownId: null // Will be set after scanning
    };
    
    result.push(node);
    
    if (isDir) {
      // Recursively scan subdirectories
      const subResults = scanDir(fullPath, nodeId, depth + 1);
      result = result.concat(subResults);
    }
    index++;
  }
  return result;
}

// First scan the directory to get all nodes
let tree = scanDir('./docs', 'docs/');

// Add root node
tree.unshift({
  id: 'docs/',
  label: 'docs/',
  parent: null,
  position: { x: 0, y: 0 },
  isDir: true,
  children: [],
  firstMarkdownId: null
});

// Now process the flat array to:
// 1. Find first markdown file for each directory
// 2. Build children arrays
tree.forEach(node => {
  if (node.isDir) {
    // Find first markdown
    node.firstMarkdownId = findFirstMarkdown(node.id, tree);
    
    // Find children
    node.children = tree
      .filter(child => child.parent === node.id)
      .map(child => child.id);
  }
});

// Create lookup tables for quick access
const byId = {};
const byParent = {};

tree.forEach(node => {
  byId[node.id] = node;
  if (!byParent[node.parent]) {
    byParent[node.parent] = [];
  }
  byParent[node.parent].push(node.id);
});

// Save both the tree and the lookup tables
const finalData = {
  nodes: tree,
  byId,
  byParent
};

fs.writeFileSync('./src/docsTree.json', JSON.stringify(finalData, null, 2));
console.log("Enhanced docs tree saved to src/docsTree.json");

