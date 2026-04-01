import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  FileText, CheckCircle, Clock, AlertTriangle, XCircle,
  Send, Loader2, FileSearch, Pill, TestTube, Sparkles,
  ShieldCheck, ArrowRight, RefreshCw
} from "lucide-react";

type ClaimStatus = "analysis" | "policy_check" | "evidence" | "submitted" | "approved" | "denied";

interface Claim {
  id: string;
  patientName: string;
  status: ClaimStatus;
  diagnosis: string;
  createdAt: string;
  medicines: { name: string; dosage: string }[];
  labReports: string[];
  denialReason?: string;
}

const STEPS: { key: ClaimStatus; label: string; icon: React.ReactNode }[] = [
  { key: "analysis", label: "Document Analysis", icon: <FileSearch className="w-4 h-4" /> },
  { key: "policy_check", label: "Policy Check", icon: <ShieldCheck className="w-4 h-4" /> },
  { key: "evidence", label: "Evidence Gathering", icon: <TestTube className="w-4 h-4" /> },
  { key: "submitted", label: "Submitted to Payer", icon: <Send className="w-4 h-4" /> },
];

const statusIndex = (s: ClaimStatus) => {
  const idx = STEPS.findIndex((st) => st.key === s);
  return idx === -1 ? STEPS.length : idx;
};

