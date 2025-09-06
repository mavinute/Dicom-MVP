"use client";

import { useEffect, useRef, useState } from "react";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneTools from "cornerstone-tools";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import { initCornerstone } from "@/utils/cornerstoneConfig";

export default function DicomViewer({ files }: { files: File[] }) {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [imageIds, setImageIds] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    initCornerstone();

    const element = elementRef.current!;
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
  }, []);

  useEffect(() => {
    if (!files.length) return;
    const ids: string[] = [];
    for (const f of files) {
      const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(f);
      ids.push(imageId);
    }
    setImageIds(ids);
    setCurrent(0);
  }, [files]);

  useEffect(() => {
    if (!imageIds.length) return;
    const element = elementRef.current!;
    cornerstone.loadImage(imageIds[current]).then((image: any) => {
      cornerstone.displayImage(element, image);
    });
  }, [imageIds, current]);

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
