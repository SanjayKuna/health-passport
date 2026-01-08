import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import ProfileCard from "@/components/dashboard/ProfileCard";
import HealthPulseTracker from "@/components/dashboard/HealthPulseTracker";
import RecentRecords from "@/components/dashboard/RecentRecords";
import QRIdentityCard from "@/components/dashboard/QRIdentityCard";
import MedicineWidget from "@/components/dashboard/MedicineWidget";

const mockUser = {
  name: "Alex Johnson",
  age: 32,
  bloodGroup: "O+",
  height: 175,
  weight: 70,
};

const Dashboard = () => {
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, Alex! 👋</h1>
            <p className="text-muted-foreground">Here's an overview of your health dashboard</p>
          </motion.div>

          <div className="space-y-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ProfileCard user={mockUser} />
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
