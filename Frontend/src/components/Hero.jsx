import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="text-center px-5 pt-8 pb-5 sm:pt-10"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="inline-flex items-center gap-1.5 text-[12px] px-3 py-1 rounded-full bg-blue-50 text-blue-700 mb-3"
      >
        <Sparkles size={13} />
        AI-powered verification
      </motion.div>

      <h1 className="text-[22px] sm:text-[26px] font-medium text-gray-900 leading-snug mb-2">
        Detect misinformation instantly
      </h1>
      <p className="text-[14px] text-gray-500 max-w-[480px] mx-auto leading-relaxed">
        Paste any article, headline, or URL. Our model analyzes credibility
        signals, source reliability, and linguistic patterns in seconds.
      </p>
    </motion.div>
  );
}