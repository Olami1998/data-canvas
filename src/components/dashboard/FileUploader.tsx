import { useState, useCallback } from "react";
import { Upload, FileSpreadsheet, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  onUpload: (file: File) => Promise<void>;
  isLoading?: boolean;
}

export function FileUploader({ onUpload, isLoading }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && isValidFile(droppedFile)) {
      setFile(droppedFile);
      setUploadStatus("idle");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && isValidFile(selectedFile)) {
      setFile(selectedFile);
      setUploadStatus("idle");
    }
  };

  const isValidFile = (file: File) => {
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    return validTypes.includes(file.type) || file.name.endsWith(".csv") || file.name.endsWith(".xlsx");
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      await onUpload(file);
      setUploadStatus("success");
    } catch (error) {
      setUploadStatus("error");
    }
  };

  const clearFile = () => {
    setFile(null);
    setUploadStatus("idle");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all duration-300",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border bg-card hover:border-muted-foreground/50 hover:bg-secondary/30",
          file && "border-solid"
        )}
      >
        {!file ? (
          <>
            <div className="mb-4 rounded-full bg-secondary p-4">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="mb-2 text-lg font-medium text-foreground">
              Drop your file here, or{" "}
              <label className="cursor-pointer text-primary hover:underline">
                browse
                <input
                  type="file"
                  className="hidden"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleChange}
                />
              </label>
            </p>
            <p className="text-sm text-muted-foreground">
              Supports CSV, XLS, and XLSX files up to 10MB
            </p>
          </>
        ) : (
          <div className="flex w-full items-center gap-4">
            <div className="rounded-lg bg-secondary p-3">
              <FileSpreadsheet className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{file.name}</p>
              <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
            {uploadStatus === "success" && (
              <CheckCircle className="h-6 w-6 text-success" />
            )}
            {uploadStatus === "error" && (
              <AlertCircle className="h-6 w-6 text-destructive" />
            )}
            <Button variant="ghost" size="icon" onClick={clearFile}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {file && uploadStatus !== "success" && (
        <Button
          onClick={handleUpload}
          disabled={isLoading}
          className="w-full"
          variant="gradient"
          size="lg"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-5 w-5" />
              Upload File
            </>
          )}
        </Button>
      )}
    </div>
  );
}
