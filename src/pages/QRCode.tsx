import { motion } from "framer-motion";
import { QrCode, Copy, Share2, Download, Printer, Shield, Eye } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const QRCodePage = () => {
  const userQRUrl = `${window.location.origin}/doctor-view/demo`;

  const handleCopy = () => {
    navigator.clipboard.writeText(userQRUrl);
    toast.success("Link copied to clipboard!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "My MedScan Profile",
        text: "View my medical history",
        url: userQRUrl,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">Your Health QR Identity</h1>
            <p className="text-muted-foreground">
              Share your complete medical history instantly with healthcare providers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* QR Code Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card variant="elevated" className="overflow-hidden">
                <div className="h-4 gradient-primary" />
                <CardContent className="p-8">
                  <div className="flex flex-col items-center">
                    <motion.div
                      className="relative p-6 bg-white rounded-3xl shadow-xl mb-8"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {/* QR Code */}
                      <div className="w-64 h-64 bg-foreground relative overflow-hidden rounded-xl">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <rect fill="white" width="100" height="100" />
                          <g fill="black">
                            <rect x="4" y="4" width="20" height="20" />
                            <rect x="7" y="7" width="14" height="14" fill="white" />
                            <rect x="10" y="10" width="8" height="8" />
                            
                            <rect x="76" y="4" width="20" height="20" />
                            <rect x="79" y="7" width="14" height="14" fill="white" />
                            <rect x="82" y="10" width="8" height="8" />
                            
                            <rect x="4" y="76" width="20" height="20" />
                            <rect x="7" y="79" width="14" height="14" fill="white" />
                            <rect x="10" y="82" width="8" height="8" />
                            
                            <rect x="30" y="10" width="4" height="4" />
                            <rect x="38" y="10" width="4" height="4" />
                            <rect x="50" y="10" width="4" height="4" />
                            <rect x="58" y="10" width="4" height="4" />
                            <rect x="30" y="18" width="4" height="4" />
                            <rect x="42" y="18" width="4" height="4" />
                            <rect x="54" y="18" width="4" height="4" />
                            <rect x="62" y="18" width="4" height="4" />
                            
                            <rect x="30" y="30" width="4" height="4" />
                            <rect x="38" y="34" width="4" height="4" />
                            <rect x="46" y="30" width="4" height="4" />
                            <rect x="54" y="38" width="4" height="4" />
                            <rect x="62" y="34" width="4" height="4" />
                            <rect x="70" y="30" width="4" height="4" />
                            
                            <rect x="30" y="46" width="40" height="8" />
                            
                            <rect x="30" y="58" width="4" height="4" />
                            <rect x="42" y="62" width="4" height="4" />
                            <rect x="54" y="58" width="4" height="4" />
                            <rect x="66" y="62" width="4" height="4" />
                            <rect x="78" y="58" width="4" height="4" />
                            <rect x="86" y="66" width="4" height="4" />
                            
                            <rect x="30" y="74" width="4" height="4" />
                            <rect x="38" y="78" width="4" height="4" />
                            <rect x="50" y="74" width="4" height="4" />
                            <rect x="62" y="78" width="4" height="4" />
                            <rect x="78" y="74" width="4" height="4" />
                            <rect x="86" y="82" width="4" height="4" />
                            <rect x="78" y="86" width="4" height="4" />
                            <rect x="86" y="90" width="4" height="4" />
                          </g>
                        </svg>
                      </div>

                      {/* Corner accents */}
                      <motion.div
                        className="absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <motion.div
                        className="absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      />
                      <motion.div
                        className="absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      />
                      <motion.div
                        className="absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                      />
                    </motion.div>

                    <p className="text-center text-muted-foreground mb-6 max-w-xs">
                      Scan this QR code to access your complete medical profile
                    </p>

                    <div className="grid grid-cols-2 gap-3 w-full">
                      <Button variant="outline" onClick={handleCopy}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Link
                      </Button>
                      <Button variant="outline" onClick={handleShare}>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline">
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Info Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-2">Privacy Protected</h3>
                      <p className="text-sm text-muted-foreground">
                        Your data is encrypted and only accessible through this unique QR code. You control who sees your information.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                      <Eye className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-2">What Doctors See</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        When scanned, healthcare providers see a summary of your:
                      </p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          Profile & vital information (blood group, BMI)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          Current medications and dosages
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          Recent diagnoses and lab results
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          Known allergies and conditions
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <QrCode className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-2">Preview Your Profile</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        See exactly what doctors will see when they scan your QR code.
                      </p>
                      <Link to="/doctor-view/demo">
                        <Button variant="accent">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview Doctor's View
                        </Button>
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
