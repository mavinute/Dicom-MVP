declare module "cornerstone-core";
declare module "cornerstone-tools";
declare module "cornerstone-wado-image-loader";
declare module "dicom-parser";

declare module "three/examples/jsm/loaders/OBJLoader" {
  import { Loader, LoadingManager, Group } from "three";

  export class OBJLoader extends Loader {
    constructor(manager?: LoadingManager);
    parse(data: string): Group;
    load(
      url: string,
      onLoad: (group: Group) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
  }
}
