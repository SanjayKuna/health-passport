import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Droplets, Ruler, Weight, Activity, Pill, AlertTriangle, Heart, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const defaultProfile = {
  name: "Unknown",
  age: 0,
  bloodGroup: "N/A",
  height: 0,
  weight: 0,
  allergies: [] as string[],
  conditions: [] as string[],
};

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  status: string;
  purpose: string | null;
  prescribed_by: string | null;
  start_date: string | null;
}

const DoctorView = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [profileData, setProfileData] = useState(defaultProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [medsResult, profileResult] = await Promise.all([
        supabase
          .from("medicines")
          .select("id, name, dosage, frequency, status, purpose, prescribed_by, start_date")
          .order("created_at", { ascending: false }),
        supabase
          .from("patient_profiles")
          .select("*")
          .order("updated_at", { ascending: false })
          .limit(1),
      ]);

      if (!medsResult.error && medsResult.data) {
        setMedicines(medsResult.data);
      }
      if (profileResult.data && profileResult.data.length > 0) {
        const p = profileResult.data[0];
        setProfileData({
          name: p.name,
          age: p.age || 0,
          bloodGroup: p.blood_group || "N/A",
          height: p.height ? Number(p.height) : 0,
          weight: p.weight ? Number(p.weight) : 0,
          allergies: [],
          conditions: [],
        });
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { label: "Underweight", color: "text-warning" };
    if (bmi < 25) return { label: "Normal", color: "text-success" };
    if (bmi < 30) return { label: "Overweight", color: "text-warning" };
    return { label: "Obese", color: "text-destructive" };
  };
  const bmi = profileData.height > 0 ? (profileData.weight / Math.pow(profileData.height / 100, 2)).toFixed(1) : "0";
  const bmiStatus = getBMIStatus(parseFloat(bmi));

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="gradient-primary py-8 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-primary-foreground" />
            <span className="text-2xl font-bold text-primary-foreground">MedScan AI</span>
          </div>
          <p className="text-primary-foreground/80">Patient Health Summary</p>
        </div>
      </div>

      <main className="py-8 px-6">
        <div className="container mx-auto max-w-4xl space-y-6">
          {/* Patient Profile */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card variant="elevated">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <User className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">{profileData.name}</h1>
                      <p className="text-muted-foreground">{profileData.age} years old</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                    <div className="text-center p-3 rounded-xl bg-muted/50">
                      <Droplets className="w-5 h-5 text-destructive mx-auto mb-1" />
                      <div className="font-bold text-foreground">{profileData.bloodGroup}</div>
                      <div className="text-xs text-muted-foreground">Blood Group</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-muted/50">
                      <Ruler className="w-5 h-5 text-primary mx-auto mb-1" />
                      <div className="font-bold text-foreground">{profileData.height} cm</div>
                      <div className="text-xs text-muted-foreground">Height</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-muted/50">
                      <Weight className="w-5 h-5 text-accent mx-auto mb-1" />
                      <div className="font-bold text-foreground">{profileData.weight} kg</div>
                      <div className="text-xs text-muted-foreground">Weight</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-muted/50">
                      <Activity className={`w-5 h-5 ${bmiStatus.color} mx-auto mb-1`} />
                      <div className="font-bold text-foreground">{bmi}</div>
                      <div className="text-xs text-muted-foreground">BMI</div>
                      <div className={`text-xs font-medium ${bmiStatus.color}`}>{bmiStatus.label}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                      Known Allergies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profileData.allergies.map((allergy) => (
                        <span key={allergy} className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-medium">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-warning" />
                      Medical Conditions
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profileData.conditions.map((condition) => (
                        <span key={condition} className="px-3 py-1 rounded-full bg-warning/10 text-warning text-sm font-medium">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Current Medications - Real Data */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-primary" />
                  Current Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : medicines.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No medications on record.</p>
                ) : (
                  <div className="space-y-3">
                    {medicines.map((med) => (
                      <div key={med.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Pill className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{med.name}</div>
                            <div className="text-sm text-muted-foreground">{med.frequency}</div>
                            {med.purpose && <div className="text-xs text-muted-foreground">{med.purpose}</div>}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm">
                            {med.dosage}
                          </span>
                          <div className="text-xs text-muted-foreground mt-1 capitalize">{med.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground pt-6">
            <p>Powered by MedScan AI • HIPAA Compliant</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorView;
