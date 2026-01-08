import { motion } from "framer-motion";
import { User, Droplets, Ruler, Weight, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileCardProps {
  user: {
    name: string;
    age: number;
    bloodGroup: string;
    height: number; // cm
    weight: number; // kg
  };
}

const ProfileCard = ({ user }: ProfileCardProps) => {
  const bmi = (user.weight / Math.pow(user.height / 100, 2)).toFixed(1);
  
  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { label: "Underweight", color: "text-warning" };
    if (bmi < 25) return { label: "Normal", color: "text-success" };
    if (bmi < 30) return { label: "Overweight", color: "text-warning" };
    return { label: "Obese", color: "text-destructive" };
  };

  const bmiStatus = getBMIStatus(parseFloat(bmi));

  const stats = [
    { icon: Droplets, label: "Blood Group", value: user.bloodGroup, color: "text-destructive" },
    { icon: Ruler, label: "Height", value: `${user.height} cm`, color: "text-primary" },
    { icon: Weight, label: "Weight", value: `${user.weight} kg`, color: "text-accent" },
    { icon: Activity, label: "BMI", value: bmi, color: bmiStatus.color, sublabel: bmiStatus.label },
  ];

  return (
    <Card variant="elevated" className="overflow-hidden">
      <div className="h-24 gradient-primary relative">
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
      </div>
      
      <CardContent className="pt-0 -mt-12">
        <div className="flex items-end gap-4 mb-6">
          <div className="w-24 h-24 rounded-2xl bg-background border-4 border-background shadow-lg flex items-center justify-center">
            <User className="w-12 h-12 text-muted-foreground" />
          </div>
          <div className="pb-2">
            <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
            <p className="text-muted-foreground">{user.age} years old</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="p-4 rounded-xl bg-muted/50 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
              <div className="text-lg font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
              {stat.sublabel && (
                <div className={`text-xs font-medium ${stat.color} mt-1`}>{stat.sublabel}</div>
              )}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
