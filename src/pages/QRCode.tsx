import { motion } from "framer-motion";
import { QrCode, Copy, Share2, Download, Printer, Shield, Eye } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ScannableQRCode from "@/components/qr/ScannableQRCode";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const QRCodePage = () => {
  const { user } = useAuth();
  const userQRUrl = `${window.location.origin}/doctor-view/${user?.id || "demo"}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(userQRUrl);
    toast.success("Link copied to clipboard!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: "My MedScan Profile", text: "View my medical history", url: userQRUrl });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Your Health QR Identity</h1>
            <p className="text-muted-foreground">Share your complete medical history instantly with healthcare providers</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card variant="elevated" className="overflow-hidden">
                <div className="h-4 gradient-primary" />
                <CardContent className="p-8">
                  <div className="flex flex-col items-center">
                    <ScannableQRCode value={userQRUrl} size={256} className="mb-8" />
                    <p className="text-center text-muted-foreground mb-6 max-w-xs">Scan this QR code to access your complete medical profile</p>
                    <div className="grid grid-cols-2 gap-3 w-full">
                      <Button variant="outline" onClick={handleCopy}><Copy className="w-4 h-4 mr-2" />Copy Link</Button>
                      <Button variant="outline" onClick={handleShare}><Share2 className="w-4 h-4 mr-2" />Share</Button>
                      <Button variant="outline"><Download className="w-4 h-4 mr-2" />Download</Button>
                      <Button variant="outline"><Printer className="w-4 h-4 mr-2" />Print</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"><Shield className="w-6 h-6 text-primary" /></div>
                    <div>
                      <h3 className="font-bold text-foreground mb-2">Privacy Protected</h3>
                      <p className="text-sm text-muted-foreground">Your data is encrypted and only accessible through this unique QR code. You control who sees your information.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0"><Eye className="w-6 h-6 text-success" /></div>
                    <div>
                      <h3 className="font-bold text-foreground mb-2">What Doctors See</h3>
                      <p className="text-sm text-muted-foreground mb-4">When scanned, healthcare providers see a summary of your:</p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" />Profile & vital information (blood group, BMI)</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" />Current medications and dosages</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" />Recent diagnoses and lab results</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0"><QrCode className="w-6 h-6 text-accent" /></div>
                    <div>
                      <h3 className="font-bold text-foreground mb-2">Preview Your Profile</h3>
                      <p className="text-sm text-muted-foreground mb-4">See exactly what doctors will see when they scan your QR code.</p>
                      <Link to={`/doctor-view/${user?.id || "demo"}`}>
                        <Button variant="accent"><Eye className="w-4 h-4 mr-2" />Preview Doctor's View</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QRCodePage;
