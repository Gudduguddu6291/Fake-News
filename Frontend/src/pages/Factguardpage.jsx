
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import InputCard from "../components/Inputcard";
import ResultCard from "../components/ResultCard";


export default function FactGuardPage() {
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);

//   const handleAnalyze = async (text) => {
//     setLoading(true);
//     try {
      
//       await new Promise((r) => setTimeout(r, 1400));
//       setResult(null); // null → ResultCard uses its built-in DEFAULT_RESULT
//     } catch (err) {
//       console.error("Analysis failed:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <Hero />
      <main className="px-4 pb-10 max-w-3xl mx-auto">
        <InputCard  />
        <ResultCard  />
      </main>
    </div>
  );
}