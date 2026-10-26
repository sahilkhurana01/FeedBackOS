"use client";

import { useState } from "react";
import { UploadCloud, FileText, X, Sparkles, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function UploadModal({ isOpen, onClose, onSuccess }: UploadModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setSuccessMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setSuccessMessage(null);
    setProgress(30);

    try {
      const formData = new FormData();
      formData.append("file", file);

      setProgress(60);

      const response = await fetch("/api/feedback/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setProgress(100);

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to process feedback batch.");
      }

      setSuccessMessage(data.message || `Successfully analyzed ${data.count} customer feedback items.`);

      setTimeout(() => {
        setIsUploading(false);
        setFile(null);
        setProgress(0);
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err: unknown) {
      setIsUploading(false);
      setProgress(0);
      const msg = err instanceof Error ? err.message : "An unexpected upload error occurred.";
      setError(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-3xl bg-background p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/5 pb-4 dark:border-white/10">
          <div className="flex items-center gap-2">
            <UploadCloud className="size-5 text-primary" />
            <h3 className="text-xl font-semibold">Upload Feedback Batch</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={isUploading}>
            <X className="size-5" />
          </Button>
        </div>

        {/* Upload Zone */}
        <div className="space-y-4">
          <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-black/10 bg-muted/40 p-8 text-center cursor-pointer transition-colors hover:bg-muted/70 dark:border-white/15">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="sr-only"
              disabled={isUploading}
            />
            <div className="grid size-12 place-items-center rounded-2xl bg-background text-primary shadow-xs mb-3">
              <FileText className="size-6" />
            </div>
            <p className="text-[14px] font-medium text-foreground">
              {file ? file.name : "Click to select CSV file or drag & drop"}
            </p>
            <p className="text-[12px] text-muted-foreground mt-1">
              Supports Google Reviews CSV, Zomato export, Swiggy CSV, or raw review tables up to 50MB.
            </p>
          </label>

          {/* Download Demo CSV Buttons */}
          <div className="space-y-2 rounded-2xl bg-muted/60 p-3.5 text-[13px]">
            <span className="font-medium text-foreground block">Download sample CSV data to test:</span>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href="/demo-feedback.csv"
                download="demo-cafe-feedback.csv"
                className="inline-flex items-center gap-1 rounded-xl bg-background px-2.5 py-1.5 font-medium text-primary hover:bg-muted text-[12px] border border-black/5 dark:border-white/10"
              >
                ☕ Café CSV
              </a>
              <a
                href="/demo-gym-feedback.csv"
                download="demo-gym-feedback.csv"
                className="inline-flex items-center gap-1 rounded-xl bg-background px-2.5 py-1.5 font-medium text-primary hover:bg-muted text-[12px] border border-black/5 dark:border-white/10"
              >
                🏋️ Gym CSV
              </a>
              <a
                href="/demo-restaurant-feedback.csv"
                download="demo-restaurant-feedback.csv"
                className="inline-flex items-center gap-1 rounded-xl bg-background px-2.5 py-1.5 font-medium text-primary hover:bg-muted text-[12px] border border-black/5 dark:border-white/10"
              >
                🍽️ Restaurant CSV
              </a>
            </div>
          </div>



          {/* Status Feedback */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-[13px] text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 p-3 text-[13px] text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Progress bar */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-[12px] font-medium">
                <span className="flex items-center gap-1.5 text-primary">
                  <Sparkles className="size-3.5 animate-spin" />
                  Running AI Sentiment NLP Parser & Ingestion...
                </span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file || isUploading} className="gap-2">
            {isUploading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <UploadCloud className="size-4" />
                Analyze Feedback Batch
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

