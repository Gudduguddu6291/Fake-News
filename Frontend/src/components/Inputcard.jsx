import { useState } from "react";
import { motion } from "framer-motion";
import { Radar } from "lucide-react";

const TABS = ["Paste text", "Enter URL", "Upload file"];
const MAX_CHARS = 5000;

export default function InputCard({ onAnalyze = () => {}, loading = false }) {
  const [activeTab, setActiveTab] = useState(0);
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim() || loading) return;
    onAnalyze(text);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.3 }}
      className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 mb-4"
    >
      {/* Tabs */}
      <div className="flex gap-1 mb-3.5 flex-wrap">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`text-[13px] px-3 py-1.5 rounded-lg border transition-all duration-150 ${
              activeTab === i
                ? "bg-gray-100 text-gray-900 border-gray-200"
                : "text-gray-500 border-transparent hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Textarea */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
        placeholder="Paste a news article, headline, or claim here to check its credibility…"
        rows={5}
        className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[14px] text-gray-900 bg-gray-50 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#185FA5]/30 focus:border-[#185FA5] transition-all leading-relaxed"
      />

      {/* Footer */}
      <div className="flex items-center justify-between mt-2.5 gap-2 flex-wrap sm:flex-nowrap">
        <span className="text-[12px] text-gray-400 sm:text-left text-center w-full sm:w-auto">
          {text.length} / {MAX_CHARS} characters
        </span>
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || loading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 text-[13px] font-medium px-5 py-2 rounded-lg bg-[#185FA5] text-white hover:bg-[#145088] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
            />
          ) : (
            <Radar size={15} />
          )}
          {loading ? "Analyzing…" : "Analyze content"}
        </button>
      </div>
    </motion.div>
  );
}