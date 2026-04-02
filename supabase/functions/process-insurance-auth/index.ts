import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { medicineId, patientName, diagnosis, medicines, labResults, bmi, age, additionalNotes } = await req.json();

    if (!medicineId || !patientName) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Build context for the three agents
    const medicineList = (medicines || [])
      .map((m: { name: string; dosage: string; frequency: string }) => `- ${m.name} (${m.dosage}, ${m.frequency})`)
      .join("\n");

    const labList = (labResults || [])
      .map((l: string) => `- ${l}`)
      .join("\n") || "No lab results available";

    const systemPrompt = `You are a Prior Authorization specialist. Your goal is to find clinical evidence in the provided notes that justifies the medical necessity of the prescribed treatment according to standard insurance protocols.

You operate as three specialized agents:

**AGENT 1 - Clinical Reader Agent:**
Scan the patient data to identify Medical Necessity. Match the diagnosis to ICD-10 codes when possible. Identify clinical indicators that justify the treatment.

**AGENT 2 - Policy Matcher Agent:**
Simulate a check against standard Payer Guidelines (Insurance Rules). Determine if this treatment typically requires pre-approval. Identify which evidence is needed for approval.

**AGENT 3 - Submission Agent:**
Package the patient's vitals, diagnosis, and clinical notes into a structured authorization request format.

You MUST respond with ONLY valid JSON (no markdown, no code blocks), using this exact structure:
{
  "clinicalReaderResult": {
    "medicalNecessity": "string explaining medical necessity",
    "icd10Codes": ["array of relevant ICD-10 codes"],
    "clinicalIndicators": ["array of clinical evidence points"]
  },
  "policyMatcherResult": {
    "requiresPreAuth": true/false,
    "guidelineMatch": "string explaining which guidelines apply",
    "requiredEvidence": ["array of evidence items needed"],
    "recommendation": "APPROVE" or "NEEDS_REVIEW" or "LIKELY_DENIED"
  },
  "submissionPackage": {
    "clinicalJustification": "A formal clinical justification statement",
    "patientSummary": "Brief patient summary with vitals",
    "treatmentPlan": "Description of treatment plan",
    "supportingEvidence": ["array of supporting evidence items"]
  },
  "overallSummary": "A 2-3 sentence summary of the authorization analysis"
}`;

    const userPrompt = `Analyze this patient case for prior authorization:

Patient: ${patientName}
Age: ${age || "Unknown"}
BMI: ${bmi || "Unknown"}
Diagnosis: ${diagnosis || "Not specified"}

Prescribed Medications:
${medicineList || "None listed"}

Lab Results / Clinical Notes:
${labList}

Additional Notes:
${additionalNotes || "None"}

Run all three agents (Clinical Reader, Policy Matcher, Submission) and provide the complete analysis.`;

    console.log("Calling AI for insurance authorization analysis...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const result = await response.json();
    const aiContent = result.choices?.[0]?.message?.content;

    if (!aiContent) throw new Error("AI returned empty response");

    // Parse AI response
    let analysisData;
    try {
      let clean = aiContent.trim();
      if (clean.startsWith("```json")) clean = clean.slice(7);
      else if (clean.startsWith("```")) clean = clean.slice(3);
      if (clean.endsWith("```")) clean = clean.slice(0, -3);
      analysisData = JSON.parse(clean.trim());
    } catch {
      console.error("Failed to parse AI response:", aiContent);
      throw new Error("AI response was not valid JSON");
    }

    // Determine status based on policy matcher recommendation
    const recommendation = analysisData.policyMatcherResult?.recommendation || "NEEDS_REVIEW";
    let status = "pending_review";
    if (recommendation === "APPROVE") status = "approved";
    else if (recommendation === "LIKELY_DENIED") status = "denied";

    // Save to authorizations table
    const { data: authRecord, error: dbError } = await supabase
      .from("authorizations")
      .insert({
        medicine_id: medicineId,
        patient_name: patientName,
        status,
        diagnosis: diagnosis || "Not specified",
        clinical_justification: analysisData.submissionPackage?.clinicalJustification || "",
        ai_generated_summary: analysisData.overallSummary || "",
        policy_check_result: analysisData.policyMatcherResult?.guidelineMatch || "",
        submission_package: analysisData,
      })
      .select()
      .single();

    if (dbError) {
      console.error("DB insert error:", dbError);
      throw new Error("Failed to save authorization");
    }

    console.log("Authorization created:", authRecord.id);

    return new Response(JSON.stringify({
      success: true,
      authorization: authRecord,
      analysis: analysisData,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
