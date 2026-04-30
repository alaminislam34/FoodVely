import { useAdmin } from "@/module/hooks/userAdmin";
import { useMemo } from "react";
import { motion } from "motion/react";
import Link from "next/link";

function formatTime(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleString();
}

const ActivityLogs = () => {
  const {
    platformActivityLogs,
    isGettingPlatformActivityLogs,
    platformActivityLogsError,
  } = useAdmin();

  // Show only the 6 most recent logs
  const recentLogs = useMemo(() => {
    if (!platformActivityLogs) return [];
    return platformActivityLogs.slice(0, 6);
  }, [platformActivityLogs]);

  return (
    <div>
      <div className="">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 md:p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
            <Link
              href="/admin/activity-log"
              className="text-sm text-rose-600 hover:text-rose-700 font-semibold"
            >
              View All →
            </Link>
          </div>

          <div className="space-y-4">
            {isGettingPlatformActivityLogs && (
              <div className="text-gray-500 text-sm">Loading...</div>
            )}
            {platformActivityLogsError && (
              <div className="text-red-500 text-sm">
                Failed to load activity logs.
              </div>
            )}
            {!isGettingPlatformActivityLogs &&
              !platformActivityLogsError &&
              recentLogs.length === 0 && (
                <div className="text-gray-500 text-sm">
                  No recent activity found.
                </div>
              )}
            {recentLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center shrink-0">
                  {/* You can use a default icon or map action to an icon here */}
                  <span className="text-rose-600 font-bold text-lg">
                    {log.actorRole?.[0] || "A"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">
                    {log.action}{" "}
                    <span className="text-gray-500">({log.actorRole})</span>
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Target: {log.targetType}{" "}
                    {log.targetId && `(${log.targetId})`}
                  </p>
                  {log.details && (
                    <p className="text-xs text-gray-400 mt-1 truncate">
                      Details: {JSON.stringify(log.details)}
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-500 shrink-0">
                  {formatTime(log.createdAt)}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ActivityLogs;
