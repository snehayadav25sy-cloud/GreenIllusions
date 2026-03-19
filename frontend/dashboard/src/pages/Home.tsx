import { useState } from "react";
import { analyzeESG } from "../api";
import { ClaimResult } from "../types";
import ClaimCard from "../components/ClaimCard";
import { useEffect } from "react";


export default function Home() {
  const [text, setText] = useState("");
  const [provider, setProvider] = useState("ibm");
  const [results, setResults] = useState<ClaimResult[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    if (!text.trim()) {
      alert("Please paste some ESG text first");
      return;
    }

    setLoading(true);

    try {
      const data = await analyzeESG(text, provider);
      setResults(data.results);
      localStorage.setItem("analysisResults", JSON.stringify(data.results));

    } catch (error) {
      alert("Analysis failed. Check backend.");
    }

    setLoading(false);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        ESG Claim Analysis
      </h1>

      <textarea
        className="w-full border rounded p-3 mb-4"
        placeholder="Paste ESG report text here..."
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex items-center gap-4 mb-4">
        <select
          className="border rounded p-2"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
        >
          <option value="ibm">IBM</option>
          <option value="aws">AWS</option>
        </select>

        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      <div className="mt-6">
        {results.map((c, i) => (
          <ClaimCard key={i} result={c} />
        ))}
      </div>
    </div>
  );
}
