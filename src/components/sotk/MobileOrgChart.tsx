import React from 'react';
import type { SOTKNode, TreeNode } from './types';
import { buildTree } from './utils/treeBuilder';
import { MobileOrgChartCard } from './OrgChartCard';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface MobileOrgChartProps {
  nodes: SOTKNode[];
}

/**
 * Mobile-optimized vertical tree view
 * Collapsible sections for better mobile experience
 */
export const MobileOrgChart: React.FC<MobileOrgChartProps> = ({ nodes }) => {
  const [expandedNodes, setExpandedNodes] = React.useState<Set<number>>(new Set());

  const treeData = React.useMemo(() => {
    if (!nodes || nodes.length === 0) return [];
    return buildTree(nodes);
  }, [nodes]);

  // Pre-expand levels on load for premium initial user experience
  React.useEffect(() => {
    if (treeData && treeData.length > 0) {
      const idsToExpand = new Set<number>();
      
      const traverse = (node: TreeNode, depth: number) => {
        // Expand root (Kepala Desa/BPD) and its immediate children (Sekretaris)
        if (depth < 2 && node.children.length > 0) {
          idsToExpand.add(node.id);
          node.children.forEach(child => traverse(child, depth + 1));
        }
      };
      
      treeData.forEach(root => traverse(root, 0));
      setExpandedNodes(idsToExpand);
    }
  }, [treeData]);

  const toggleNode = (nodeId: number) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const renderNode = (node: TreeNode, level: number = 0): React.ReactNode => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children.length > 0;

    return (
      <div key={node.id} className="relative">
        {/* Connector line for non-root nodes */}
        {level > 0 && (
          <div 
            className="absolute left-6 -top-4 w-0.5 h-4 bg-teal-200"
            style={{ left: '24px' }}
          />
        )}

        {/* Node Card */}
        <div className="flex items-center gap-3 py-2">
          {/* Expand/Collapse button */}
          {hasChildren && (
            <button
              onClick={() => toggleNode(node.id)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-teal-50 hover:bg-teal-100 transition-colors flex-shrink-0 text-teal-600 focus:outline-none"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}

          <div className="flex-grow">
            <MobileOrgChartCard node={node} />
          </div>
        </div>

        {/* Children */}
        {isExpanded && hasChildren && (
          <div className="ml-8 border-l-2 border-teal-100 pl-4">
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (!nodes || nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Belum ada data struktur organisasi</p>
          <p className="text-gray-400 text-sm mt-2">
            Silakan tambahkan data SOTK terlebih dahulu
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Struktur Organisasi
        </h2>
        <p className="text-sm text-gray-500">
          Ketuk tombol panah untuk melihat detail
        </p>
      </div>

      <div className="space-y-2">
        {treeData.map((root) => renderNode(root))}
      </div>
    </div>
  );
};