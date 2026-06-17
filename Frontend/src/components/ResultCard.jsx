import { motion } from "framer-motion";
import {
  AlertTriangle,
  HelpCircle,
  Clock,
  CheckCircle,
} from "lucide-react";
import ScoreBar from "./Scorebar";
import { useGlobal } from "../context/GlobalContext.jsx";
import { useEffect } from "react";

const DEFAULT_RESULT = {
  verdict: "uncertain",
  verdictLabel: "No Result",
  confidence: 0,
  scores: [],
  signals: [],
};

const verdictBadgeClass = {
  false: "bg-red-50 text-red-800",
  true: "bg-green-50 text-green-800",
  uncertain: "bg-amber-50 text-amber-800",
};

export default function ResultCard() {
  const { actualtext } = useGlobal();
  useEffect(() => {
  console.log("Context changed:", actualtext);
}, [actualtext]);

  const result = actualtext
  ? {
      verdict:
        actualtext.verdict === "FAKE"
          ? "false"
          : "true",

      verdictLabel:
        actualtext.verdict === "FAKE"
          ? "Fake News"
          : "Real News",

      confidence: Math.round(actualtext.confidence),

      scores: [
        {
          label: "Real Probability",
          score: Math.round(actualtext.real_probability),
        },
        {
          label: "Fake Probability",
          score: Math.round(actualtext.fake_probability),
        },
      ],

      signals: [
        {
          icon:
            actualtext.verdict === "FAKE"
              ? AlertTriangle
              : CheckCircle,
          iconBg:
            actualtext.verdict === "FAKE"
              ? "bg-red-50"
              : "bg-green-50",
          iconColor:
            actualtext.verdict === "FAKE"
              ? "text-red-800"
              : "text-green-800",
          title: "Verdict",
          desc: actualtext.verdict,
        },
        {
          icon: Clock,
          iconBg: "bg-blue-50",
          iconColor: "text-blue-800",
          title: "Confidence",
          desc: `${Math.round(actualtext.confidence)}%`,
        },
      ],
    }
  : DEFAULT_RESULT;

  const {
    verdict,
    verdictLabel,
    confidence,
    scores,
    signals,
  } = result;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.3 }}
      className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <span className="text-[13px] font-medium text-gray-500">
          Analysis Result
        </span>

        <div className="flex items-center gap-2">
          <span
            className={`text-[12px] font-medium px-3 py-1 rounded-full ${
              verdictBadgeClass[verdict]
            }`}
          >
            {verdictLabel}
          </span>

          <span className="text-[12px] text-gray-400">
            {confidence}% confidence
          </span>
        </div>
      </div>

      {/* Probability Score Bars */}
      <div>
        {scores.map((s) => (
          <ScoreBar
            key={s.label}
            label={s.label}
            score={s.score}
          />
        ))}
      </div>

      {/* Signals */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {signals.map((sig, i) => {
          const Icon = sig.icon;

          return (
            <motion.div
              key={sig.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.3 + i * 0.06,
                duration: 0.2,
              }}
              className="bg-gray-50 rounded-lg px-3 py-2.5 flex items-start gap-2.5"
            >
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${sig.iconBg}`}
              >
                <Icon
                  size={13}
                  className={sig.iconColor}
                />
              </div>

              <div>
                <p className="text-[12px] font-medium text-gray-900 mb-0.5">
                  {sig.title}
                </p>

                <span className="text-[11px] text-gray-500">
                  {sig.desc}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}