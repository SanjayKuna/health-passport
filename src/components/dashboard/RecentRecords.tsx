import { motion } from "framer-motion";
import { FileText, Pill, TestTube, Stethoscope, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const recentRecords = [
  {
    id: 1,
    type: "prescription",
    title: "General Checkup Prescription",
    doctor: "Dr. Sarah Johnson",
    date: "2 days ago",
    icon: Pill,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    id: 2,
    type: "lab",
    title: "Blood Test Results",
    doctor: "City Lab Center",
    date: "1 week ago",
    icon: TestTube,
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    id: 3,
    type: "diagnosis",
    title: "ENT Consultation",
    doctor: "Dr. Michael Chen",
    date: "2 weeks ago",
    icon: Stethoscope,
    color: "text-accent",
    bg: "bg-accent/10",
  },
];

const RecentRecords = () => {
  return (
    <Card variant="elevated">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Recent Records
          </h3>
          <Link to="/upload">
            <Button variant="ghost" size="sm" className="text-primary">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {recentRecords.map((record, index) => (
            <motion.div
              key={record.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`w-12 h-12 rounded-xl ${record.bg} flex items-center justify-center flex-shrink-0`}>
                <record.icon className={`w-6 h-6 ${record.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground truncate">{record.title}</h4>
                <p className="text-sm text-muted-foreground">{record.doctor}</p>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground flex-shrink-0">
                <Clock className="w-4 h-4" />
                {record.date}
              </div>
            </motion.div>
          ))}
        </div>

        <Link to="/upload" className="block mt-6">
          <Button className="w-full" variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Upload New Record
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default RecentRecords;
