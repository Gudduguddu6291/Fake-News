import { motion } from "framer-motion";
import {AlertTriangle, Link, HelpCircle, Clock,} from "lucide-react";
import ScoreBar from "./Scorebar";

const DEFAULT_RESULT = {
  verdict: "likely-false",
  verdictLabel: "Likely false",
  confidence: 87,
  scores: [
    { label: "Credibility", score: 18 },
    { label: "Source trust", score: 32 },
    { label: "Factual match", score: 22 },
    { label: "Tone neutrality", score: 55 },
  ],
  signals: [
    {
      icon: AlertTriangle,
      iconBg: "bg-red-50",
      iconColor: "text-red-800",
      title: "Sensational language",
      desc: "Emotionally charged phrasing detected",
    },
    {
      icon: Link,
      iconBg: "bg-red-50",
      iconColor: "text-red-800",
      title: "No citations found",
      desc: "Claims lack verifiable sources",
    },
    {
      icon: HelpCircle,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-800",
      title: "Unknown author",
      desc: "Byline could not be verified",
    },
    {
      icon: Clock,
      iconBg: "bg-green-50",
      iconColor: "text-green-800",
      title: "Recent timestamp",
      desc: "Published within last 24 hours",
    },
  ],
};

const verdictBadgeClass = {
  "likely-false": "bg-red-50 text-red-800",
  "likely-true": "bg-green-50 text-green-800",
  uncertain: "bg-amber-50 text-amber-800",
};

export default function ResultCard({ result = DEFAULT_RESULT }) {
  const { verdict, verdictLabel, confidence, scores, signals } = result;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.3 }}
      className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <span className="text-[13px] font-medium text-gray-500">Analysis result</span>
        <div className="flex items-center gap-2">
          <span
            className={`text-[12px] font-medium px-3 py-1 rounded-full ${verdictBadgeClass[verdict] ?? verdictBadgeClass["uncertain"]}`}
          >
            {verdictLabel}
          </span>
          <span className="text-[12px] text-gray-400">{confidence}% confidence</span>
        </div>
      </div>

      {/* Score bars */}
      <div>
        {scores.map((s) => (
          <ScoreBar key={s.label} label={s.label} score={s.score} />
        ))}
      </div>

      {/* Signals grid */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {signals.map((sig, i) => {
          const Icon = sig.icon;
          return (
            <motion.div
              key={sig.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.06, duration: 0.2 }}
              className="bg-gray-50 rounded-lg px-3 py-2.5 flex items-start gap-2.5"
            >
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${sig.iconBg}`}
              >
                <Icon size={13} className={sig.iconColor} />
              </div>
              <div>
                <p className="text-[12px] font-medium text-gray-900 mb-0.5">{sig.title}</p>
                <span className="text-[11px] text-gray-500">{sig.desc}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}