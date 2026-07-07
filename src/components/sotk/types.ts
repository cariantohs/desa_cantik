// Types for SOTK organizational chart
export interface SOTKNode {
  id: number;
  namaJabatan: string;
  pejabatNama: string;
  fotoUrl: string | null;
  parentId: number | null;
  urutan: number;
  deskripsi?: string | null;
  status?: 'active' | 'inactive';
  children?: SOTKNode[];
}

export interface TreeNode extends SOTKNode {
  children: TreeNode[];
  depth: number;
  position: {
    x: number;
    y: number;
  };
}

export type HierarchyLevel = 'level1' | 'level2' | 'level3' | 'level4';