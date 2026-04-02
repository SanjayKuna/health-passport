import { CheckCircle, FileSearch, ShieldCheck, TestTube, Send, AlertTriangle, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export type AuthStatus = "pending" | "analyzing" | "policy_check" | "evidence" | "pending_review" | "approved" | "denied";

export const AUTH_STEPS = [
  { key: "analyzing", label: "Document Analysis", icon: <FileSearch className="w-4 h-4" /> },
  { key: "policy_check", label: "Policy Check", icon: <ShieldCheck className="w-4 h-4" /> },
  { key: "evidence", label: "Evidence Gathering", icon: <TestTube className="w-4 h-4" /> },
  { key: "pending_review", label: "Submitted to Payer", icon: <Send className="w-4 h-4" /> },
] as const;

export const statusIndex = (s: AuthStatus) => {
  const idx = AUTH_STEPS.findIndex((st) => st.key === s);
  return idx === -1 ? AUTH_STEPS.length : idx;
};

const AuthorizationStepper = ({ status }: { status: AuthStatus }) => {
  const currentIdx = status === "approved" ? AUTH_STEPS.length : status === "denied" ? -1 : statusIndex(status);
  const progressPct = status === "approved" ? 100 : status === "denied" ? 0 : ((currentIdx + 1) / AUTH_STEPS.length) * 100;

  return (
    <div>
      <Progress value={progressPct} className="h-2 mb-4" />
      <div className="grid grid-cols-4 gap-2">
        {AUTH_STEPS.map((step, i) => {
          const completed = i < currentIdx || status === "approved";
          const active = i === currentIdx && status !== "denied" && status !== "approved";
          const denied = status === "denied";

          return (
            <div
              key={step.key}
              className={`flex flex-col items-center text-center gap-1 p-2 rounded-lg transition-colors ${
                completed ? "bg-primary/10"
                : active ? "bg-primary/20 ring-2 ring-primary/40"
                : denied ? "bg-destructive/5"
                : "bg-muted/30"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  completed ? "bg-primary text-primary-foreground"
                  : active ? "bg-primary/20 text-primary"
                  : denied ? "bg-destructive/20 text-destructive"
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
      {status === "pending_review" && (
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          Under review by insurance payer
        </div>
      )}
    </div>
  );
};

export default AuthorizationStepper;
