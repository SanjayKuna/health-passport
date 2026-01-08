import { motion } from "framer-motion";
import { FileText, Brain, QrCode, Pill, Activity, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: FileText,
    title: "Smart Upload",
    description: "Upload photos of prescriptions, lab reports, or any medical document. Our AI handles the rest.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Brain,
    title: "AI Classification",
    description: "Gemini AI automatically extracts and categorizes data into medicines, diagnoses, and lab results.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: QrCode,
    title: "QR Identity",
    description: "Generate a unique QR code that doctors can scan to instantly access your complete health summary.",
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    icon: Pill,
    title: "Medicine Manager",
    description: "Automatically extract medicine names and dosages. Never forget your medications again.",
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    icon: Activity,
    title: "Health Pulse",
    description: "Track your health trends with visual dashboards showing sickness patterns and weight changes.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your health data is encrypted and only accessible by you and those you choose to share with.",
    color: "text-success",
    bg: "bg-success/10",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Everything You Need
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A unified platform to manage, organize, and share your complete medical history with ease.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="elevated" className="h-full">
                <CardContent className="p-8">
                  <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6`}>
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
