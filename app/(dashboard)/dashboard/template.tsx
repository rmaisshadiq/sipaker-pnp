"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} // Mulai dari transparan & sedikit di bawah
      animate={{ opacity: 1, y: 0 }}  // Menjadi jelas & posisi normal
      transition={{ ease: "easeInOut", duration: 0.4 }} // Durasi animasi
    >
      {children}
    </motion.div>
  );
}