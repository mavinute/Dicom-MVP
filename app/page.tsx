"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import DicomViewer from "../components/DicomViewer";
import ObjViewer from "../components/ObjViewer";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [fileType, setFileType] = useState<"dcm" | "obj" | null>(null);

  function handleFiles(fs: FileList) {
    const arr = Array.from(fs);
    setFiles(arr);

    const ext = arr[0].name.split(".").pop()?.toLowerCase();
    if (ext === "dcm") setFileType("dcm");
    else if (ext === "obj") setFileType("obj");
    else setFileType(null);
  }

  return (
    <main className="flex flex-col items-center p-6 gap-6">
      <h1 className="text-2xl font-bold">Viewer MVP (DICOM + OBJ)</h1>
      <FileUpload onFilesSelected={handleFiles} />

      {fileType === "dcm" && <DicomViewer files={files} />}
      {fileType === "obj" && <ObjViewer file={files[0]} />}
      {fileType === null && files.length > 0 && (
        <p className="text-red-500">Formato não suportado</p>
      )}
    </main>
  );
}
