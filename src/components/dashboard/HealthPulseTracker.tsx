import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface WeightPoint { date: string; weight: number; }
interface SicknessPoint { month: string; incidents: number; }

const HealthPulseTracker = () => {
  const { user } = useAuth();
  const [weightData, setWeightData] = useState<WeightPoint[]>([]);
  const [sicknessData, setSicknessData] = useState<SicknessPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;
    const { data: weights } = await supabase
      .from("weight_history")
      .select("weight, recorded_date")
      .eq("user_id", user.id)
      .order("recorded_date", { ascending: true });

    if (weights && weights.length > 0) {
      setWeightData(weights.map((w) => ({
        date: new Date(w.recorded_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        weight: Number(w.weight),
      })));
    }

    const { data: meds } = await supabase
      .from("medicines")
      .select("created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (meds && meds.length > 0) {
      const monthMap: Record<string, number> = {};
      meds.forEach((m) => {
        const d = new Date(m.created_at);
        const key = d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
        monthMap[key] = (monthMap[key] || 0) + 1;
      });
      setSicknessData(Object.entries(monthMap).map(([month, incidents]) => ({ month, incidents })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const channel = supabase
      .channel("health-pulse")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "weight_history" }, () => fetchData())
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "medicines" }, () => fetchData())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  if (loading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  const weightDiff = weightData.length >= 2 ? (weightData[weightData.length - 1].weight - weightData[0].weight).toFixed(1) : null;
  const totalIncidents = sicknessData.reduce((sum, d) => sum + d.incidents, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card variant="elevated">
          <CardHeader><CardTitle className="flex items-center gap-2"><span className="w-3 h-3 rounded-full gradient-primary" />Weight Trend</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              {weightData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">No weight data yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                    <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: "hsl(var(--primary))", strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: "hsl(var(--primary))" }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{weightData.length} records</span>
              {weightDiff !== null && (
                <span className={`font-medium ${Number(weightDiff) <= 0 ? "text-success" : "text-destructive"}`}>
                  {Number(weightDiff) > 0 ? "↑" : "↓"} {Math.abs(Number(weightDiff))} kg
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card variant="elevated">
          <CardHeader><CardTitle className="flex items-center gap-2"><span className="w-3 h-3 rounded-full gradient-accent" />Sickness Incidents</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              {sicknessData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">No records yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sicknessData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                    <Bar dataKey="incidents" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total records</span>
              <span className="text-accent font-medium">{totalIncidents} incidents</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default HealthPulseTracker;
