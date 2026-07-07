import React from 'react';
import type { TreeNode } from './types';

interface SVGConnectorsProps {
  roots: TreeNode[];
  nodeWidth: number;
  nodeHeight: number;
  strokeWidth?: number;
  strokeColor?: string;
  curveSmoothness?: number;
}

interface ConnectorPath {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

/**
 * Generates smooth bezier curve paths for organizational chart connectors
 */
function generateConnectorPath(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  curveSmoothness: number = 0.5
): string {
  // Calculate control points for smooth S-curve
  const verticalDistance = toY - fromY;
  const controlPointOffset = verticalDistance * curveSmoothness;
  
  // Create a smooth S-curve using cubic bezier
  const path = `
    M ${fromX} ${fromY}
    C ${fromX} ${fromY + controlPointOffset},
      ${toX} ${toY - controlPointOffset},
      ${toX} ${toY}
  `.trim().replace(/\s+/g, ' ');
  
  return path;
}

/**
 * Generates a vertical drop line with horizontal branch
 */
function generateBranchPath(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  curveSmoothness: number = 0.5
): string {
  const midY = fromY + (toY - fromY) * 0.5;
  
  // Vertical line down from parent
  const verticalPart = `M ${fromX} ${fromY} L ${fromX} ${midY}`;
  
  // Horizontal line to child's x position
  const horizontalPart = `L ${toX} ${midY}`;
  
  // Vertical line down to child
  const verticalToEnd = `L ${toX} ${toY}`;
  
  return `${verticalPart} ${horizontalPart} ${verticalToEnd}`;
}

/**
 * Component for rendering all connectors in the organizational chart
 */
export const SVGConnectors: React.FC<SVGConnectorsProps> = ({
  roots,
  nodeWidth,
  nodeHeight,
  strokeWidth = 2,
  strokeColor = '#CBD5E1',
  curveSmoothness = 0.5,
}) => {
  const connectors: JSX.Element[] = [];
  let connectorIndex = 0;

  // Recursive function to generate connectors for each node and its children
  const generateConnectors = (node: TreeNode) => {
    if (node.children.length === 0) return;

    const parentBottomX = node.position.x + nodeWidth / 2;
    const parentBottomY = node.position.y + nodeHeight;

    // If only one child, draw a simple vertical line
    if (node.children.length === 1) {
      const child = node.children[0];
      const childTopX = child.position.x + nodeWidth / 2;
      const childTopY = child.position.y;

      const path = generateConnectorPath(
        parentBottomX,
        parentBottomY,
        childTopX,
        childTopY,
        curveSmoothness
      );

      connectors.push(
        <path
          key={`connector-${connectorIndex++}`}
          d={path}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      );
    } else {
      // Multiple children: create a branching structure
      const firstChild = node.children[0];
      const lastChild = node.children[node.children.length - 1];
      
      const firstChildX = firstChild.position.x + nodeWidth / 2;
      const lastChildX = lastChild.position.x + nodeWidth / 2;
      const branchY = parentBottomY + (nodeHeight * 0.5);

      // Vertical line down from parent
      const verticalDrop = `M ${parentBottomX} ${parentBottomY} L ${parentBottomX} ${branchY}`;
      
      // Horizontal branch line
      const horizontalBranch = `L ${firstChildX} ${branchY} L ${lastChildX} ${branchY}`;
      
      // Combined path for the main branch
      connectors.push(
        <path
          key={`connector-${connectorIndex++}`}
          d={`${verticalDrop} ${horizontalBranch}`}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300"
        />
      );

      // Individual drop lines to each child
      node.children.forEach((child) => {
        const childTopX = child.position.x + nodeWidth / 2;
        const childTopY = child.position.y;

        const dropPath = generateConnectorPath(
          childTopX,
          branchY,
          childTopX,
          childTopY,
          curveSmoothness
        );

        connectors.push(
          <path
            key={`connector-${connectorIndex++}`}
            d={dropPath}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        );
      });
    }

    // Recursively process children
    node.children.forEach(generateConnectors);
  };

  roots.forEach(generateConnectors);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    >
      <defs>
        <linearGradient id="connectorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={strokeColor} stopOpacity={1} />
          <stop offset="100%" stopColor={strokeColor} stopOpacity={0.6} />
        </linearGradient>
      </defs>
      {connectors}
    </svg>
  );
};

