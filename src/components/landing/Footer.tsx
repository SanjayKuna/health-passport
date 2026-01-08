import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-12 bg-foreground text-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">MedScan AI</span>
            </div>
            <p className="text-background/60 max-w-sm">
              Your unified healthcare identity platform. Manage, organize, and share your complete medical history with AI-powered precision.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-background/60">
              <li><Link to="/dashboard" className="hover:text-background transition-colors">Dashboard</Link></li>
              <li><Link to="/upload" className="hover:text-background transition-colors">Upload Records</Link></li>
              <li><Link to="/medicines" className="hover:text-background transition-colors">Medicine Manager</Link></li>
              <li><Link to="/qr" className="hover:text-background transition-colors">QR Identity</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-background/60">
              <li><a href="#" className="hover:text-background transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-background/10 text-center text-background/40 text-sm">
          © {new Date().getFullYear()} MedScan AI. All rights reserved. Built with care for your health.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
