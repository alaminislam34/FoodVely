"use client";

import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

type HeaderAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  icon?: LucideIcon;
};

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: HeaderAction[];
};

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl font-Sofia font-bold text-gray-800">
          {title}
        </h1>
        {subtitle ? (
          <p className="text-gray-500 font-medium mt-1">{subtitle}</p>
        ) : null}
      </div>

      {actions?.length ? (
        <div className="flex flex-wrap gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            const className =
              action.variant === "secondary"
                ? "px-4 py-2.5 bg-white border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                : "px-4 py-2.5 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700 transition-all shadow-md shadow-rose-200";

            const content = (
              <>
                {Icon ? <Icon size={16} /> : null}
                <span>{action.label}</span>
              </>
            );

            if (action.href) {
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className={className + " inline-flex items-center gap-2"}
                >
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={action.label}
                type="button"
                onClick={action.onClick}
                className={className + " inline-flex items-center gap-2"}
              >
                {content}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
