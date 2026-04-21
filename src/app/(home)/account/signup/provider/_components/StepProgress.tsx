import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SignupStep } from "./types";

const STEPS = [
  { step: 1 as const, label: "Step 1", title: "Account" },
  { step: 2 as const, label: "Step 2", title: "Verify Email" },
  { step: 3 as const, label: "Step 3", title: "Restaurant" },
];

type StepProgressProps = {
  currentStep: SignupStep;
};

export function StepProgress({ currentStep }: StepProgressProps) {
  const progressPercentage = (currentStep / STEPS.length) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
        <span>{STEPS[currentStep - 1].label}</span>
        <span>{STEPS[currentStep - 1].title}</span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-slate-900 transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {STEPS.map((item) => {
          const isActive = item.step === currentStep;
          const isComplete = item.step < currentStep;

          return (
            <div
              key={item.step}
              className={cn(
                "rounded-xl border px-3 py-2",
                isActive && "border-slate-900 bg-slate-900 text-white",
                isComplete &&
                  "border-emerald-200 bg-emerald-50 text-emerald-900",
                !isActive &&
                  !isComplete &&
                  "border-slate-200 bg-slate-50 text-slate-600",
              )}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold",
                    isActive && "bg-white text-slate-900",
                    isComplete && "bg-emerald-600 text-white",
                    !isActive && !isComplete && "bg-white text-slate-500",
                  )}
                >
                  {isComplete ? <BadgeCheck size={14} /> : item.step}
                </div>
                <div>
                  <p className="text-xs font-semibold">{item.title}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
