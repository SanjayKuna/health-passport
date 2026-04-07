import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Pill, Clock, ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface RecentMedicine {
  id: string; name: string; dosage: string; prescribed_by: string | null; created_at: string;
}

const RecentRecords = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<RecentMedicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchRecords = async () => {
      const { data, error } = await supabase
        .from("medicines")
        .select("id, name, dosage, prescribed_by, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      if (!error && data) setRecords(data as RecentMedicine[]);
      setLoading(false);
    };
    fetchRecords();
  }, [user]);

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <Card variant="elevated">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> Recent Records
          </h3>
          <Link to="/medicines"><Button variant="ghost" size="sm" className="text-primary">View All <ArrowRight className="w-4 h-4 ml-1" /></Button></Link>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : records.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No records yet. Upload a prescription to get started.</p>
        ) : (
          <div className="space-y-4">
            {records.map((record, index) => (
              <motion.div key={record.id} className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"><Pill className="w-6 h-6 text-primary" /></div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground truncate">{record.name} — {record.dosage}</h4>
                  <p className="text-sm text-muted-foreground">{record.prescribed_by && record.prescribed_by !== "Not specified" ? record.prescribed_by : "Uploaded prescription"}</p>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground flex-shrink-0"><Clock className="w-4 h-4" />{getTimeAgo(record.created_at)}</div>
              </motion.div>
            ))}
          </div>
        )}
        <Link to="/upload" className="block mt-6"><Button className="w-full" variant="outline"><FileText className="w-4 h-4 mr-2" />Upload New Record</Button></Link>
      </CardContent>
    </Card>
  );
};

export default RecentRecords;
