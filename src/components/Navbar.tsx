import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Menu, X, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/upload", label: "Upload" },
  { href: "/medicines", label: "Medicines" },
  { href: "/qr", label: "QR Code" },
  { href: "/insurance", label: "Insurance" },
];

interface NavbarProps {
  variant?: "default" | "transparent";
}

const Navbar = ({ variant = "default" }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const isTransparent = variant === "transparent";

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/login");
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${isTransparent ? "bg-transparent" : "bg-background/80 backdrop-blur-xl border-b border-border"}`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className={`w-9 h-9 rounded-lg ${isTransparent ? "bg-primary-foreground/20" : "gradient-primary"} flex items-center justify-center`}>
              <Heart className={`w-5 h-5 text-primary-foreground`} />
            </div>
            <span className={`text-lg font-bold ${isTransparent ? "text-primary-foreground" : "text-foreground"}`}>
              MedScan AI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.href
                    ? isTransparent
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-primary/10 text-primary"
                    : isTransparent
                    ? "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <span className={`text-sm font-medium ${isTransparent ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {user.user_metadata?.full_name || user.email}
                </span>
                <Button variant={isTransparent ? "hero-outline" : "outline"} size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-1" /> Sign Out
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant={isTransparent ? "hero-outline" : "default"} size="sm">
                  Get Started
                </Button>
              </Link>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg ${isTransparent ? "text-primary-foreground hover:bg-primary-foreground/10" : "text-foreground hover:bg-muted"}`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-border"
          >
            <div className="container mx-auto px-6 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <Button className="w-full mt-4" variant="outline" onClick={() => { setIsOpen(false); handleSignOut(); }}>
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </Button>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button className="w-full mt-4">Get Started</Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