const Insurance = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingAppeal, setGeneratingAppeal] = useState<string | null>(null);
  const [appealLetters, setAppealLetters] = useState<Record<string, string>>({});

  useEffect(() => {
    buildClaims();
  }, []);

  const buildClaims = async () => {
    setLoading(true);
    const { data: meds } = await supabase.from("medicines").select("*").order("created_at", { ascending: false });
    const { data: profiles } = await supabase.from("patient_profiles").select("*").order("updated_at", { ascending: false }).limit(1);

    const patientName = profiles?.[0]?.name || "Patient";

    if (!meds || meds.length === 0) {
      setClaims([]);
      setLoading(false);
      return;
    }

    // Group medicines by date (created_at day) as separate "claims"
    const grouped: Record<string, typeof meds> = {};
    meds.forEach((m) => {
      const day = new Date(m.created_at).toISOString().split("T")[0];
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(m);
    });

    const builtClaims: Claim[] = Object.entries(grouped).map(([day, items], i) => {
      const statuses: ClaimStatus[] = ["analysis", "policy_check", "evidence", "submitted", "approved", "denied"];
      // Simulate progression: older claims are further along
      const totalClaims = Object.keys(grouped).length;
      let simStatus: ClaimStatus;
      if (i === 0 && totalClaims > 1) {
        simStatus = "analysis"; // newest
      } else if (i === totalClaims - 1 && totalClaims > 2) {
        simStatus = "denied"; // oldest gets denied for demo
      } else {
        simStatus = statuses[Math.min(i + 1, 3)] as ClaimStatus;
      }

      return {
        id: day,
        patientName,
        status: simStatus,
        diagnosis: items[0]?.purpose || "General Treatment",
        createdAt: day,
        medicines: items.map((m) => ({ name: m.name, dosage: m.dosage })),
        labReports: items.filter((m) => m.additional_notes).map((m) => m.additional_notes!).slice(0, 3),
        denialReason: simStatus === "denied" ? "Insufficient clinical evidence for medical necessity" : undefined,
      };
    });

    setClaims(builtClaims);
    setLoading(false);
  };

  const advanceClaim = (claimId: string) => {
    setClaims((prev) =>
      prev.map((c) => {
        if (c.id !== claimId) return c;
        const idx = statusIndex(c.status);
        if (idx < STEPS.length - 1) {
          return { ...c, status: STEPS[idx + 1].key };
        }
        return { ...c, status: "approved" };
      })
    );
    toast.success("Claim status advanced!");
  };

  const generateAppealLetter = async (claim: Claim) => {
    setGeneratingAppeal(claim.id);
    try {
      const { data, error } = await supabase.functions.invoke("generate-appeal-letter", {
        body: {
          patientName: claim.patientName,
          diagnosis: claim.diagnosis,
          medicines: claim.medicines,
          denialReason: claim.denialReason,
          claimDate: claim.createdAt,
        },
      });

      if (error) throw error;

      setAppealLetters((prev) => ({ ...prev, [claim.id]: data.letter }));
      toast.success("Appeal letter generated successfully!");
    } catch (e) {
      console.error("Appeal generation error:", e);
      toast.error("Failed to generate appeal letter. Please try again.");
    } finally {
      setGeneratingAppeal(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Insurance & Authorizations</h1>
            <p className="text-muted-foreground">Track claim progress, gather evidence, and generate appeals</p>
          </motion.div>

          {claims.length === 0 ? (
            <Card variant="glass">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <ShieldCheck className="w-16 h-16 text-muted-foreground/40 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Claims Yet</h3>
                <p className="text-muted-foreground max-w-md">
                  Upload medical records first. Claims are automatically created from your uploaded prescriptions and lab reports.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {claims.map((claim, i) => (
                <motion.div
                  key={claim.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card variant="glass">
                    <CardHeader>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            Claim — {claim.diagnosis}
                          </CardTitle>
                          <CardDescription>
                            {claim.patientName} · Filed {new Date(claim.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <StatusBadge status={claim.status} />
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Authorization Stepper */}
                      <AuthorizationStepper status={claim.status} />

                      {/* Smart Evidence Folder */}
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                          <FileSearch className="w-4 h-4 text-primary" />
                          Smart Evidence Folder
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* Medicines */}
                          <div className="rounded-lg border border-border bg-muted/30 p-3">
                            <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                              <Pill className="w-3 h-3" /> Prescriptions ({claim.medicines.length})
                            </p>
                            <ul className="space-y-1">
                              {claim.medicines.map((m, idx) => (
                                <li key={idx} className="text-sm text-foreground flex items-center gap-2">
                                  <CheckCircle className="w-3 h-3 text-primary shrink-0" />
                                  {m.name} — {m.dosage}
                                </li>
                              ))}
                            </ul>
                          </div>
                          {/* Lab Reports */}
                          <div className="rounded-lg border border-border bg-muted/30 p-3">
                            <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                              <TestTube className="w-3 h-3" /> Lab Reports & Notes ({claim.labReports.length})
                            </p>
                            {claim.labReports.length > 0 ? (
                              <ul className="space-y-1">
                                {claim.labReports.map((lr, idx) => (
                                  <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                                    <CheckCircle className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                                    <span className="line-clamp-2">{lr}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-muted-foreground italic">No lab reports attached</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3">
                        {claim.status !== "approved" && claim.status !== "denied" && (
                          <Button size="sm" onClick={() => advanceClaim(claim.id)}>
                            <ArrowRight className="w-4 h-4 mr-1" /> Advance Status
                          </Button>
                        )}
                        {claim.status === "denied" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={generatingAppeal === claim.id}
                            onClick={() => generateAppealLetter(claim)}
                          >
                            {generatingAppeal === claim.id ? (
                              <Loader2 className="w-4 h-4 animate-spin mr-1" />
                            ) : (
                              <Sparkles className="w-4 h-4 mr-1" />
                            )}
                            Generate AI Appeal Letter
                          </Button>
                        )}
                        {claim.status === "denied" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setClaims((prev) =>
                                prev.map((c) => (c.id === claim.id ? { ...c, status: "analysis" as ClaimStatus, denialReason: undefined } : c))
                              );
                              toast.success("Claim resubmitted for review!");
                            }}
                          >
                            <RefreshCw className="w-4 h-4 mr-1" /> Resubmit Claim
                          </Button>
                        )}
                      </div>

                      {/* Appeal Letter */}
                      {appealLetters[claim.id] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4"
                        >
                          <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            AI-Generated Appeal Letter
                          </h4>
                          <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                            {appealLetters[claim.id]}
                          </pre>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="mt-3"
                            onClick={() => {
                              navigator.clipboard.writeText(appealLetters[claim.id]);
                              toast.success("Appeal letter copied to clipboard!");
                            }}
                          >
                            Copy to Clipboard
                          </Button>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

/* ---------- Sub-components ---------- */

const StatusBadge = ({ status }: { status: ClaimStatus }) => {
  const config: Record<ClaimStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
    analysis: { label: "Analyzing", variant: "secondary", icon: <Clock className="w-3 h-3" /> },
    policy_check: { label: "Policy Check", variant: "secondary", icon: <ShieldCheck className="w-3 h-3" /> },
    evidence: { label: "Gathering Evidence", variant: "outline", icon: <FileSearch className="w-3 h-3" /> },
    submitted: { label: "Submitted", variant: "default", icon: <Send className="w-3 h-3" /> },
    approved: { label: "Approved", variant: "default", icon: <CheckCircle className="w-3 h-3" /> },
    denied: { label: "Denied", variant: "destructive", icon: <XCircle className="w-3 h-3" /> },
  };
  const c = config[status];
  return (
    <Badge variant={c.variant} className="flex items-center gap-1">
      {c.icon} {c.label}
    </Badge>
  );
};

const AuthorizationStepper = ({ status }: { status: ClaimStatus }) => {
  const currentIdx = status === "approved" ? STEPS.length : status === "denied" ? -1 : statusIndex(status);
  const progressPct = status === "approved" ? 100 : status === "denied" ? 0 : ((currentIdx + 1) / STEPS.length) * 100;

  return (
    <div>
      <Progress value={progressPct} className="h-2 mb-4" />
      <div className="grid grid-cols-4 gap-2">
        {STEPS.map((step, i) => {
          const completed = i < currentIdx || status === "approved";
          const active = i === currentIdx && status !== "denied" && status !== "approved";
          const denied = status === "denied";

          return (
            <div
              key={step.key}
              className={`flex flex-col items-center text-center gap-1 p-2 rounded-lg transition-colors ${
                completed
                  ? "bg-primary/10"
                  : active
                  ? "bg-primary/20 ring-2 ring-primary/40"
                  : denied
                  ? "bg-destructive/5"
                  : "bg-muted/30"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  completed
                    ? "bg-primary text-primary-foreground"
                    : active
                    ? "bg-primary/20 text-primary"
                    : denied
                    ? "bg-destructive/20 text-destructive"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {completed ? <CheckCircle className="w-4 h-4" /> : step.icon}
              </div>
              <span className={`text-xs font-medium ${completed || active ? "text-foreground" : "text-muted-foreground"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      {status === "denied" && (
        <div className="mt-3 flex items-center gap-2 text-sm text-destructive">
          <AlertTriangle className="w-4 h-4" />
          Claim denied — use the Appeal button to generate a response
        </div>
      )}
      {status === "approved" && (
        <div className="mt-3 flex items-center gap-2 text-sm text-primary">
          <CheckCircle className="w-4 h-4" />
          Authorization approved!
        </div>
      )}
    </div>
  );
};

export default Insurance;
