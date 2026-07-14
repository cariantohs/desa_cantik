import React, { useMemo, useRef, useEffect, useState } from "react";
import { User } from "lucide-react";
import DriveImage from "@/components/DriveImage";

export interface UnifiedSOTKNode {
  id: number | string;
  namaJabatan: string;
  pejabatNama: string;
  fotoUrl: string | null;
  parentId: number | null;
  urutan: number;
}

interface SotkUnifiedChartProps {
  jabatanList: any[];
  dusunList?: any[];
}

const BASE_CHART_WIDTH = 960;
const GAP_BETWEEN_GROUPS = 80;
const GAP_X = 14;
const LINE_COLOR = "#0F766E";
const LINE_WIDTH = 2.5;

function rowWidth(count: number, cardW: number) {
  if (count === 0) return 0;
  return count * cardW + (count - 1) * GAP_X;
}

function calcCardWidth(count: number, maxW: number, baseW: number) {
  if (count === 0) return baseW;
  const available = maxW - (count - 1) * GAP_X;
  return Math.min(baseW, Math.max(168, Math.floor(available / count)));
}

function estimateTextWidth(text: string, charPx = 5.5) {
  return Math.ceil(text.length * charPx);
}

export const SotkUnifiedChart: React.FC<SotkUnifiedChartProps> = ({
  jabatanList,
  dusunList = [],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const { kepala, sekretaris, kasis, kaurs, kaduses } = useMemo(() => {
    const k = jabatanList.find(
      (j: any) =>
        j.parentId === null ||
        j.namaJabatan.toLowerCase().includes("kepala desa") ||
        j.namaJabatan.toLowerCase().includes("kades") ||
        j.namaJabatan.toLowerCase().includes("lurah")
    );

    const s = jabatanList.find(
      (j: any) =>
        j.namaJabatan.toLowerCase().includes("sekretaris") ||
        j.namaJabatan.toLowerCase().includes("sekdes") ||
        j.namaJabatan.toLowerCase().includes("seklur")
    );

    const ks = jabatanList
      .filter(
        (j: any) =>
          j.id !== k?.id &&
          j.id !== s?.id &&
          (j.namaJabatan.toLowerCase().includes("kasi") ||
            j.namaJabatan.toLowerCase().includes("seksi"))
      )
      .sort((a, b) => a.urutan - b.urutan);

    const kr = jabatanList
      .filter(
        (j: any) =>
          j.id !== k?.id &&
          j.id !== s?.id &&
          (j.namaJabatan.toLowerCase().includes("kaur") ||
            j.namaJabatan.toLowerCase().includes("urusan"))
      )
      .sort((a, b) => a.urutan - b.urutan);

    const SOTKKadus = jabatanList.filter(
      (j: any) =>
        j.id !== k?.id &&
        j.id !== s?.id &&
        !ks.some((x) => x.id === j.id) &&
        !kr.some((x) => x.id === j.id) &&
        (j.namaJabatan.toLowerCase().includes("kadus") ||
          j.namaJabatan.toLowerCase().includes("dusun") ||
          j.namaJabatan.toLowerCase().includes("kepala dusun") ||
          j.namaJabatan.toLowerCase().includes("lingkungan"))
    );

    const mappedKadusList = [...SOTKKadus];
    dusunList.forEach((d: any) => {
      const alreadyExists = SOTKKadus.some(
        (sk: any) =>
          sk.pejabatNama.toLowerCase().includes(d.kepala.toLowerCase()) ||
          sk.namaJabatan.toLowerCase().includes(d.namaDusun.toLowerCase())
      );
      if (!alreadyExists) {
        mappedKadusList.push({
          id: `dusun-${d.id}`,
          namaJabatan: `Kepala ${d.namaDusun}`,
          pejabatNama: d.kepala,
          fotoUrl: d.fotoKepala || null,
          parentId: k?.id || null,
          urutan: d.urutan ?? 0,
        });
      }
    });

    mappedKadusList.sort((a, b) => a.urutan - b.urutan);

    return {
      kepala: k || null,
      sekretaris: s || null,
      kasis: ks,
      kaurs: kr,
      kaduses: mappedKadusList,
    };
  }, [jabatanList, dusunList]);

  const layout = useMemo(() => {
    const allMiddle = [...kasis, ...kaurs];
    const allBottom = kaduses;
    const allNodes = [kepala, sekretaris, ...allMiddle, ...allBottom].filter(
      Boolean
    ) as any[];

    const longestTitle = allNodes.reduce(
      (max, n) => Math.max(max, (n.namaJabatan || "").length),
      0
    );
    const textMinW = Math.ceil(longestTitle * 5.5) + 72;

    const middleAvailable =
      BASE_CHART_WIDTH -
      GAP_BETWEEN_GROUPS -
      Math.max(0, kasis.length - 1) * GAP_X -
      Math.max(0, kaurs.length - 1) * GAP_X;
    const totalMiddleSlots = kasis.length + kaurs.length;
    const kasiKaurW =
      totalMiddleSlots > 0
        ? Math.max(
            calcCardWidth(totalMiddleSlots, middleAvailable, 280),
            textMinW
          )
        : 280;
    const kadusW = Math.max(
      calcCardWidth(kaduses.length, BASE_CHART_WIDTH, 240),
      textMinW - 10
    );

    const cardConfig = {
      kades: { w: Math.max(300, textMinW + 20), h: 100 },
      sekdes: { w: Math.max(270, textMinW), h: 92 },
      kasiKaur: { w: kasiKaurW, h: 92 },
      kadus: { w: kadusW, h: 88 },
    };

    const twKasi = rowWidth(kasis.length, kasiKaurW);
    const twKaur = rowWidth(kaurs.length, kasiKaurW);
    const twKadus = rowWidth(kaduses.length, kadusW);

    const kasiLeftEdge = -GAP_BETWEEN_GROUPS / 2 - twKasi;
    const kaurLeftEdge = GAP_BETWEEN_GROUPS / 2;
    const xKasiCenter = kasiLeftEdge + twKasi / 2;
    const xKaurCenter = kaurLeftEdge + twKaur / 2;

    const yKades = 16;
    const ySekdes = yKades + cardConfig.kades.h + 36;
    const yMiddle = ySekdes + cardConfig.sekdes.h + 48;
    const ySplitMiddle = yMiddle - 22;
    const yKadus = yMiddle + cardConfig.kasiKaur.h + 48;
    const ySplitKadus = yKadus - 22;
    const yBranchSekdes = yKades + cardConfig.kades.h + 18;
    const yBranchKasi = ySekdes + cardConfig.sekdes.h + 18;

    const nodes: any[] = [];

    if (kepala) {
      nodes.push({
        ...kepala,
        x: -cardConfig.kades.w / 2,
        y: yKades,
        type: "kades",
        config: cardConfig.kades,
      });
    }

    if (sekretaris) {
      nodes.push({
        ...sekretaris,
        x: xKaurCenter - cardConfig.sekdes.w / 2,
        y: ySekdes,
        type: "sekdes",
        config: cardConfig.sekdes,
      });
    }

    kasis.forEach((node, idx) => {
      nodes.push({
        ...node,
        x: kasiLeftEdge + idx * (kasiKaurW + GAP_X),
        y: yMiddle,
        type: "kasi",
        config: cardConfig.kasiKaur,
      });
    });

    kaurs.forEach((node, idx) => {
      nodes.push({
        ...node,
        x: kaurLeftEdge + idx * (kasiKaurW + GAP_X),
        y: yMiddle,
        type: "kaur",
        config: cardConfig.kasiKaur,
      });
    });

    const kadusLeftEdge = -twKadus / 2;
    kaduses.forEach((node, idx) => {
      nodes.push({
        ...node,
        x: kadusLeftEdge + idx * (kadusW + GAP_X),
        y: yKadus,
        type: "kadus",
        config: cardConfig.kadus,
      });
    });

    const leftMargin = 32;
    const rightMargin = 32;
    const minX = Math.min(-cardConfig.kades.w / 2, kasiLeftEdge, -twKadus / 2);
    const maxX = Math.max(
      cardConfig.kades.w / 2,
      kaurLeftEdge + twKaur,
      twKadus / 2
    );
    const chartWidth = maxX - minX;
    const canvasWidth = chartWidth + leftMargin + rightMargin;
    const offset = -minX + leftMargin;
    const height = yKadus + cardConfig.kadus.h + 32;

    return {
      nodes,
      cardConfig,
      kasiLeftEdge,
      kaurLeftEdge,
      xKasiCenter,
      xKaurCenter,
      kadusLeftEdge,
      width: canvasWidth,
      height,
      offset,
      yKades,
      ySekdes,
      yMiddle,
      ySplitMiddle,
      yKadus,
      ySplitKadus,
      yBranchSekdes,
      yBranchKasi,
      kasiKaurW,
      kadusW,
    };
  }, [kepala, sekretaris, kasis, kaurs, kaduses]);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const containerW = containerRef.current.clientWidth;
      const targetW = containerW;
      setScale(Math.min(1, targetW / layout.width));
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [layout.width]);

  const renderCard = (node: any) => {
    const isKepala = node.type === "kades";
    const isSekretariat = node.type === "sekdes";
    const isKasiKaur = node.type === "kasi" || node.type === "kaur";

    let colorTheme =
      "border-teal-700/60 bg-white shadow-md hover:shadow-lg z-[2]";
    if (isKepala)
      colorTheme =
        "border-teal-700 bg-white shadow-lg hover:shadow-xl ring-2 ring-teal-700/10 z-[2]";
    else if (isSekretariat)
      colorTheme =
        "border-teal-600 bg-white shadow-md hover:shadow-lg ring-1 ring-teal-600/10 z-[2]";
    else if (isKasiKaur)
      colorTheme =
        "border-teal-500/40 bg-white hover:border-teal-600 hover:shadow-md z-[2]";

    const photoPx = isKepala ? 72 : isSekretariat ? 60 : 52;

    return (
      <div
        key={node.id}
        className={`absolute sotk-node rounded-xl border p-2.5 flex items-start overflow-hidden transition-all duration-300 ${colorTheme}`}
        style={{
          left: `${node.x + layout.offset}px`,
          top: `${node.y}px`,
          width: `${node.config.w}px`,
          minHeight: `${node.config.h}px`,
          boxSizing: "border-box",
        }}
      >
        <div
          className="relative rounded-full overflow-hidden flex-shrink-0 bg-slate-50 border border-slate-100 mt-0.5"
          style={{ width: `${photoPx}px`, height: `${photoPx}px` }}
        >
          {isKepala && (
            <div
              className="absolute -inset-1 rounded-full border-2 border-teal-600/20 pointer-events-none"
              aria-hidden
            />
          )}
          {node.fotoUrl ? (
            <DriveImage
              src={node.fotoUrl}
              alt={node.pejabatNama}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-teal-50">
              <User className="w-5 h-5 text-teal-700/30" />
            </div>
          )}
        </div>

        <div className="flex-grow min-w-0 pl-2.5 text-left">
          <p className="text-[9px] font-bold text-teal-700 uppercase tracking-wide leading-snug whitespace-normal break-words mb-1">
            {node.namaJabatan}
          </p>
          <h4 className="text-xs font-semibold text-slate-800 leading-snug whitespace-normal break-words">
            {node.pejabatNama}
          </h4>
          <div className="w-5 h-[2px] bg-teal-600/30 mt-1.5 rounded-full" />
        </div>
      </div>
    );
  };

  const cx = (x: number) => x + layout.offset;
  const { cardConfig } = layout;

  const lineProps = {
    stroke: LINE_COLOR,
    strokeWidth: LINE_WIDTH,
    strokeLinecap: "round" as const,
  };

  return (
    <div
      ref={containerRef}
      className="w-full flex justify-center overflow-hidden select-none py-2"
    >
      <div
        style={{
          width: `${layout.width * scale}px`,
          height: `${layout.height * scale}px`,
        }}
      >
        <div
          className="relative"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            width: `${layout.width}px`,
            height: `${layout.height}px`,
          }}
        >
          {layout.nodes.map(renderCard)}

          <svg
            className="absolute inset-0 pointer-events-none z-[5]"
            width={layout.width}
            height={layout.height}
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Main trunk from Kepala Desa */}
            <line
              x1={cx(0)}
              y1={layout.yKades + cardConfig.kades.h}
              x2={cx(0)}
              y2={layout.ySplitKadus}
              {...lineProps}
            />

            {/* Branch to Sekretaris */}
            {sekretaris && (
              <>
                <line
                  x1={cx(0)}
                  y1={layout.yBranchSekdes}
                  x2={cx(layout.xKaurCenter)}
                  y2={layout.yBranchSekdes}
                  {...lineProps}
                />
                <line
                  x1={cx(layout.xKaurCenter)}
                  y1={layout.yBranchSekdes}
                  x2={cx(layout.xKaurCenter)}
                  y2={layout.ySekdes}
                  {...lineProps}
                />
                <circle
                  cx={cx(0)}
                  cy={layout.yBranchSekdes}
                  r={3.5}
                  fill={LINE_COLOR}
                />
                <circle
                  cx={cx(layout.xKaurCenter)}
                  cy={layout.yBranchSekdes}
                  r={3.5}
                  fill={LINE_COLOR}
                />
              </>
            )}

            {/* Branch to KASI */}
            {kasis.length > 0 && (
              <>
                <line
                  x1={cx(0)}
                  y1={layout.yBranchKasi}
                  x2={cx(layout.xKasiCenter)}
                  y2={layout.yBranchKasi}
                  {...lineProps}
                />
                <line
                  x1={cx(layout.xKasiCenter)}
                  y1={layout.yBranchKasi}
                  x2={cx(layout.xKasiCenter)}
                  y2={layout.ySplitMiddle}
                  {...lineProps}
                />
                <line
                  x1={cx(layout.kasiLeftEdge + layout.kasiKaurW / 2)}
                  y1={layout.ySplitMiddle}
                  x2={cx(
                    layout.kasiLeftEdge +
                      (kasis.length - 1) * (layout.kasiKaurW + GAP_X) +
                      layout.kasiKaurW / 2
                  )}
                  y2={layout.ySplitMiddle}
                  {...lineProps}
                />
                {kasis.map((_, i) => {
                  const cardX =
                    layout.kasiLeftEdge +
                    i * (layout.kasiKaurW + GAP_X) +
                    layout.kasiKaurW / 2;
                  return (
                    <line
                      key={`kasi-drop-${i}`}
                      x1={cx(cardX)}
                      y1={layout.ySplitMiddle}
                      x2={cx(cardX)}
                      y2={layout.yMiddle}
                      {...lineProps}
                    />
                  );
                })}
                <circle
                  cx={cx(0)}
                  cy={layout.yBranchKasi}
                  r={3.5}
                  fill={LINE_COLOR}
                />
                <circle
                  cx={cx(layout.xKasiCenter)}
                  cy={layout.yBranchKasi}
                  r={3.5}
                  fill={LINE_COLOR}
                />
              </>
            )}

            {/* Branch to KAUR */}
            {sekretaris && kaurs.length > 0 && (
              <>
                <line
                  x1={cx(layout.xKaurCenter)}
                  y1={layout.ySekdes + cardConfig.sekdes.h}
                  x2={cx(layout.xKaurCenter)}
                  y2={layout.ySplitMiddle}
                  {...lineProps}
                />
                <line
                  x1={cx(layout.kaurLeftEdge + layout.kasiKaurW / 2)}
                  y1={layout.ySplitMiddle}
                  x2={cx(
                    layout.kaurLeftEdge +
                      (kaurs.length - 1) * (layout.kasiKaurW + GAP_X) +
                      layout.kasiKaurW / 2
                  )}
                  y2={layout.ySplitMiddle}
                  {...lineProps}
                />
                {kaurs.map((_, i) => {
                  const cardX =
                    layout.kaurLeftEdge +
                    i * (layout.kasiKaurW + GAP_X) +
                    layout.kasiKaurW / 2;
                  return (
                    <line
                      key={`kaur-drop-${i}`}
                      x1={cx(cardX)}
                      y1={layout.ySplitMiddle}
                      x2={cx(cardX)}
                      y2={layout.yMiddle}
                      {...lineProps}
                    />
                  );
                })}
              </>
            )}

            {/* Branch to Kepala Dusun */}
            {kaduses.length > 0 && (
              <>
                <line
                  x1={cx(layout.kadusLeftEdge + layout.kadusW / 2)}
                  y1={layout.ySplitKadus}
                  x2={cx(
                    layout.kadusLeftEdge +
                      (kaduses.length - 1) * (layout.kadusW + GAP_X) +
                      layout.kadusW / 2
                  )}
                  y2={layout.ySplitKadus}
                  {...lineProps}
                />
                {kaduses.map((_, i) => {
                  const cardX =
                    layout.kadusLeftEdge +
                    i * (layout.kadusW + GAP_X) +
                    layout.kadusW / 2;
                  return (
                    <line
                      key={`kadus-drop-${i}`}
                      x1={cx(cardX)}
                      y1={layout.ySplitKadus}
                      x2={cx(cardX)}
                      y2={layout.yKadus}
                      {...lineProps}
                    />
                  );
                })}
                <circle
                  cx={cx(0)}
                  cy={layout.ySplitKadus}
                  r={3.5}
                  fill={LINE_COLOR}
                />
              </>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};
