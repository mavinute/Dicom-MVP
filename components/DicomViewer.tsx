"use client";

import { useEffect, useRef, useState } from "react";
import { initCornerstone } from "@/utils/cornerstoneConfig";

// Tipos genéricos para evitar conflito quando o cornerstone for importado dinamicamente
let cornerstone: any = null;
let cornerstoneTools: any = null;
let cornerstoneWADOImageLoader: any = null;

export default function DicomViewer({ files }: { files: File[] }) {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [imageIds, setImageIds] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Importação dinâmica no lado do cliente
  useEffect(() => {
    const loadCornerstoneModules = async () => {
      if (typeof window === "undefined") return;

      const cs = await import("cornerstone-core");
      const cst = await import("cornerstone-tools");
      const csw = await import("cornerstone-wado-image-loader");

      cornerstone = cs;
      cornerstoneTools = cst;
      cornerstoneWADOImageLoader = csw;

      initCornerstone(); // inicializa configuração (ex: web workers, codecs, etc.)

      setIsReady(true);
    };

    loadCornerstoneModules();
  }, []);

  // Inicializa a área de exibição quando os módulos estiverem prontos
  useEffect(() => {
    if (!isReady || !elementRef.current) return;

    const element = elementRef.current;
    cornerstone.enable(element);

    cornerstoneTools.addTool(cornerstoneTools.WwwcTool);
    cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
    cornerstoneTools.addTool(cornerstoneTools.PanTool);

    cornerstoneTools.setToolActive("Wwwc", { mouseButtonMask: 1 });
    cornerstoneTools.setToolActive("Zoom", { mouseButtonMask: 2 });
    cornerstoneTools.setToolActive("Pan", { mouseButtonMask: 4 });

    return () => {
      try {
        cornerstone.disable(element);
      } catch {}
    };
  }, [isReady]);

  // Cria os IDs de imagem DICOM a partir dos arquivos enviados
  useEffect(() => {
    if (!isReady || !files.length) return;
    const ids: string[] = [];

    for (const f of files) {
      const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(f);
      ids.push(imageId);
    }

    setImageIds(ids);
    setCurrent(0);
  }, [files, isReady]);

  // Renderiza a imagem selecionada
  useEffect(() => {
    if (!isReady || !imageIds.length) return;

    const element = elementRef.current!;
    cornerstone.loadImage(imageIds[current]).then((image: any) => {
      cornerstone.displayImage(element, image);
    });
  }, [imageIds, current, isReady]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        ref={elementRef}
        style={{ width: 512, height: 512, background: "#000" }}
      />
      {imageIds.length > 1 && (
        <input
          type="range"
          min={0}
          max={imageIds.length - 1}
          value={current}
          onChange={(e) => setCurrent(parseInt(e.target.value))}
        />
      )}
    </div>
  );
}
