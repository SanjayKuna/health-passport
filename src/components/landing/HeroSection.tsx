import { motion } from "framer-motion";
import { Heart, Shield, Scan, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary-foreground/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Floating icons */}
      <motion.div
        className="absolute top-32 left-[15%] p-4 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Heart className="w-8 h-8 text-primary-foreground" />
      </motion.div>
      <motion.div
        className="absolute top-48 right-[20%] p-4 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Shield className="w-8 h-8 text-primary-foreground" />
      </motion.div>
      <motion.div
        className="absolute bottom-32 left-[25%] p-4 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <Scan className="w-8 h-8 text-primary-foreground" />
      </motion.div>
      <motion.div
        className="absolute bottom-48 right-[15%] p-4 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm"
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <Activity className="w-8 h-8 text-primary-foreground" />
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            <span className="text-sm text-primary-foreground/90 font-medium">AI-Powered Healthcare Identity</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-primary-foreground mb-6 leading-tight">
            Your Complete
            <br />
            <span className="relative">
              Medical Identity
              <motion.span
                className="absolute -bottom-2 left-0 w-full h-1 bg-primary-foreground/30 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              />
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload medical records, let AI organize everything, and share your health history with doctors instantly via QR code.
          </p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link to="/signup">
              <Button variant="hero-outline" size="xl">
                Get Started Free
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="glass" size="xl" className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20">
                View Demo
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {[
            { value: "99.9%", label: "Data Security" },
            { value: "50K+", label: "Users Trust Us" },
            { value: "<2s", label: "AI Processing" },
            { value: "24/7", label: "Always Available" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-primary-foreground/60">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
