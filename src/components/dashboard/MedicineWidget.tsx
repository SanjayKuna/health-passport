import { motion } from "framer-motion";
import { Pill, Clock, AlertCircle, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const medicines = [
  {
    id: 1,
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    status: "active",
    remaining: 12,
  },
  {
    id: 2,
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    status: "active",
    remaining: 8,
  },
  {
    id: 3,
    name: "Aspirin",
    dosage: "81mg",
    frequency: "Once daily",
    status: "completed",
    remaining: 0,
  },
];

const MedicineWidget = () => {
  return (
    <Card variant="elevated">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Pill className="w-5 h-5 text-primary" />
            Current Medicines
          </h3>
          <Link to="/medicines">
            <Button variant="ghost" size="sm" className="text-primary">
              View All
            </Button>
          </Link>
        </div>

        <div className="space-y-3">
          {medicines.map((med, index) => (
            <motion.div
              key={med.id}
              className="flex items-center gap-4 p-3 rounded-xl bg-muted/30"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                med.status === "active" ? "bg-success/10" : "bg-muted"
              }`}>
                {med.status === "active" ? (
                  <Pill className="w-5 h-5 text-success" />
                ) : (
                  <Check className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground">{med.name}</h4>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                    {med.dosage}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {med.frequency}
                </p>
              </div>
              {med.status === "active" && med.remaining <= 10 && (
                <div className="flex items-center gap-1 text-warning">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs font-medium">{med.remaining} left</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicineWidget;
