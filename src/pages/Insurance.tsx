import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import AuthorizationStepper, { AuthStatus } from "@/components/insurance/AuthorizationStepper";
import AgentAnalysisCard from "@/components/insurance/AgentAnalysisCard";
import {
  FileText, CheckCircle, Clock, XCircle,
  Send, Loader2, Pill, Sparkles,
  ShieldCheck, RefreshCw, Brain
} from "lucide-react";

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  purpose: string | null;
  additional_notes: string | null;
  prescribed_by: string | null;
  status: string;
  created_at: string;
}

interface Authorization {
  id: string;
  medicine_id: string;
  patient_name: string;
  insurance_provider: string;
  status: string;
  request_date: string;
  diagnosis: string | null;
  clinical_justification: string | null;
  ai_generated_summary: string | null;
  policy_check_result: string | null;
  submission_package: any;
}

const Insurance = () => {
  const { user: authUser } = useAuth();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [authorizations, setAuthorizations] = useState<Authorization[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingMedId, setProcessingMedId] = useState<string | null>(null);
  const [appealLoading, setAppealLoading] = useState<string | null>(null);
  const [appealLetters, setAppealLetters] = useState<Record<string, string>>({});
  const [expandedAuth, setExpandedAuth] = useState<string | null>(null);

  useEffect(() => {
    if (authUser) fetchData();
  }, [authUser]);

  const fetchData = async () => {
    if (!authUser) return;
    setLoading(true);
    const [medsRes, authsRes] = await Promise.all([
      supabase.from("medicines").select("*").eq("user_id", authUser.id).order("created_at", { ascending: false }),
      supabase.from("authorizations").select("*").eq("user_id", authUser.id).order("created_at", { ascending: false }),
    ]);
    setMedicines((medsRes.data as Medicine[]) || []);
    setAuthorizations((authsRes.data as Authorization[]) || []);
    setLoading(false);
  };

  const requestAuthorization = async (medicine: Medicine) => {
    if (!authUser) return;
    setProcessingMedId(medicine.id);
    try {
      const { data: profiles } = await supabase
        .from("patient_profiles")
        .select("*")
        .eq("user_id", authUser.id)
        .limit(1);

      const profile = profiles?.[0];
      const bmi = profile?.height && profile?.weight
        ? (Number(profile.weight) / Math.pow(Number(profile.height) / 100, 2)).toFixed(1)
        : undefined;

      // Gather all medicines for context
      const relatedMeds = medicines.filter(
        (m) => m.prescribed_by === medicine.prescribed_by || m.purpose === medicine.purpose
      );

      const { data, error } = await supabase.functions.invoke("process-insurance-auth", {
        body: {
          medicineId: medicine.id,
          patientName: profile?.name || medicine.prescribed_by || "Patient",
          diagnosis: medicine.purpose || "General Treatment",
          medicines: relatedMeds.map((m) => ({
            name: m.name,
            dosage: m.dosage,
            frequency: m.frequency,
          })),
          labResults: relatedMeds
            .filter((m) => m.additional_notes)
            .map((m) => m.additional_notes!),
          bmi,
          age: profile?.age?.toString(),
          additionalNotes: medicine.additional_notes || "",
          userId: authUser!.id,
        },
      });

      if (error) throw error;

      toast.success("Authorization analysis complete!");
      await fetchData();
    } catch (e) {
      console.error("Auth request error:", e);
      toast.error("Failed to process authorization. Please try again.");
    } finally {
      setProcessingMedId(null);
    }
  };

  const generateAppeal = async (auth: Authorization) => {
    setAppealLoading(auth.id);
    try {
      const med = medicines.find((m) => m.id === auth.medicine_id);
      const { data, error } = await supabase.functions.invoke("generate-appeal-letter", {
        body: {
          patientName: auth.patient_name,
          diagnosis: auth.diagnosis,
          medicines: med ? [{ name: med.name, dosage: med.dosage }] : [],
          denialReason: auth.policy_check_result || "Insufficient clinical evidence",
          claimDate: auth.request_date,
        },
      });
      if (error) throw error;
      setAppealLetters((prev) => ({ ...prev, [auth.id]: data.letter }));
      toast.success("Appeal letter generated!");
    } catch (e) {
      console.error("Appeal error:", e);
      toast.error("Failed to generate appeal letter.");
    } finally {
      setAppealLoading(null);
    }
  };

  const getAuthForMedicine = (medId: string) =>
    authorizations.find((a) => a.medicine_id === medId);

  const medicinesWithoutAuth = medicines.filter((m) => !getAuthForMedicine(m.id));
  const medicinesWithAuth = medicines.filter((m) => getAuthForMedicine(m.id));

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
            <p className="text-muted-foreground">
              AI-powered AutoAuth Insurance Agent — Clinical Reader, Policy Matcher & Submission agents
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Medicines", value: medicines.length, color: "text-primary" },
              { label: "Pending Auth", value: medicinesWithoutAuth.length, color: "text-muted-foreground" },
              { label: "Approved", value: authorizations.filter((a) => a.status === "approved").length, color: "text-primary" },
              { label: "Denied", value: authorizations.filter((a) => a.status === "denied").length, color: "text-destructive" },
            ].map((stat, i) => (
              <Card key={i} variant="stat">
                <CardContent className="p-4 text-center">
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Medicines needing authorization */}
          {medicinesWithoutAuth.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Pill className="w-5 h-5 text-primary" />
                Medicines Awaiting Authorization
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {medicinesWithoutAuth.map((med) => (
                  <Card key={med.id} variant="glass">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{med.name}</h3>
                          <p className="text-sm text-muted-foreground">{med.dosage} · {med.frequency}</p>
                        </div>
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" /> Pending
                        </Badge>
                      </div>
                      {med.purpose && <p className="text-xs text-muted-foreground mb-3">{med.purpose}</p>}
                      <Button
                        size="sm"
                        className="w-full"
                        disabled={processingMedId === med.id}
                        onClick={() => requestAuthorization(med)}
                      >
                        {processingMedId === med.id ? (
                          <><Loader2 className="w-4 h-4 animate-spin mr-1" /> Analyzing...</>
                        ) : (
                          <><Brain className="w-4 h-4 mr-1" /> Request Authorization</>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Active Authorizations */}
          {authorizations.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Authorization Requests
              </h2>
              <div className="space-y-6">
                {authorizations.map((auth, i) => {
                  const med = medicines.find((m) => m.id === auth.medicine_id);
                  const isExpanded = expandedAuth === auth.id;

                  return (
                    <motion.div key={auth.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <Card variant="glass">
                        <CardHeader>
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div>
                              <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                {med?.name || "Medicine"} — {auth.diagnosis || "Authorization"}
                              </CardTitle>
                              <CardDescription>
                                {auth.patient_name} · Requested {new Date(auth.request_date).toLocaleDateString()}
                                {auth.insurance_provider !== "General Insurance" && ` · ${auth.insurance_provider}`}
                              </CardDescription>
                            </div>
                            <StatusBadge status={auth.status as AuthStatus} />
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <AuthorizationStepper status={auth.status as AuthStatus} />

                          {/* Clinical Justification Preview */}
                          {auth.clinical_justification && (
                            <div className="rounded-lg border border-border bg-muted/30 p-3">
                              <p className="text-xs font-semibold text-muted-foreground mb-1">Clinical Justification</p>
                              <p className="text-sm text-foreground">{auth.clinical_justification}</p>
                            </div>
                          )}

                          {/* AI Summary */}
                          {auth.ai_generated_summary && (
                            <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-3">
                              <p className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-primary" /> AI Summary
                              </p>
                              <p className="text-sm text-foreground">{auth.ai_generated_summary}</p>
                            </div>
                          )}

                          {/* Expandable Agent Analysis */}
                          {auth.submission_package && (
                            <div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setExpandedAuth(isExpanded ? null : auth.id)}
                              >
                                <Brain className="w-4 h-4 mr-1" />
                                {isExpanded ? "Hide" : "View"} Agent Analysis
                              </Button>
                              {isExpanded && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3">
                                  <AgentAnalysisCard analysis={auth.submission_package} />
                                </motion.div>
                              )}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex flex-wrap gap-3">
                            {auth.status === "denied" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  disabled={appealLoading === auth.id}
                                  onClick={() => generateAppeal(auth)}
                                >
                                  {appealLoading === auth.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                                  ) : (
                                    <Sparkles className="w-4 h-4 mr-1" />
                                  )}
                                  Generate AI Appeal Letter
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => {
                                  const med2 = medicines.find((m) => m.id === auth.medicine_id);
                                  if (med2) requestAuthorization(med2);
                                }}>
                                  <RefreshCw className="w-4 h-4 mr-1" /> Resubmit
                                </Button>
                              </>
                            )}
                          </div>

                          {/* Appeal Letter */}
                          {appealLetters[auth.id] && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-primary" />
                                AI-Generated Appeal Letter
                              </h4>
                              <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                                {appealLetters[auth.id]}
                              </pre>
                              <Button size="sm" variant="secondary" className="mt-3" onClick={() => {
                                navigator.clipboard.writeText(appealLetters[auth.id]);
                                toast.success("Copied to clipboard!");
                              }}>
                                Copy to Clipboard
                              </Button>
                            </motion.div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Empty state */}
          {medicines.length === 0 && (
            <Card variant="glass">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <ShieldCheck className="w-16 h-16 text-muted-foreground/40 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Records Yet</h3>
                <p className="text-muted-foreground max-w-md">
                  Upload medical records first. The AutoAuth Insurance Agent will analyze them for prior authorization.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

const StatusBadge = ({ status }: { status: AuthStatus }) => {
  const config: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
    pending: { label: "Pending", variant: "outline", icon: <Clock className="w-3 h-3" /> },
    analyzing: { label: "Analyzing", variant: "secondary", icon: <Brain className="w-3 h-3" /> },
    policy_check: { label: "Policy Check", variant: "secondary", icon: <ShieldCheck className="w-3 h-3" /> },
    evidence: { label: "Gathering Evidence", variant: "outline", icon: <FileText className="w-3 h-3" /> },
    pending_review: { label: "Under Review", variant: "default", icon: <Send className="w-3 h-3" /> },
    approved: { label: "Approved", variant: "default", icon: <CheckCircle className="w-3 h-3" /> },
    denied: { label: "Denied", variant: "destructive", icon: <XCircle className="w-3 h-3" /> },
  };
  const c = config[status] || config.pending;
  return (
    <Badge variant={c.variant} className="flex items-center gap-1">
      {c.icon} {c.label}
    </Badge>
  );
};

export default Insurance;
