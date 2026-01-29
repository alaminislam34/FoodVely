import { LoadingState } from '@/components/customer/shared/LoadingState';

export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      <div className="h-12 bg-gray-200 rounded animate-pulse" />
      <LoadingState />
    </div>
  );
}
