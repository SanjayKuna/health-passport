import { motion } from "framer-motion";
import QRCode from "react-qr-code";

interface ScannableQRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

const ScannableQRCode = ({ value, size = 192, className = "" }: ScannableQRCodeProps) => {
  return (
    <motion.div
      className={`relative rounded-3xl p-4 shadow-xl ${className}`}
      style={{ backgroundColor: "#FFFFFF" }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="rounded-xl p-3" style={{ backgroundColor: "#FFFFFF" }}>
        <QRCode
          value={value}
          size={size}
          level="H"
          bgColor="#FFFFFF"
          fgColor="#000000"
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        />
      </div>

      <motion.div
        className="absolute top-0 left-0 h-6 w-6 rounded-tl-lg border-l-4 border-t-4 border-primary"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-0 right-0 h-6 w-6 rounded-tr-lg border-r-4 border-t-4 border-primary"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      />
      <motion.div
        className="absolute bottom-0 left-0 h-6 w-6 rounded-bl-lg border-b-4 border-l-4 border-primary"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      />
      <motion.div
        className="absolute bottom-0 right-0 h-6 w-6 rounded-br-lg border-b-4 border-r-4 border-primary"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
      />
    </motion.div>
  );
};

export default ScannableQRCode;