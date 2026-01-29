'use client';

import { useFetch } from '@/hooks/useFetch';
import { TabbedLayout } from '@/components/customer/shared/TabbedLayout';
import { LoadingState } from '@/components/customer/shared/LoadingState';
import { EmptyState } from '@/components/customer/shared/EmptyState';
import { CouponCard } from '@/components/customer/shared/CouponCard';
import { Coupon } from '@/types/customer-types';

interface CouponsResponse {
  coupons: Coupon[];
}

export default function CouponsPage() {
  const { data: couponsData, loading } = useFetch<CouponsResponse>(
    '/data/customer/my-coupons.json'
  );

  if (loading) return <LoadingState type="list" />;
  if (!couponsData?.coupons) return <EmptyState type="coupons" />;

  const allCoupons = couponsData.coupons || [];
  const activeCoupons = allCoupons.filter((c) => c.status === 'active');
  const expiredCoupons = allCoupons.filter((c) => c.status !== 'active');

  const tabs = [
    {
      id: 'active',
      label: `Active Coupons (${activeCoupons.length})`,
      content: (
        <div className="space-y-3">
          {activeCoupons.length === 0 ? (
            <EmptyState type="coupons" />
          ) : (
            activeCoupons.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} showDetails />
            ))
          )}
        </div>
      ),
    },
    {
      id: 'expired',
      label: `Expired Coupons (${expiredCoupons.length})`,
      content: (
        <div className="space-y-3">
          {expiredCoupons.length === 0 ? (
            <EmptyState type="coupons" />
          ) : (
            expiredCoupons.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} showDetails />
            ))
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Coupons</h1>
        <p className="text-gray-600">Save more with your available coupons</p>
      </div>

      <TabbedLayout tabs={tabs} defaultTab="active" />
    </div>
  );
}
