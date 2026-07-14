import React from 'react';
import type { SOTKNode } from './types';
import { User } from 'lucide-react';
import DriveImage from "@/components/DriveImage";

interface OrgChartCardProps {
  node: SOTKNode;
  size?: 'level1' | 'level2' | 'level3' | 'level4';
  isHovered?: boolean;
  onHover?: (isHovered: boolean) => void;
}

/**
 * Professional organizational chart card component
 * Displays photo, position title, and name with hierarchical sizing
 */
export const OrgChartCard: React.FC<OrgChartCardProps> = ({
  node,
  size = 'level3',
  isHovered = false,
  onHover,
}) => {
  const sizeConfig = {
    level1: {
      width: 192,
      height: 240,
      photoHeight: 'h-36',
      fontSize: 'text-sm font-bold tracking-wide uppercase',
      nameSize: 'text-lg font-bold',
      shadow: 'shadow-lg hover:shadow-2xl',
      border: 'border-2 border-teal-700',
    },
    level2: {
      width: 176,
      height: 220,
      photoHeight: 'h-32',
      fontSize: 'text-xs font-semibold tracking-wide uppercase',
      nameSize: 'text-base font-semibold',
      shadow: 'shadow-md hover:shadow-xl',
      border: 'border-2 border-teal-600',
    },
    level3: {
      width: 160,
      height: 200,
      photoHeight: 'h-28',
      fontSize: 'text-xs font-semibold tracking-wide uppercase',
      nameSize: 'text-sm font-medium',
      shadow: 'shadow-sm hover:shadow-lg',
      border: 'border border-teal-500/30',
    },
    level4: {
      width: 144,
      height: 170,
      photoHeight: 'h-24',
      fontSize: 'text-[10px] font-medium tracking-wide uppercase',
      nameSize: 'text-xs font-medium',
      shadow: 'shadow-sm hover:shadow-md',
      border: 'border border-gray-200',
    },
  };

  // Determine card level based on jabatan
  const getCardSize = (): 'level1' | 'level2' | 'level3' | 'level4' => {
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
    
    return size;
  };

  const actualSize = getCardSize();
  const actualConfig = sizeConfig[actualSize];

  const handleMouseEnter = () => onHover?.(true);
  const handleMouseLeave = () => onHover?.(false);

  // Precision center offset calculation
  const standardNodeWidth = 160;
  const horizontalOffset = (standardNodeWidth - actualConfig.width) / 2;

  return (
    <div
      className={`
        bg-white rounded-xl ${actualConfig.border}
        ${actualConfig.shadow}
        transition-all duration-300 ease-out
        ${isHovered ? 'scale-105 -translate-y-1' : ''}
        overflow-hidden
        cursor-pointer
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'absolute',
        left: `${(node.position?.x ?? 0) + horizontalOffset}px`,
        top: `${node.position?.y ?? 0}px`,
        width: `${actualConfig.width}px`,
        height: `${actualConfig.height}px`,
        zIndex: isHovered ? 10 : 2,
      }}
    >
      {/* Photo Section */}
      <div className={`relative ${actualConfig.photoHeight} bg-slate-50 overflow-hidden border-b border-gray-100`}>
        {node.fotoUrl ? (
          <DriveImage
            src={node.fotoUrl}
            alt={node.pejabatNama}
            className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const placeholder = target.nextElementSibling as HTMLElement;
              if (placeholder) placeholder.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Placeholder for no photo or image load failure */}
        <div 
          className={`
            absolute inset-0 flex items-center justify-center
            bg-gradient-to-br from-teal-50 to-teal-100/50
            ${node.fotoUrl ? 'hidden' : 'flex'}
          `}
        >
          <User className="w-10 h-10 text-teal-600/60" />
        </div>

        {/* Status indicator */}
        <div className={`
          absolute top-2 right-2 w-2.5 h-2.5 rounded-full
          ${node.status !== 'inactive' ? 'bg-emerald-500 ring-4 ring-emerald-500/20' : 'bg-gray-400'}
        `} />
      </div>

      {/* Info Section */}
      <div className="p-3 flex flex-col items-center justify-center text-center h-[calc(100%-96px)]">
        {/* Position Title */}
        <h3 className={`
          text-teal-700 mb-1 line-clamp-2
          ${actualConfig.fontSize}
        `}>
          {node.namaJabatan}
        </h3>

        {/* Name */}
        <p className={`
          text-slate-900 leading-tight line-clamp-1
          ${actualConfig.nameSize}
        `}>
          {node.pejabatNama}
        </p>

        {/* Decorative line */}
        <div className="w-6 h-[2px] bg-teal-500/40 mt-2 rounded-full" />
      </div>
    </div>
  );
};

/**
 * Simplified card for mobile view
 */
export const MobileOrgChartCard: React.FC<{ node: SOTKNode }> = ({ node }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
      {/* Photo */}
      <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border border-teal-100 bg-slate-50">
        {node.fotoUrl ? (
          <DriveImage
            src={node.fotoUrl}
            alt={node.pejabatNama}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-teal-50 to-teal-100/40 flex items-center justify-center">
            <User className="w-6 h-6 text-teal-600/60" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-teal-700 text-xs uppercase tracking-wide">
          {node.namaJabatan}
        </h3>
        <p className="text-slate-800 text-sm font-semibold truncate">
          {node.pejabatNama}
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <div className={`
            w-2 h-2 rounded-full
            ${node.status !== 'inactive' ? 'bg-emerald-500' : 'bg-gray-400'}
          `} />
          <span className="text-[10px] text-slate-500 font-medium">
            {node.status !== 'inactive' ? 'Aktif' : 'Tidak Aktif'}
          </span>
        </div>
      </div>
    </div>
  );
};