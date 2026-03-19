// export default function Navbar() {
//   return (
//     <div
//       style={{
//         padding: "16px 24px",
//         borderBottom: "1px solid #ddd",
//         fontSize: "20px",
//         fontWeight: "bold",
//         backgroundColor: "white",
//       }}
//     >
//       🌱 Green Illusions — ESG Verification Dashboard
//     </div>
//   );
// }

// export default function Navbar() {
//   return (
//     <div className="bg-green-600 text-white p-4 text-xl font-bold">
//       🌱 Green Illusions — ESG Verification Dashboard
//     </div>
//   );
// }

import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-green-600 text-white px-6 py-4 text-xl font-bold"
    >
      🌱 Green Illusions — ESG Verification Dashboard
    </motion.div>
  );
}
