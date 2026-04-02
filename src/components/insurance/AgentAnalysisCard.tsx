import { Brain, ShieldCheck, Package, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AnalysisData {
  clinicalReaderResult?: {
    medicalNecessity?: string;
    icd10Codes?: string[];
    clinicalIndicators?: string[];
  };
  policyMatcherResult?: {
    requiresPreAuth?: boolean;
    guidelineMatch?: string;
    requiredEvidence?: string[];
    recommendation?: string;
  };
  submissionPackage?: {
    clinicalJustification?: string;
    patientSummary?: string;
    treatmentPlan?: string;
    supportingEvidence?: string[];
  };
  overallSummary?: string;
}

const AgentAnalysisCard = ({ analysis }: { analysis: AnalysisData }) => {
  const { clinicalReaderResult, policyMatcherResult, submissionPackage, overallSummary } = analysis;

  const recBadge = (rec?: string) => {
    if (rec === "APPROVE") return <Badge variant="default" className="bg-primary"><CheckCircle className="w-3 h-3 mr-1" />Likely Approved</Badge>;
    if (rec === "LIKELY_DENIED") return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Likely Denied</Badge>;
    return <Badge variant="secondary"><Info className="w-3 h-3 mr-1" />Needs Review</Badge>;
  };

  return (
    <div className="space-y-4">
      {overallSummary && (
        <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
          <p className="text-sm text-foreground font-medium">{overallSummary}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Clinical Reader Agent */}
        <Card variant="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              Clinical Reader Agent
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {clinicalReaderResult?.medicalNecessity && (
              <p className="text-xs text-muted-foreground">{clinicalReaderResult.medicalNecessity}</p>
            )}
            {clinicalReaderResult?.icd10Codes && clinicalReaderResult.icd10Codes.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {clinicalReaderResult.icd10Codes.map((code, i) => (
                  <Badge key={i} variant="outline" className="text-xs">{code}</Badge>
                ))}
              </div>
            )}
            {clinicalReaderResult?.clinicalIndicators && (
              <ul className="space-y-1">
                {clinicalReaderResult.clinicalIndicators.map((ind, i) => (
                  <li key={i} className="text-xs text-foreground flex items-start gap-1">
                    <CheckCircle className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                    {ind}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Policy Matcher Agent */}
        <Card variant="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Policy Matcher Agent
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              {recBadge(policyMatcherResult?.recommendation)}
            </div>
            {policyMatcherResult?.guidelineMatch && (
              <p className="text-xs text-muted-foreground">{policyMatcherResult.guidelineMatch}</p>
            )}
            {policyMatcherResult?.requiredEvidence && (
              <ul className="space-y-1">
                {policyMatcherResult.requiredEvidence.map((ev, i) => (
                  <li key={i} className="text-xs text-foreground flex items-start gap-1">
                    <Info className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5" />
                    {ev}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Submission Agent */}
        <Card variant="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              Submission Agent
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {submissionPackage?.clinicalJustification && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">Clinical Justification:</p>
                <p className="text-xs text-foreground">{submissionPackage.clinicalJustification}</p>
              </div>
            )}
            {submissionPackage?.treatmentPlan && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">Treatment Plan:</p>
                <p className="text-xs text-foreground">{submissionPackage.treatmentPlan}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentAnalysisCard;