/**
 * Alternative connector style with rounded corners
 */
export const SVGRoundedConnectors: React.FC<SVGConnectorsProps> = ({
  roots,
  nodeWidth,
  nodeHeight,
  strokeWidth = 2.5,
  strokeColor = 'url(#connectorGradient)',
}) => {
  const connectors: JSX.Element[] = [];
  let connectorIndex = 0;
  const cornerRadius = 12;

  const generateRoundedConnectors = (node: TreeNode) => {
    if (node.children.length === 0) return;

    const parentBottomX = node.position.x + nodeWidth / 2;
    const parentBottomY = node.position.y + nodeHeight;

    if (node.children.length === 1) {
      const child = node.children[0];
      const childTopX = child.position.x + nodeWidth / 2;
      const childTopY = child.position.y;

      // Simple S-curve for single child
      const midY = (parentBottomY + childTopY) / 2;
      const path = `
        M ${parentBottomX} ${parentBottomY}
        L ${parentBottomX} ${midY - cornerRadius}
        C ${parentBottomX} ${midY},
          ${childTopX} ${midY},
          ${childTopX} ${midY + cornerRadius}
        L ${childTopX} ${childTopY}
      `.trim().replace(/\s+/g, ' ');

      connectors.push(
        <path
          key={`connector-${connectorIndex++}`}
          d={path}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="sotk-connector transition-all duration-300"
        />
      );
    } else {
      // Multiple children with rounded branches
      const firstChild = node.children[0];
      const lastChild = node.children[node.children.length - 1];
      
      const firstChildX = firstChild.position.x + nodeWidth / 2;
      const lastChildX = lastChild.position.x + nodeWidth / 2;
      const branchY = parentBottomY + nodeHeight * 0.5;

      // Vertical drop with rounded corner
      const verticalDrop = `
        M ${parentBottomX} ${parentBottomY}
        L ${parentBottomX} ${branchY - cornerRadius}
        Q ${parentBottomX} ${branchY} ${parentBottomX + cornerRadius} ${branchY}
      `.trim().replace(/\s+/g, ' ');

      // Horizontal branch
      const horizontalBranch = `L ${lastChildX - cornerRadius} ${branchY}
        Q ${lastChildX} ${branchY} ${lastChildX} ${branchY - cornerRadius}
      `.trim().replace(/\s+/g, ' ');

      connectors.push(
        <path
          key={`connector-${connectorIndex++}`}
          d={`${verticalDrop} ${horizontalBranch}`}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="sotk-connector transition-all duration-300"
        />
      );

      // Drop lines to each child
      node.children.forEach((child, index) => {
        const childTopX = child.position.x + nodeWidth / 2;
        const childTopY = child.position.y;

        let dropPath: string;
        
        if (index === 0) {
          // First child - drop from start of horizontal
          dropPath = `
            M ${firstChildX} ${branchY}
            L ${firstChildX} ${childTopY}
          `.trim().replace(/\s+/g, ' ');
        } else if (index === node.children.length - 1) {
          // Last child - drop from end of horizontal
          dropPath = `
            M ${lastChildX} ${branchY}
            L ${lastChildX} ${childTopY}
          `.trim().replace(/\s+/g, ' ');
        } else {
          // Middle children - drop from middle
          dropPath = `
            M ${childTopX} ${branchY}
            L ${childTopX} ${childTopY}
          `.trim().replace(/\s+/g, ' ');
        }

        connectors.push(
          <path
            key={`connector-${connectorIndex++}`}
            d={dropPath}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="sotk-connector transition-all duration-300"
          />
        );
      });
    }

    node.children.forEach(generateRoundedConnectors);
  };

  roots.forEach(generateRoundedConnectors);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    >
      <defs>
        <linearGradient id="connectorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#14B8A6" stopOpacity={0.8} />
          <stop offset="100%" stopColor="#0F766E" stopOpacity={0.8} />
        </linearGradient>
      </defs>
      {connectors}
    </svg>
  );
};