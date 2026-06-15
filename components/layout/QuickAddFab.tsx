"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useEditor } from "@/components/editor-context";

export function QuickAddFab() {
  const { openAdd } = useEditor();

  return (
    <motion.button
      onClick={openAdd}
      aria-label="Quick add subscription"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 22, delay: 0.2 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-20 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[hsl(var(--cyan))] text-white shadow-xl shadow-primary/40 focus-ring md:bottom-8 md:right-8"
    >
      <Plus className="h-6 w-6" />
    </motion.button>
  );
}
