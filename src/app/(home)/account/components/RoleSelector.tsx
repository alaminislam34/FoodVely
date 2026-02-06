import { motion } from "motion/react";
import type { UserRole } from "../signup/types";

interface RoleSelectorProps {
  role: UserRole;
  onChange: (role: UserRole) => void;
}

export default function RoleSelector({ role, onChange }: RoleSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex gap-4">
        {[
          { id: "CUSTOMER", label: "👤 Customer", desc: "Order food" },
          { id: "PROVIDER", label: "🏪 Provider", desc: "Sell food" },
        ].map((option) => (
          <button
            key={option.id}
            onClick={() => {
              onChange(option.id as UserRole);
            }}
            className={`flex-1 p-4 rounded-2xl border-2 transition-all duration-300 ${
              role === option.id
                ? "border-rose-500 bg-rose-50"
                : "border-gray-200 bg-white/30 hover:border-gray-300"
            }`}
          >
            <div className="font-bold text-gray-900">{option.label}</div>
            <div className="text-xs text-gray-500">
              {option.desc}
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
