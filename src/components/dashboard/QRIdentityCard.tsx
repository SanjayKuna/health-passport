import { QrCode, Copy, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ScannableQRCode from "@/components/qr/ScannableQRCode";
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
          <ScannableQRCode value={userQRUrl} size={192} className="mb-6" />

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
