import { motion } from "motion/react";

type UserRole = "provider";

interface RoleSelectorProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
  setErrors: (errors: any) => void;
}

export default function RoleSelector({
  role,
  setRole,
  setErrors,
}: RoleSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex gap-4">
        {[{ id: "provider", label: "🏪 Provider", desc: "Sell food" }].map(
          (option) => (
            <button
              key={option.id}
              onClick={() => {
                setRole(option.id as UserRole);
                setErrors({});
              }}
              className={`flex-1 p-4 rounded-2xl border-2 transition-all duration-300 ${
                role === option.id
                  ? "border-rose-500 bg-rose-50"
                  : "border-gray-200 bg-white/30 hover:border-gray-300"
              }`}
            >
              <div className="font-Sofia font-bold text-gray-900">
                {option.label}
              </div>
              <div className="text-xs text-gray-500 font-Sofia">
                {option.desc}
              </div>
            </button>
          ),
        )}
      </div>
    </motion.div>
  );
}
