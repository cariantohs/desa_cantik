import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { SOTKNode, TreeNode } from './types';
import { buildTree, calculatePositions, getTotalWidth, getTotalHeight } from './utils/treeBuilder';
import { SVGRoundedConnectors } from './SVGConnectors';
import { OrgChartCard } from './OrgChartCard';
import { ZoomIn, ZoomOut, Maximize, Minimize } from 'lucide-react';

interface OrganizationalChartProps {
  nodes: SOTKNode[];
}

/**
 * Main organizational chart component
 * Renders a professional hierarchical structure with SVG connectors
 */
export const OrganizationalChart: React.FC<OrganizationalChartProps> = ({ nodes }) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Configuration for the chart layout
  const config = useMemo(() => ({
    nodeWidth: 160,
    nodeHeight: 200,
    horizontalSpacing: 40,
    verticalSpacing: 80,
    minZoom: 0.3,
    maxZoom: 2,
    zoomStep: 0.1,
  }), []);

  // Build tree structure from flat data
  const treeData = useMemo(() => {
    if (!nodes || nodes.length === 0) return [];
    
    const roots = buildTree(nodes);
    const positionedRoots = calculatePositions(roots, config);
    
    return positionedRoots;
  }, [nodes, config]);

  // Calculate total dimensions
  const dimensions = useMemo(() => {
    if (treeData.length === 0) {
      return { width: 0, height: 0 };
    }

    const totalWidth = getTotalWidth(treeData);
    const totalHeight = getTotalHeight(treeData, config.nodeHeight, config.verticalSpacing);
    
    // Add padding
    const padding = 100;
    return {
      width: totalWidth + padding * 2,
      height: totalHeight + padding * 2,
    };
  }, [treeData, config]);

  // Center the chart initially
  useEffect(() => {
    if (containerRef.current && dimensions.width > 0) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      const initialPanX = (containerWidth - dimensions.width) / 2;
      const initialPanY = 40; // Small offset from top
      
      setPan({ x: initialPanX, y: initialPanY });
    }
  }, [dimensions]);

  // Zoom controls
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + config.zoomStep, config.maxZoom));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - config.zoomStep, config.minZoom));
  };

  const handleReset = () => {
    setZoom(1);
    if (containerRef.current && dimensions.width > 0) {
      const containerWidth = containerRef.current.clientWidth;
      const initialPanX = (containerWidth - dimensions.width) / 2;
      setPan({ x: initialPanX, y: 40 });
    }
  };

  const handleFitToScreen = () => {
    if (containerRef.current && dimensions.width > 0) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      const scaleX = (containerWidth - 100) / dimensions.width;
      const scaleY = (containerHeight - 100) / dimensions.height;
      const newZoom = Math.min(scaleX, scaleY, 1);
      
      setZoom(newZoom);
      setPan({
        x: (containerWidth - dimensions.width * newZoom) / 2,
        y: 40,
      });
    }
  };

  // Pan controls
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left click only
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -config.zoomStep : config.zoomStep;
    setZoom((prev) => Math.max(config.minZoom, Math.min(config.maxZoom, prev + delta)));
  };

  // Render a single node and its children recursively
  const renderNode = (node: TreeNode): React.ReactNode => {
    const cardSize = getNodeSize(node);
    
    return (
      <React.Fragment key={node.id}>
        <OrgChartCard
          node={node}
          size={cardSize}
          isHovered={hoveredNode === node.id}
          onHover={(isHovered) => setHoveredNode(isHovered ? node.id : null)}
        />
        {node.children.map((child) => renderNode(child))}
      </React.Fragment>
    );
  };

  // Determine card size based on level/jabatan
  const getNodeSize = (node: TreeNode): 'level1' | 'level2' | 'level3' | 'level4' => {
    const jabatanLower = node.namaJabatan.toLowerCase();
    
    if (
      jabatanLower.includes('kepala desa') || 
      jabatanLower.includes('bpd') || 
      jabatanLower.includes('kades') || 
      jabatanLower.includes('lurah') || 
      jabatanLower.includes('petinggi')
    ) {
      return 'level1';
    }
    if (
      jabatanLower.includes('sekretaris') || 
      jabatanLower.includes('sekdes') || 
      jabatanLower.includes('seklur')
    ) {
      return 'level2';
    }
    if (
      jabatanLower.includes('kaur') || 
      jabatanLower.includes('urusan') || 
      jabatanLower.includes('kasi') || 
      jabatanLower.includes('seksi')
    ) {
      return 'level3';
    }
    if (
      jabatanLower.includes('kadus') || 
      jabatanLower.includes('dusun') || 
      jabatanLower.includes('kepala dusun') || 
      jabatanLower.includes('lingkungan')
    ) {
      return 'level4';
    }
    
    return 'level3';
  };

  // Flatten all nodes for rendering
  const flattenNodes = (roots: TreeNode[]): TreeNode[] => {
    const result: TreeNode[] = [];
    const traverse = (node: TreeNode) => {
      result.push(node);
      node.children.forEach(traverse);
    };
    roots.forEach(traverse);
    return result;
  };

  const allNodes = flattenNodes(treeData);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-gray-50"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div
        className="absolute origin-top-left"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
        }}
      >
        {/* SVG Connectors */}
        <SVGRoundedConnectors
          roots={treeData}
          nodeWidth={config.nodeWidth}
          nodeHeight={config.nodeHeight}
          strokeWidth={2}
          strokeColor="#94A3B8"
        />

        {/* Node Cards */}
        {allNodes.map((node) => (
          <OrgChartCard
            key={node.id}
            node={node}
            size={getNodeSize(node)}
            isHovered={hoveredNode === node.id}
            onHover={(isHovered) => setHoveredNode(isHovered ? node.id : null)}
          />
        ))}
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={handleReset}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          title="Reset View"
        >
          <Maximize className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={handleFitToScreen}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          title="Fit to Screen"
        >
          <Minimize className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Zoom Indicator */}
      <div className="absolute bottom-4 left-4 px-3 py-1 bg-white rounded-lg shadow-md text-sm text-gray-600">
        {Math.round(zoom * 100)}%
      </div>
    </div>
  );
};
