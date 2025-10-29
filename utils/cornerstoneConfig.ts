"use client";

let cornerstone: any;
let cornerstoneTools: any;
let cornerstoneWADOImageLoader: any;

export async function initCornerstone() {
  if (typeof window === "undefined") return; // evita execução no servidor

  // Evita reimportar se já estiver inicializado
  if (!cornerstone || !cornerstoneTools || !cornerstoneWADOImageLoader) {
    cornerstone = await import("cornerstone-core");
    cornerstoneTools = await import("cornerstone-tools");
    cornerstoneWADOImageLoader = await import("cornerstone-wado-image-loader");
  }

  // Vincula as dependências entre os módulos
  cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  cornerstoneTools.external.cornerstone = cornerstone;

  // Inicializa WebWorkers de forma segura
  if (cornerstoneWADOImageLoader.webWorkerManager) {
    cornerstoneWADOImageLoader.webWorkerManager.initialize({
      maxWebWorkers: navigator.hardwareConcurrency || 4,
      startWebWorkersOnDemand: true,
    });
  }

  // Inicializa o módulo de ferramentas
  cornerstoneTools.init({
    showSVGCursors: true,
  });

  // Retorna instâncias (opcional)
  return { cornerstone, cornerstoneTools, cornerstoneWADOImageLoader };
}
