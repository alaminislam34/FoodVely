import Link from "next/link";
import { motion } from "motion/react";

export default function AuthButtons() {
  return (
    <>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          href={"/account/signin"}
          className="py-1.5 px-6 rounded-xl font-Sofia font-semibold text-rose-600 border-2 border-rose-600 hover:bg-rose-50 hover:border-rose-700 transition-all duration-300"
        >
          Sign In
        </Link>
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          href={"/account/signup"}
          className="py-1.5 px-6 rounded-xl font-Sofia font-semibold bg-linear-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Sign Up
        </Link>
      </motion.div>
    </>
  );
}
