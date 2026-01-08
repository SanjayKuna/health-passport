import { motion } from "framer-motion";
import { User, Droplets, Ruler, Weight, Activity, Pill, TestTube, Stethoscope, AlertTriangle, Calendar, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockPatient = {
  name: "Alex Johnson",
  age: 32,
  bloodGroup: "O+",
  height: 175,
  weight: 70,
  allergies: ["Penicillin", "Shellfish"],
  conditions: ["Type 2 Diabetes", "Hypertension"],
  lastUpdated: "2024-03-15",
};

const mockMedicines = [
  { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
  { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
  { name: "Atorvastatin", dosage: "20mg", frequency: "Once daily at bedtime" },
];

const mockDiagnoses = [
  { date: "2024-03-10", diagnosis: "Upper Respiratory Infection", doctor: "Dr. Emily White" },
  { date: "2024-02-15", diagnosis: "Annual Checkup - All Clear", doctor: "Dr. Sarah Johnson" },
];

const mockLabResults = [
  { date: "2024-03-01", test: "HbA1c", value: "6.8%", status: "normal" },
  { date: "2024-03-01", test: "Blood Pressure", value: "125/82 mmHg", status: "normal" },
  { date: "2024-03-01", test: "Cholesterol", value: "195 mg/dL", status: "normal" },
];

const DoctorView = () => {
  const bmi = (mockPatient.weight / Math.pow(mockPatient.height / 100, 2)).toFixed(1);

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card variant="elevated">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <User className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">{mockPatient.name}</h1>
                      <p className="text-muted-foreground">{mockPatient.age} years old</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                    <div className="text-center p-3 rounded-xl bg-muted/50">
                      <Droplets className="w-5 h-5 text-destructive mx-auto mb-1" />
                      <div className="font-bold text-foreground">{mockPatient.bloodGroup}</div>
                      <div className="text-xs text-muted-foreground">Blood Group</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-muted/50">
                      <Ruler className="w-5 h-5 text-primary mx-auto mb-1" />
                      <div className="font-bold text-foreground">{mockPatient.height} cm</div>
                      <div className="text-xs text-muted-foreground">Height</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-muted/50">
                      <Weight className="w-5 h-5 text-accent mx-auto mb-1" />
                      <div className="font-bold text-foreground">{mockPatient.weight} kg</div>
                      <div className="text-xs text-muted-foreground">Weight</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-muted/50">
                      <Activity className="w-5 h-5 text-success mx-auto mb-1" />
                      <div className="font-bold text-foreground">{bmi}</div>
                      <div className="text-xs text-muted-foreground">BMI</div>
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
                      {mockPatient.allergies.map((allergy) => (
                        <span key={allergy} className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-medium">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-warning" />
                      Medical Conditions
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {mockPatient.conditions.map((condition) => (
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

          {/* Current Medications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-primary" />
                  Current Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockMedicines.map((med, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Pill className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{med.name}</div>
                          <div className="text-sm text-muted-foreground">{med.frequency}</div>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                        {med.dosage}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Diagnoses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-accent" />
                  Recent Diagnoses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockDiagnoses.map((diag, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-24">
                        <Calendar className="w-4 h-4" />
                        {new Date(diag.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground">{diag.diagnosis}</div>
                        <div className="text-sm text-muted-foreground">{diag.doctor}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Lab Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="w-5 h-5 text-success" />
                  Latest Lab Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mockLabResults.map((lab, i) => (
                    <div key={i} className="p-4 rounded-xl bg-muted/50 text-center">
                      <div className="text-sm text-muted-foreground mb-1">{lab.test}</div>
                      <div className="text-xl font-bold text-foreground mb-1">{lab.value}</div>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium">
                        Normal
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground pt-6">
            <p>Last updated: {new Date(mockPatient.lastUpdated).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
            <p className="mt-2">Powered by MedScan AI • HIPAA Compliant</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorView;
