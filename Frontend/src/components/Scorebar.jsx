import { motion } from "framer-motion";

const colorForScore = (score) => {
  if (score >= 60) return "#639922";
  if (score >= 40) return "#EF9F27";
  return "#E24B4A";
};

export default function ScoreBar({ label, score }) {
  return (
    <div className="flex items-center gap-2.5 mb-2.5">
      <span className="text-[13px] text-gray-500 w-[100px] flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden min-w-0">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="h-full rounded-full"
          style={{ background: colorForScore(score) }}
        />
      </div>
      <span className="text-[13px] font-medium text-gray-900 w-8 text-right">
        {score}%
      </span>
    </div>
  );
}