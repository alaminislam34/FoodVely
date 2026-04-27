import { Menu } from "lucide-react";
import { motion } from "motion/react";

export default function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="py-2.5 px-3.5 rounded-xl border-2 border-rose-500 text-white bg-linear-to-r from-rose-500 to-orange-500 shadow-lg hover:shadow-xl transition-shadow"
      onClick={onClick}
    >
      <Menu size={24} />
    </motion.button>
  );
}
