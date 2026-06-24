import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {ShieldCheck, History, ChevronDown, X, User, Sparkles,} from "lucide-react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setUserData } from "../redux/userSlice";
import { useGlobal } from "../context/GlobalContext.jsx";
import { serverUrl } from "../App";

const verdictBadgeClass = {
  false: "bg-red-50 text-red-800",
  true: "bg-green-50 text-green-800",
  uncertain: "bg-amber-50 text-amber-800",
};

const getVerdictLabel = (verdict) => {
  const value = String(verdict).toLowerCase();
  if (verdict === true || value === "true" || value === "real") return "Credible";
  if (verdict === false || value === "false" || value === "fake") return "False";
  return "Uncertain";
};

const normalizeVerdict = (verdict) => {
  const value = String(verdict).toLowerCase();
  if (verdict === true || value === "true" || value === "real") return "true";
  if (verdict === false || value === "false" || value === "fake") return "false";
  return "uncertain";
};

const formatHistoryTime = (item) => {
  if (item.time) return item.time;
  if (item.createdAt) return new Date(item.createdAt).toLocaleString();
  return "Just now";
};

export default function Navbar() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const { history, setHistory, setactualText } = useGlobal();

  useEffect(() => {
    const loadHistory = async () => {
      if (!userData) {
        setHistory([]);
        return;
      }

      try {
        const response = await axios.get(`${serverUrl}/api/user/history`, {
          withCredentials: true,
        });
        setHistory(response.data);
      } catch (err) {
        console.log("Error fetching prediction history:", err);
      }
    };

    loadHistory();
  }, [userData, setHistory]);

  const handleLogin = async () => {
    try{
      const result = await signInWithPopup(auth, provider);
      const response = await axios.post(`${serverUrl}/api/auth/googleauth`, {
        firebaseUid: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        avatar: result.user.photoURL,
      }, { withCredentials: true });
      dispatch(setUserData(response.data.user));
      console.log("User logged in:");
    }
    catch(err){
      console.log(err);
    }
  }

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      await signOut(auth);
      setHistory([]);
      setactualText(null);
      dispatch(clearUser());
      console.log("User logged out:");
    }
    catch(err){
      console.log(err);
    }
  }

  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* ── Main nav ── */}
      <nav className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-white">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#185FA5] flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={15} color="#fff" />
          </div>
          <span className="text-[15px] font-medium text-gray-900">FactGuard</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button className="hidden sm:block text-[13px] text-gray-500 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors">
            How it works
          </button>
          <button className="hidden sm:block text-[13px] text-gray-500 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors">
            About
          </button>
          {userData ? (
            <button className="hidden sm:flex items-center gap-1.5 text-[13px] font-medium px-4 py-1.5 rounded-lg bg-[#185FA5] text-white hover:bg-[#145088] transition-colors" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <button className="hidden sm:flex items-center gap-1.5 text-[13px] font-medium px-4 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 transition-colors" onClick={handleLogin}>
                <User size={14} />
                Log in
              </button>
              <button className="hidden sm:block text-[13px] font-medium px-4 py-1.5 rounded-lg bg-[#185FA5] text-white hover:bg-[#145088] transition-colors" onClick={handleLogin}>
                Sign up free
              </button>
            </>
          )}

          {/* Hamburger / Recent */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Open recent checks"
            className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <History size={16} />
            <span>Recent</span>
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="inline-flex"
            >
              <ChevronDown size={13} />
            </motion.span>
          </button>
        </div>
      </nav>

      {/* ── Drawer ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setOpen(false)}
              className="absolute inset-x-0 bottom-0 bg-black/20 z-10"
              style={{ top: 0 }}
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              role="dialog"
              aria-label="Recent checks"
              className="absolute inset-x-0 top-0 bg-white border-b border-gray-200 z-20 shadow-sm"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 pt-3.5 pb-2.5">
                <div className="flex items-center gap-2 text-[13px] font-medium text-gray-900">
                  <History size={15} />
                  Recent checks
                  <span className="text-[11px] font-normal text-gray-400 ml-0.5">
                    {history.length} item{history.length === 1 ? "" : "s"}
                  </span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close drawer"
                  className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Mobile nav links */}
              <div className="flex flex-col gap-0.5 px-3.5 pb-2 border-b border-gray-100 sm:hidden">
                {["How it works", "About"].map((link) => (
                  <button
                    key={link}
                    className="text-left text-[14px] text-gray-500 hover:bg-gray-100 px-2.5 py-2.5 rounded-lg transition-colors"
                  >
                    {link}
                  </button>
                ))}
              </div>

              {/* Mobile auth buttons */}
              <div className="flex gap-2 px-3.5 py-2.5 border-b border-gray-100 sm:hidden">
                {userData ? (
                  <button className="flex-1 text-[13px] font-medium px-3 py-2 rounded-lg bg-[#185FA5] text-white hover:bg-[#145088] transition-colors" onClick={handleLogout}>
                    Logout
                  </button>
                ) : (
                  <>
                    <button className="flex-1 flex items-center justify-center gap-1.5 text-[13px] font-medium px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 transition-colors" onClick={handleLogin}>
                      <User size={14} /> Log in
                    </button>
                    <button className="flex-1 text-[13px] font-medium px-3 py-2 rounded-lg bg-[#185FA5] text-white hover:bg-[#145088] transition-colors" onClick={handleLogin}>
                      Sign up free
                    </button>
                  </>
                )}
              </div>

              {/* History list */}
              <div className="flex flex-col gap-1.5 px-3.5 py-3">
                {history.length === 0 ? (
                  <div className="rounded-2xl bg-gray-50 border border-dashed border-gray-200 p-5 text-center text-sm text-gray-500">
                    No recent checks yet. Analyze some content to see your history here.
                  </div>
                ) : (
                  history.map((item, i) => {
                    const verdict = normalizeVerdict(item.verdict);
                    return (
                      <motion.div
                        key={item._id || item.id || i}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.18 }}
                        onClick={() => {
                          setactualText(item);
                          setOpen(false);
                        }}
                        className="flex items-center justify-between gap-2.5 bg-gray-50 hover:border hover:border-gray-200 rounded-lg px-3 py-2.5 cursor-pointer transition-all group"
                      >
                        <span className="text-[13px] text-gray-900 truncate min-w-0 flex-1">
                          {item.text || item.title || "Untitled check"}
                        </span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${verdictBadgeClass[verdict]}`}
                          >
                            {getVerdictLabel(item.verdict)}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            {formatHistoryTime(item)}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
