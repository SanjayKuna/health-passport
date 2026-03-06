import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileImage, X, Sparkles, CheckCircle, Loader2, FileText, Pill, TestTube, AlertCircle, Edit2, Save, User, Calendar, Stethoscope } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ExtractedData {
  patientName: string;
  date: string;
  symptoms: string[];
  diagnosis: string;
  medicines: { name: string; dosage: string; frequency: string }[];
  labResults: { test: string; value: string; unit: string; referenceRange?: string }[];
  recordType: "prescription" | "lab_report" | "diagnosis" | "general";
  additionalNotes?: string;
}

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  status: "uploading" | "processing" | "completed" | "error";
  error?: string;
  extractedData?: ExtractedData;
  isEditing?: boolean;
}

const UploadPage = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const processWithAI = async (file: UploadedFile) => {
    try {
      // Update status to processing
      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id ? { ...f, status: "processing" } : f
        )
      );

      // Convert file to base64
      const base64Image = await fileToBase64(file.file);

      // Call the edge function
      const { data, error } = await supabase.functions.invoke("process-medical-record", {
        body: { imageBase64: base64Image },
      });

      if (error) {
        throw new Error(error.message || "Failed to process image");
      }

      if (!data.success) {
        throw new Error(data.error || "AI processing failed");
      }

      // Update with extracted data
      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id
            ? {
                ...f,
                status: "completed",
                extractedData: data.data,
              }
            : f
        )
      );

      toast.success("Medical record analyzed successfully!");
    } catch (error) {
      console.error("Error processing file:", error);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id
            ? {
                ...f,
                status: "error",
                error: error instanceof Error ? error.message : "Processing failed",
              }
            : f
        )
      );
      toast.error(error instanceof Error ? error.message : "Failed to process image");
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
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

    // Process each file with AI
    newFiles.forEach((uploadedFile) => {
      processWithAI(uploadedFile);
    });
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const toggleEdit = (id: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, isEditing: !f.isEditing } : f
      )
    );
  };

  const updateExtractedData = (id: string, field: keyof ExtractedData, value: any) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id && f.extractedData
          ? { ...f, extractedData: { ...f.extractedData, [field]: value } }
          : f
      )
    );
  };

  const getRecordTypeIcon = (type?: string) => {
    switch (type) {
      case "prescription":
        return <Pill className="w-5 h-5 text-primary" />;
      case "lab_report":
        return <TestTube className="w-5 h-5 text-success" />;
      case "diagnosis":
        return <Stethoscope className="w-5 h-5 text-accent" />;
      default:
        return <FileText className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getRecordTypeLabel = (type?: string) => {
    switch (type) {
      case "prescription":
        return "Prescription";
      case "lab_report":
        return "Lab Report";
      case "diagnosis":
        return "Diagnosis Report";
      default:
        return "Medical Document";
    }
  };

  const saveRecord = async (id: string) => {
    const file = files.find((f) => f.id === id);
    if (file?.extractedData) {
      try {
        const medicinesToInsert = file.extractedData.medicines.map((med) => ({
          name: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          status: "active",
          purpose: file.extractedData!.diagnosis || "",
          prescribed_by: file.extractedData!.patientName || "Not specified",
          additional_notes: file.extractedData!.additionalNotes || "",
        }));

        if (medicinesToInsert.length === 0) {
          toast.error("No medicines found to save");
          return;
        }

        const { error } = await supabase.from("medicines").insert(medicinesToInsert);

        if (error) {
          throw error;
        }

        toggleEdit(id);
        toast.success(`${medicinesToInsert.length} medicine(s) saved successfully!`);
      } catch (error) {
        console.error("Error saving medicines:", error);
        toast.error("Failed to save medicines. Please try again.");
      }
    }
  };

  const retryProcessing = (file: UploadedFile) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === file.id ? { ...f, status: "uploading", error: undefined } : f
      )
    );
    processWithAI(file);
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
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Upload Medical Records
            </h1>
            <p className="text-muted-foreground">
              Upload photos of prescriptions, lab reports, or medical documents.
              Our AI will extract and classify all the information.
            </p>
          </motion.div>

          {/* Upload Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card
              variant={isDragging ? "outline" : "elevated"}
              className={`border-2 border-dashed ${
                isDragging ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
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
                    {isDragging
                      ? "Drop your files here"
                      : "Drag & drop your medical records"}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    or click to browse from your device
                  </p>
                  <div>
                    <input
                      id="file-upload-input"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          handleFiles(Array.from(e.target.files));
                          e.target.value = '';
                        }
                      }}
                    />
                    <Button
                      variant="hero"
                      size="lg"
                      type="button"
                      onClick={() => {
                        document.getElementById('file-upload-input')?.click();
                      }}
                    >
                      <FileImage className="w-5 h-5 mr-2" />
                      Select Images
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Supports JPG, PNG, HEIC • Max 10MB per file
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Processing Results */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8 space-y-6"
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
                      <CardContent className="p-6">
                        {/* File Preview Header */}
                        <div className="flex gap-4 mb-4">
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 border border-border">
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

                            {/* Status Indicators */}
                            <div className="mt-3">
                              {uploadedFile.status === "uploading" && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Preparing image...
                                </div>
                              )}
                              {uploadedFile.status === "processing" && (
                                <div className="flex items-center gap-2 text-sm text-primary">
                                  <Sparkles className="w-4 h-4" />
                                  AI is analyzing your document...
                                </div>
                              )}
                              {uploadedFile.status === "error" && (
                                <div className="flex items-center gap-2 text-sm text-destructive">
                                  <AlertCircle className="w-4 h-4" />
                                  {uploadedFile.error || "Processing failed"}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => retryProcessing(uploadedFile)}
                                    className="ml-2"
                                  >
                                    Retry
                                  </Button>
                                </div>
                              )}
                              {uploadedFile.status === "completed" && (
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-success" />
                                  <span className="text-sm text-success font-medium">
                                    Analysis Complete
                                  </span>
                                  {uploadedFile.extractedData && (
                                    <div className="flex items-center gap-2 ml-2">
                                      {getRecordTypeIcon(uploadedFile.extractedData.recordType)}
                                      <span className="text-sm font-medium">
                                        {getRecordTypeLabel(uploadedFile.extractedData.recordType)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Review Results Section */}
                        {uploadedFile.status === "completed" && uploadedFile.extractedData && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="border-t border-border pt-4"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-semibold text-foreground">
                                Review Extracted Information
                              </h4>
                              <div className="flex gap-2">
                                {uploadedFile.isEditing ? (
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => saveRecord(uploadedFile.id)}
                                  >
                                    <Save className="w-4 h-4 mr-1" />
                                    Save
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => toggleEdit(uploadedFile.id)}
                                  >
                                    <Edit2 className="w-4 h-4 mr-1" />
                                    Edit
                                  </Button>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Patient Name */}
                              <div className="space-y-1">
                                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  Patient Name
                                </label>
                                {uploadedFile.isEditing ? (
                                  <Input
                                    value={uploadedFile.extractedData.patientName}
                                    onChange={(e) =>
                                      updateExtractedData(
                                        uploadedFile.id,
                                        "patientName",
                                        e.target.value
                                      )
                                    }
                                  />
                                ) : (
                                  <p className="text-foreground">
                                    {uploadedFile.extractedData.patientName}
                                  </p>
                                )}
                              </div>

                              {/* Date */}
                              <div className="space-y-1">
                                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  Date
                                </label>
                                {uploadedFile.isEditing ? (
                                  <Input
                                    value={uploadedFile.extractedData.date}
                                    onChange={(e) =>
                                      updateExtractedData(
                                        uploadedFile.id,
                                        "date",
                                        e.target.value
                                      )
                                    }
                                  />
                                ) : (
                                  <p className="text-foreground">
                                    {uploadedFile.extractedData.date}
                                  </p>
                                )}
                              </div>

                              {/* Symptoms */}
                              {uploadedFile.extractedData.symptoms.length > 0 && (
                                <div className="space-y-1 md:col-span-2">
                                  <label className="text-sm font-medium text-muted-foreground">
                                    Symptoms
                                  </label>
                                  <div className="flex flex-wrap gap-2">
                                    {uploadedFile.extractedData.symptoms.map((symptom, i) => (
                                      <span
                                        key={i}
                                        className="px-2 py-1 text-xs rounded-full bg-accent/10 text-accent"
                                      >
                                        {symptom}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Diagnosis */}
                              <div className="space-y-1 md:col-span-2">
                                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                  <Stethoscope className="w-3 h-3" />
                                  Diagnosis
                                </label>
                                {uploadedFile.isEditing ? (
                                  <Input
                                    value={uploadedFile.extractedData.diagnosis}
                                    onChange={(e) =>
                                      updateExtractedData(
                                        uploadedFile.id,
                                        "diagnosis",
                                        e.target.value
                                      )
                                    }
                                  />
                                ) : (
                                  <p className="text-foreground">
                                    {uploadedFile.extractedData.diagnosis}
                                  </p>
                                )}
                              </div>

                              {/* Medicines */}
                              {uploadedFile.extractedData.medicines.length > 0 && (
                                <div className="space-y-2 md:col-span-2">
                                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                    <Pill className="w-3 h-3" />
                                    Medicines
                                  </label>
                                  <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                                    {uploadedFile.extractedData.medicines.map((med, i) => (
                                      <div
                                        key={i}
                                        className="flex flex-wrap items-center gap-2 text-sm"
                                      >
                                        <span className="font-medium text-foreground">
                                          {med.name}
                                        </span>
                                        <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs">
                                          {med.dosage}
                                        </span>
                                        <span className="text-muted-foreground">
                                          {med.frequency}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Lab Results */}
                              {uploadedFile.extractedData.labResults.length > 0 && (
                                <div className="space-y-2 md:col-span-2">
                                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                    <TestTube className="w-3 h-3" />
                                    Lab Results
                                  </label>
                                  <div className="bg-muted/30 rounded-lg p-3">
                                    <div className="grid gap-2">
                                      {uploadedFile.extractedData.labResults.map((lab, i) => (
                                        <div
                                          key={i}
                                          className="flex flex-wrap items-center justify-between text-sm border-b border-border last:border-0 pb-2 last:pb-0"
                                        >
                                          <span className="font-medium text-foreground">
                                            {lab.test}
                                          </span>
                                          <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 rounded bg-success/10 text-success text-xs">
                                              {lab.value} {lab.unit}
                                            </span>
                                            {lab.referenceRange && (
                                              <span className="text-muted-foreground text-xs">
                                                (Ref: {lab.referenceRange})
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Additional Notes */}
                              {uploadedFile.extractedData.additionalNotes && (
                                <div className="space-y-1 md:col-span-2">
                                  <label className="text-sm font-medium text-muted-foreground">
                                    Additional Notes
                                  </label>
                                  <p className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
                                    {uploadedFile.extractedData.additionalNotes}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-6 pt-4 border-t border-border">
                              <Button
                                variant="hero"
                                className="flex-1"
                                onClick={() => saveRecord(uploadedFile.id)}
                              >
                                <Save className="w-4 h-4 mr-2" />
                                Confirm & Save Record
                              </Button>
                            </div>
                          </motion.div>
                        )}
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
