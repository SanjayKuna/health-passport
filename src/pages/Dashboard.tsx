import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import ProfileCard from "@/components/dashboard/ProfileCard";
import HealthPulseTracker from "@/components/dashboard/HealthPulseTracker";
import RecentRecords from "@/components/dashboard/RecentRecords";
import QRIdentityCard from "@/components/dashboard/QRIdentityCard";
import MedicineWidget from "@/components/dashboard/MedicineWidget";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const defaultUser = {
  name: "No Profile",
  age: 0,
  bloodGroup: "N/A",
  height: 0,
  weight: 0,
};

const Dashboard = () => {
  const [user, setUser] = useState(defaultUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("patient_profiles")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        const p = data[0];
        setUser({
          name: p.name,
          age: p.age || 0,
          bloodGroup: p.blood_group || "N/A",
          height: p.height ? Number(p.height) : 0,
          weight: p.weight ? Number(p.weight) : 0,
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user.name}! 👋</h1>
            <p className="text-muted-foreground">Here's an overview of your health dashboard</p>
          </motion.div>

          <div className="space-y-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ProfileCard user={user} />
            </motion.div>

            {/* Health Pulse Charts */}
            <HealthPulseTracker />

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RecentRecords />
              </div>
              <div className="space-y-6">
                <QRIdentityCard />
                <MedicineWidget />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
