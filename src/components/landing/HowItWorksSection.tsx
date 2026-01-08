import { motion } from "framer-motion";
import { Upload, Sparkles, Share2 } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your Records",
    description: "Take a photo or upload images of your prescriptions, lab reports, or medical documents.",
  },
  {
    icon: Sparkles,
    step: "02",
    title: "AI Does the Magic",
    description: "Our AI reads, extracts, and organizes all the information automatically into structured categories.",
  },
  {
    icon: Share2,
    step: "03",
    title: "Share with QR Code",
    description: "Generate your unique health QR code. Doctors scan it to see your complete medical history instantly.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to revolutionize how you manage your health records.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              className="relative text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="relative inline-flex mb-8">
                <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25">
                  <step.icon className="w-10 h-10 text-primary-foreground" />
                </div>
                <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm font-bold flex items-center justify-center shadow-md">
                  {step.step}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
