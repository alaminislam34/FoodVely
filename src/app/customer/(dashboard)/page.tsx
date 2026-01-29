'use client';

export default function CustomerDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Sarah! 👋</h1>
        <p className="text-green-100">
          Ready to order from your favorite restaurants?
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Active Orders</p>
          <p className="text-3xl font-bold text-gray-900">3</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Total Spent</p>
          <p className="text-3xl font-bold text-gray-900">$234.56</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Favorite Restaurants</p>
          <p className="text-3xl font-bold text-gray-900">8</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Available Coupons</p>
          <p className="text-3xl font-bold text-gray-900">5</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/customer/orders"
            className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:shadow-md transition-shadow text-center"
          >
            <p className="font-semibold text-blue-900">View Orders</p>
            <p className="text-xs text-blue-700 mt-1">Track your deliveries</p>
          </a>
          <a
            href="/customer/favorites"
            className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg hover:shadow-md transition-shadow text-center"
          >
            <p className="font-semibold text-red-900">Favorites</p>
            <p className="text-xs text-red-700 mt-1">Quick reorder</p>
          </a>
          <a
            href="/customer/coupons"
            className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg hover:shadow-md transition-shadow text-center"
          >
            <p className="font-semibold text-purple-900">Coupons</p>
            <p className="text-xs text-purple-700 mt-1">Save more</p>
          </a>
          <a
            href="/customer/profile"
            className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:shadow-md transition-shadow text-center"
          >
            <p className="font-semibold text-green-900">Profile</p>
            <p className="text-xs text-green-700 mt-1">Update info</p>
          </a>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h2>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">Pizza Palace</p>
                <p className="text-sm text-gray-600">Order #ORD-2024-00{i}</p>
              </div>
              <p className="font-semibold text-green-600">$24.99</p>
            </div>
          ))}
        </div>
        <a
          href="/customer/orders"
          className="mt-4 text-center block text-green-600 font-medium hover:text-green-700"
        >
          View All Orders →
        </a>
      </div>
    </div>
  );
}
