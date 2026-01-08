import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 gradient-primary" />
      
      {/* Decorative elements */}
      <motion.div
        className="absolute top-10 left-10 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl"
        animate={{ scale: [1.3, 1, 1.3] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Take Control of
            <br />
            Your Health Records?
          </h2>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            Join thousands of users who have simplified their healthcare journey with MedScan AI.
          </p>
          <Link to="/dashboard">
            <Button variant="hero-outline" size="xl" className="group">
              Start Free Today
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
