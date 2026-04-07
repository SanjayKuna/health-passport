import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pill, Clock, Calendar, AlertCircle, CheckCircle, Search, Plus, MoreHorizontal, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  status: string;
  purpose: string;
  prescribed_by: string;
  start_date: string;
  additional_notes: string;
  created_at: string;
}

const MedicinesPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed" | "paused">("all");
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchMedicines();
  }, [user]);

  const fetchMedicines = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("medicines")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching medicines:", error);
    } else {
      setMedicines((data as Medicine[]) || []);
    }
    setLoading(false);
  };

  const filteredMedicines = medicines.filter((med) => {
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || med.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            Active
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        );
      case "paused":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-warning" />
            Paused
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Medicine Manager</h1>
              <p className="text-muted-foreground">
                Track and manage all your medications in one place
              </p>
            </div>
            <Link to="/upload">
              <Button variant="hero">
                <Plus className="w-4 h-4 mr-2" />
                Add Medicine
              </Button>
            </Link>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
          >
            {[
              { label: "Total", value: medicines.length, color: "text-primary" },
              { label: "Active", value: medicines.filter((m) => m.status === "active").length, color: "text-success" },
              { label: "Completed", value: medicines.filter((m) => m.status === "completed").length, color: "text-muted-foreground" },
            ].map((stat, i) => (
              <Card key={i} variant="stat">
                <CardContent className="p-4 text-center">
                  <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 mb-6"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search medicines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "active", "completed", "paused"] as const).map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setFilter(f)}
                  className="capitalize"
                >
                  {f}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {/* Medicine List */}
          {!loading && (
            <div className="space-y-4">
              {filteredMedicines.map((medicine, index) => (
                <motion.div
                  key={medicine.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Card variant="elevated" className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                            medicine.status === "active" ? "bg-primary/10" : "bg-muted"
                          }`}>
                            <Pill className={`w-7 h-7 ${
                              medicine.status === "active" ? "text-primary" : "text-muted-foreground"
                            }`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-lg font-bold text-foreground">{medicine.name}</h3>
                              <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-sm font-medium">
                                {medicine.dosage}
                              </span>
                              {getStatusBadge(medicine.status)}
                            </div>
                            {medicine.purpose && (
                              <p className="text-sm text-muted-foreground">{medicine.purpose}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {medicine.frequency}
                          </div>
                          {medicine.start_date && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              Since {new Date(medicine.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </div>
                          )}
                        </div>
                      </div>

                      {(medicine.prescribed_by || medicine.additional_notes) && (
                        <div className="mt-4 pt-4 border-t border-border">
                          {medicine.prescribed_by && medicine.prescribed_by !== "Not specified" && (
                            <p className="text-sm text-muted-foreground">
                              Patient: <span className="text-foreground font-medium">{medicine.prescribed_by}</span>
                            </p>
                          )}
                          {medicine.additional_notes && (
                            <p className="text-sm text-muted-foreground mt-1">{medicine.additional_notes}</p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && filteredMedicines.length === 0 && (
            <Card variant="elevated" className="mt-8">
              <CardContent className="p-12 text-center">
                <Pill className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No medicines found</h3>
                <p className="text-muted-foreground mb-4">
                  {medicines.length === 0
                    ? "Upload a prescription to get started"
                    : "Try adjusting your search or filter"}
                </p>
                {medicines.length === 0 && (
                  <Link to="/upload">
                    <Button variant="hero">
                      <Plus className="w-4 h-4 mr-2" />
                      Upload Prescription
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default MedicinesPage;
