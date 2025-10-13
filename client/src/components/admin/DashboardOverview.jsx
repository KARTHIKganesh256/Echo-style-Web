import { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users,
  Package,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { supabase } from '../../utils/supabase';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    revenueChange: 0,
    ordersChange: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch total revenue and orders
      const { data: orders } = await supabase
        .from('orders')
        .select('total_amount, created_at, status');

      // Fetch total products
      const { data: products } = await supabase
        .from('ecommerce_products')
        .select('id', { count: 'exact' });

      // Fetch total users
      const { data: users } = await supabase
        .from('auth.users')
        .select('id', { count: 'exact' });

      // Calculate stats
      const totalRevenue = orders?.reduce((sum, order) => {
        return order.status !== 'cancelled' ? sum + parseFloat(order.total_amount) : sum;
      }, 0) || 0;

      const totalOrders = orders?.length || 0;
      const totalProducts = products?.length || 0;
      const totalUsers = users?.length || 0;

      // Get recent orders
      const { data: recent } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(count)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalRevenue,
        totalOrders,
        totalProducts,
        totalUsers,
        revenueChange: 12.5, // Mock data - calculate actual change
        ordersChange: 8.2,
      });

      setRecentOrders(recent || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      change: stats.revenueChange,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      change: stats.ordersChange,
      icon: ShoppingBag,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      change: 0,
      icon: Package,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      change: 0,
      icon: Users,
      color: 'bg-orange-500',
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || colors.pending;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  {stat.change !== 0 && (
                    <div className="flex items-center mt-2">
                      {stat.change > 0 ? (
                        <ArrowUp size={16} className="text-green-500 mr-1" />
                      ) : (
                        <ArrowDown size={16} className="text-red-500 mr-1" />
                      )}
                      <span className={`text-sm ${stat.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {Math.abs(stat.change)}%
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs last month</span>
                    </div>
                  )}
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Orders */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Order Number</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Total</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{order.order_number}</td>
                  <td className="py-3 px-4">{order.customer_name}</td>
                  <td className="py-3 px-4">₹{parseFloat(order.total_amount).toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(order.created_at).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default DashboardOverview;

