type FileUploadProps = {
  onFilesSelected: (files: FileList) => void;
};

export default function FileUpload({ onFilesSelected }: FileUploadProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <input
        type="file"
        accept=".dcm,.obj,application/dicom"
        multiple={false}
        onChange={(e) => e.target.files && onFilesSelected(e.target.files)}
        className="border p-2 rounded"
      />
    </div>
  );
}
