import type { SOTKNode, TreeNode } from '../types';

/**
 * Determines the visual level of a node based on its jabatan
 * This ensures proper vertical positioning regardless of tree depth
 */
function getVisualLevel(jabatan: string): number {
  const jabatanLower = jabatan.toLowerCase();
  
  if (
    jabatanLower.includes('kepala desa') || 
    jabatanLower.includes('bpd') || 
    jabatanLower.includes('kades') || 
    jabatanLower.includes('lurah') || 
    jabatanLower.includes('petinggi')
  ) {
    return 0; // Level 1 - Top level
  }
  if (
    jabatanLower.includes('sekretaris') || 
    jabatanLower.includes('sekdes') || 
    jabatanLower.includes('seklur')
  ) {
    return 1; // Level 2 - Second level
  }
  if (
    jabatanLower.includes('kaur') || 
    jabatanLower.includes('urusan') || 
    jabatanLower.includes('kasi') || 
    jabatanLower.includes('seksi')
  ) {
    return 2; // Level 3 - Third level
  }
  if (
    jabatanLower.includes('kadus') || 
    jabatanLower.includes('dusun') || 
    jabatanLower.includes('kepala dusun') || 
    jabatanLower.includes('lingkungan')
  ) {
    return 3; // Level 4 - Fourth level (Bottom row)
  }
  
  return 2;
}

/**
 * Builds a hierarchical tree structure from flat SOTK data
 * Uses parentId to establish relationships
 */
export function buildTree(flatNodes: SOTKNode[]): TreeNode[] {
  const nodeMap = new Map<number, TreeNode>();
  const roots: TreeNode[] = [];

  // First pass: create all nodes with empty children
  flatNodes.forEach((node) => {
    nodeMap.set(node.id, {
      ...node,
      children: [],
      depth: 0,
      position: { x: 0, y: 0 },
    });
  });

  // Second pass: establish parent-child relationships
  flatNodes.forEach((node) => {
    const treeNode = nodeMap.get(node.id)!;
    
    if (node.parentId === null || node.parentId === 0) {
      // This is a root node
      roots.push(treeNode);
    } else {
      const parent = nodeMap.get(node.parentId);
      if (parent) {
        parent.children.push(treeNode);
      } else {
        // Parent not found, treat as root
        roots.push(treeNode);
      }
    }
  });

  // Sort children by urutan
  const sortChildren = (node: TreeNode) => {
    node.children.sort((a, b) => a.urutan - b.urutan);
    node.children.forEach(sortChildren);
  };

  roots.forEach(sortChildren);

  // Calculate depths
  const calculateDepths = (node: TreeNode, depth: number) => {
    node.depth = depth;
    node.children.forEach((child) => calculateDepths(child, depth + 1));
  };

  roots.forEach((root) => calculateDepths(root, 0));

  return roots;
}

/**
 * Calculates positions for all nodes in the tree
 * Uses a hierarchical layout strategy optimized for SOTK organizational charts
 */
export function calculatePositions(
  roots: TreeNode[],
  config: {
    nodeWidth: number;
    nodeHeight: number;
    horizontalSpacing: number;
    verticalSpacing: number;
  }
): TreeNode[] {
  const { nodeWidth, nodeHeight, horizontalSpacing, verticalSpacing } = config;

  // Group nodes by their visual level
  const levelGroups: { [level: number]: TreeNode[] } = {};
  const nodeLevelMap = new Map<number, number>();

  // First, collect all nodes and their visual levels
  const collectNodes = (node: TreeNode) => {
    const visualLevel = getVisualLevel(node.namaJabatan);
    nodeLevelMap.set(node.id, visualLevel);
    
    if (!levelGroups[visualLevel]) {
      levelGroups[visualLevel] = [];
    }
    levelGroups[visualLevel].push(node);
    
    node.children.forEach(collectNodes);
  };

  roots.forEach(collectNodes);

  // Calculate positions for each level
  const positionLevel = (level: number, nodes: TreeNode[]) => {
    // Sort nodes within the level by urutan
    nodes.sort((a, b) => a.urutan - b.urutan);
    
    const totalWidth = nodes.length * nodeWidth + (nodes.length - 1) * horizontalSpacing;
    const startX = -totalWidth / 2 + nodeWidth / 2;
    
    nodes.forEach((node, index) => {
      node.position = {
        x: startX + index * (nodeWidth + horizontalSpacing),
        y: level * (nodeHeight + verticalSpacing),
      };
    });
  };

  // Position each level
  Object.keys(levelGroups)
    .map(Number)
    .sort((a, b) => a - b)
    .forEach((level) => {
      positionLevel(level, levelGroups[level]);
    });

  return roots;
}

/**
 * Gets the maximum depth of the tree
 */
export function getMaxDepth(roots: TreeNode[]): number {
  const getDepth = (node: TreeNode): number => {
    if (node.children.length === 0) return 1;
    return 1 + Math.max(...node.children.map(getDepth));
  };
  
  return Math.max(...roots.map(getDepth));
}

/**
 * Gets the total width needed for the chart
 */
export function getTotalWidth(roots: TreeNode[]): number {
  if (roots.length === 0) return 0;
  
  const rightmost = Math.max(
    ...roots.flatMap((root) => {
      const getRightmost = (node: TreeNode): number => {
        if (node.children.length === 0) {
          return node.position.x;
        }
        return Math.max(...node.children.map(getRightmost));
      };
      return getRightmost(root);
    })
  );
  
  return rightmost;
}

/**
 * Gets the total height needed for the chart
 */
export function getTotalHeight(roots: TreeNode[], nodeHeight: number, verticalSpacing: number): number {
  if (roots.length === 0) return 0;
  
  const maxDepth = getMaxDepth(roots);
  return maxDepth * (nodeHeight + verticalSpacing) - verticalSpacing;
}