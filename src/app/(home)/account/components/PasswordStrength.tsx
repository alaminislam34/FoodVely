import { motion } from "motion/react";

interface PasswordStrengthProps {
  strength: number;
  password: string;
}

export default function PasswordStrength({
  strength,
  password,
}: PasswordStrengthProps) {
  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-2 mt-2"
    >
      <div className="flex gap-1">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-2 rounded-full transition-all ${
              i < strength
                ? i < 2
                  ? "bg-red-500"
                  : i < 3
                  ? "bg-yellow-500"
                  : "bg-green-500"
                : "bg-gray-300"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-600 font-Sofia">
        {strength === 0 && "Very weak"}
        {strength === 1 && "Weak"}
        {strength === 2 && "Fair"}
        {strength === 3 && "Good"}
        {strength === 4 && "Strong"}
      </p>
    </motion.div>
  );
}
