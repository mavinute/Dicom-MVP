import * as cornerstone from "cornerstone-core";
import * as cornerstoneTools from "cornerstone-tools";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";

export function initCornerstone() {
  cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  cornerstoneTools.external.cornerstone = cornerstone;

  cornerstoneWADOImageLoader.webWorkerManager.initialize({
    maxWebWorkers: navigator.hardwareConcurrency || 4,
    startWebWorkersOnDemand: true,
  });

  cornerstoneTools.init();
}
