import { motion } from "framer-motion";
import { QrCode, Copy, Share2, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const QRIdentityCard = () => {
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
    <Card variant="elevated">
      <CardContent className="p-6">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-6">
          <QrCode className="w-5 h-5 text-primary" />
          Your Health QR
        </h3>

        <div className="flex flex-col items-center">
          <motion.div
            className="relative p-4 bg-white rounded-2xl shadow-lg mb-6"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Placeholder QR code pattern */}
            <div className="w-48 h-48 bg-foreground relative overflow-hidden rounded-lg">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect fill="white" width="100" height="100" />
                {/* QR code pattern simulation */}
                <g fill="black">
                  {/* Position detection patterns */}
                  <rect x="4" y="4" width="20" height="20" />
                  <rect x="7" y="7" width="14" height="14" fill="white" />
                  <rect x="10" y="10" width="8" height="8" />
                  
                  <rect x="76" y="4" width="20" height="20" />
                  <rect x="79" y="7" width="14" height="14" fill="white" />
                  <rect x="82" y="10" width="8" height="8" />
                  
                  <rect x="4" y="76" width="20" height="20" />
                  <rect x="7" y="79" width="14" height="14" fill="white" />
                  <rect x="10" y="82" width="8" height="8" />
                  
                  {/* Data modules (randomized pattern) */}
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
            
            {/* Animated corner accents */}
            <motion.div
              className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
            <motion.div
              className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
            />
          </motion.div>

          <p className="text-sm text-muted-foreground text-center mb-4">
            Doctors can scan this code to view your health summary
          </p>

          <div className="flex gap-2 w-full">
            <Button variant="outline" className="flex-1" onClick={handleCopy}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
            <Button variant="default" className="flex-1" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRIdentityCard;
