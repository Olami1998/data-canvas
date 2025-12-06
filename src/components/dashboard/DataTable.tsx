import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileSpreadsheet, Download, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface DataFile {
  id: string;
  name: string;
  size: number;
  rows: number;
  uploaded_at: string;
}

interface DataTableProps {
  files: DataFile[];
  onView: (file: DataFile) => void;
  onDownload: (file: DataFile) => void;
  onDelete: (file: DataFile) => void;
  isLoading?: boolean;
}

export function DataTable({ files, onView, onDownload, onDelete, isLoading }: DataTableProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50">
        <FileSpreadsheet className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <p className="text-lg font-medium text-muted-foreground">No files uploaded yet</p>
        <p className="text-sm text-muted-foreground/70">Upload a CSV or Excel file to get started</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground">File Name</TableHead>
            <TableHead className="text-muted-foreground">Size</TableHead>
            <TableHead className="text-muted-foreground">Rows</TableHead>
            <TableHead className="text-muted-foreground">Uploaded</TableHead>
            <TableHead className="text-right text-muted-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id} className="border-border hover:bg-secondary/30">
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-secondary p-2">
                    <FileSpreadsheet className="h-4 w-4 text-primary" />
                  </div>
                  {file.name}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{formatFileSize(file.size)}</TableCell>
              <TableCell className="text-muted-foreground">{file.rows.toLocaleString()}</TableCell>
              <TableCell className="text-muted-foreground">
                {formatDistanceToNow(new Date(file.uploaded_at), { addSuffix: true })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onView(file)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDownload(file)}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(file)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
