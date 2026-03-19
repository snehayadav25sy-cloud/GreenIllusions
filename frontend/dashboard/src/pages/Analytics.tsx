import { useEffect, useState } from "react";
import { fetchAnalytics } from "../api";
import { motion } from "framer-motion";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#22c55e", "#facc15", "#ef4444"];

export default function Analytics() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics()
      .then(setData)
      .catch((err) => console.error("Analytics fetch failed", err));
  }, []);

  if (!data) return <p className="p-6">Loading analytics...</p>;

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-2xl font-bold mb-6">📊 ESG Analytics</h1>

      {/* HERO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-sm opacity-80">Total Claims</h3>
          <p className="text-3xl font-bold">{data.total_claims}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-sm opacity-80">Medium Risk</h3>
          <p className="text-3xl font-bold">{data.medium_risk}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-sm opacity-80">High Risk</h3>
          <p className="text-3xl font-bold">{data.high_risk}</p>
        </motion.div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-4 rounded-xl shadow-md"
        >
          <h2 className="font-semibold mb-2">Risk Distribution</h2>

          {Array.isArray(data.risk_distribution) && (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.risk_distribution}
                  dataKey="value"
                  nameKey="label"
                  label
                >
                  {data.risk_distribution.map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Verdict Distribution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-4 rounded-xl shadow-md"
        >
          <h2 className="font-semibold mb-2">Verdict Breakdown</h2>

          {Array.isArray(data.verdict_distribution) && (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.verdict_distribution}>
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
