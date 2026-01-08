import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileImage, X, Sparkles, CheckCircle, Loader2, FileText, Pill, TestTube } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  status: "uploading" | "processing" | "completed" | "error";
  result?: {
    type: "prescription" | "lab" | "diagnosis";
    medicines?: { name: string; dosage: string }[];
    diagnosis?: string;
    labResults?: { test: string; value: string; unit: string }[];
  };
}

const UploadPage = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.type.startsWith("image/")
    );
    
    handleFiles(droppedFiles);
  }, []);

  const handleFiles = (selectedFiles: File[]) => {
    const newFiles: UploadedFile[] = selectedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      status: "uploading",
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Simulate AI processing
    newFiles.forEach((uploadedFile) => {
      setTimeout(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadedFile.id ? { ...f, status: "processing" } : f
          )
        );

        setTimeout(() => {
          const mockResults = [
            {
              type: "prescription" as const,
              medicines: [
                { name: "Amoxicillin", dosage: "500mg" },
                { name: "Ibuprofen", dosage: "400mg" },
              ],
            },
            {
              type: "lab" as const,
              labResults: [
                { test: "Hemoglobin", value: "14.5", unit: "g/dL" },
                { test: "WBC", value: "7.2", unit: "K/uL" },
              ],
            },
            {
              type: "diagnosis" as const,
              diagnosis: "Upper Respiratory Infection - Mild",
            },
          ];

          setFiles((prev) =>
            prev.map((f) =>
              f.id === uploadedFile.id
                ? {
                    ...f,
                    status: "completed",
                    result: mockResults[Math.floor(Math.random() * mockResults.length)],
                  }
                : f
            )
          );
          toast.success("Record processed successfully!");
        }, 2000);
      }, 1000);
    });
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case "prescription":
        return <Pill className="w-5 h-5 text-primary" />;
      case "lab":
        return <TestTube className="w-5 h-5 text-success" />;
      case "diagnosis":
        return <FileText className="w-5 h-5 text-accent" />;
      default:
        return <FileImage className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">Upload Medical Records</h1>
            <p className="text-muted-foreground">
              Upload photos of prescriptions, lab reports, or medical documents. Our AI will extract and classify all the information.
            </p>
          </motion.div>

          {/* Upload Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant={isDragging ? "outline" : "elevated"} className={`border-2 border-dashed ${isDragging ? "border-primary bg-primary/5" : "border-border"}`}>
              <CardContent className="p-12">
                <div
                  className="text-center"
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                >
                  <motion.div
                    className="w-20 h-20 mx-auto mb-6 rounded-2xl gradient-primary flex items-center justify-center"
                    animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                  >
                    <Upload className="w-10 h-10 text-primary-foreground" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {isDragging ? "Drop your files here" : "Drag & drop your medical records"}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    or click to browse from your device
                  </p>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          handleFiles(Array.from(e.target.files));
                        }
                      }}
                    />
                    <Button variant="hero" size="lg">
                      <FileImage className="w-5 h-5 mr-2" />
                      Select Images
                    </Button>
                  </label>
                  <p className="text-sm text-muted-foreground mt-4">
                    Supports JPG, PNG, HEIC • Max 10MB per file
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Uploaded Files */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8 space-y-4"
              >
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Processing Results
                </h3>

                {files.map((uploadedFile) => (
                  <motion.div
                    key={uploadedFile.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Card variant="elevated">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          {/* Preview */}
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={uploadedFile.preview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                            {uploadedFile.status === "processing" && (
                              <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                                <Loader2 className="w-6 h-6 text-primary-foreground animate-spin" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-foreground truncate">
                                  {uploadedFile.file.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                              <button
                                onClick={() => removeFile(uploadedFile.id)}
                                className="p-1 hover:bg-muted rounded-lg transition-colors"
                              >
                                <X className="w-4 h-4 text-muted-foreground" />
                              </button>
                            </div>

                            {/* Status */}
                            <div className="mt-3">
                              {uploadedFile.status === "uploading" && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Uploading...
                                </div>
                              )}
                              {uploadedFile.status === "processing" && (
                                <div className="flex items-center gap-2 text-sm text-primary">
                                  <Sparkles className="w-4 h-4" />
                                  AI is analyzing your document...
                                </div>
                              )}
                              {uploadedFile.status === "completed" && uploadedFile.result && (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-success" />
                                    <span className="text-sm text-success font-medium">Analysis Complete</span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-2">
                                    {getTypeIcon(uploadedFile.result.type)}
                                    <span className="text-sm font-medium capitalize">
                                      {uploadedFile.result.type}
                                    </span>
                                  </div>
                                  {uploadedFile.result.medicines && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {uploadedFile.result.medicines.map((med, i) => (
                                        <span
                                          key={i}
                                          className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                                        >
                                          {med.name} - {med.dosage}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                  {uploadedFile.result.diagnosis && (
                                    <p className="text-sm text-foreground mt-2">
                                      {uploadedFile.result.diagnosis}
                                    </p>
                                  )}
                                  {uploadedFile.result.labResults && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {uploadedFile.result.labResults.map((lab, i) => (
                                        <span
                                          key={i}
                                          className="px-2 py-1 text-xs rounded-full bg-success/10 text-success"
                                        >
                                          {lab.test}: {lab.value} {lab.unit}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default UploadPage;
