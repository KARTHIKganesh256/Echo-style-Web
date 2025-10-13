import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, Eye, Truck, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../utils/supabase';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const updates = { status: newStatus };
      
      // Set timestamps based on status
      if (newStatus === 'confirmed' && !selectedOrder?.confirmed_at) {
        updates.confirmed_at = new Date().toISOString();
      } else if (newStatus === 'shipped' && !selectedOrder?.shipped_at) {
        updates.shipped_at = new Date().toISOString();
      } else if (newStatus === 'delivered' && !selectedOrder?.delivered_at) {
        updates.delivered_at = new Date().toISOString();
      } else if (newStatus === 'cancelled' && !selectedOrder?.cancelled_at) {
        updates.cancelled_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId);

      if (error) throw error;
      
      // Refresh orders and selected order
      await fetchOrders();
      if (selectedOrder?.id === orderId) {
        const { data } = await supabase
          .from('orders')
          .select(`*, items:order_items(*)`)
          .eq('id', orderId)
          .single();
        setSelectedOrder(data);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    }
  };

  const updateTracking = async (orderId, trackingNumber, carrier) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          tracking_number: trackingNumber,
          shipping_carrier: carrier
        })
        .eq('id', orderId);

      if (error) throw error;
      fetchOrders();
    } catch (error) {
      console.error('Error updating tracking:', error);
    }
  };

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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search by order number, customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Order Number</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Items</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Total</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Payment</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{order.order_number}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-sm text-gray-500">{order.customer_email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">{order.items?.length || 0}</td>
                    <td className="py-3 px-4 font-medium">
                      ₹{parseFloat(order.total_amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm">{order.payment_method}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          order.payment_status === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.payment_status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(order.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        onClick={() => viewOrderDetails(order)}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Eye size={16} className="mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Order Details</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order Number</p>
                    <p className="font-semibold">{selectedOrder.order_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-semibold">
                      {new Date(selectedOrder.created_at).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="font-semibold">{selectedOrder.customer_name}</p>
                    <p className="text-sm text-gray-500">{selectedOrder.customer_email}</p>
                    {selectedOrder.customer_phone && (
                      <p className="text-sm text-gray-500">{selectedOrder.customer_phone}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment</p>
                    <p className="font-semibold">{selectedOrder.payment_method}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedOrder.payment_status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedOrder.payment_status}
                    </span>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="font-semibold mb-2">Shipping Address</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p>{selectedOrder.shipping_address.line1}</p>
                    {selectedOrder.shipping_address.line2 && (
                      <p>{selectedOrder.shipping_address.line2}</p>
                    )}
                    <p>
                      {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.postal_code}
                    </p>
                    <p>{selectedOrder.shipping_address.country}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold mb-2">Order Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item) => (
                      <div key={item.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                        <div className="flex gap-4">
                          {item.product_image && (
                            <img src={item.product_image} alt={item.product_name} className="w-16 h-16 object-cover rounded" />
                          )}
                          <div>
                            <p className="font-medium">{item.product_name}</p>
                            {item.variant_name && (
                              <p className="text-sm text-gray-500">{item.variant_name}</p>
                            )}
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-semibold">₹{parseFloat(item.total_price).toLocaleString('en-IN')}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>₹{parseFloat(selectedOrder.subtotal).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>₹{parseFloat(selectedOrder.shipping_cost).toLocaleString('en-IN')}</span>
                    </div>
                    {selectedOrder.tax_amount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span>₹{parseFloat(selectedOrder.tax_amount).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {selectedOrder.discount_amount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-₹{parseFloat(selectedOrder.discount_amount).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total</span>
                      <span>₹{parseFloat(selectedOrder.total_amount).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Status Update */}
                <div>
                  <h3 className="font-semibold mb-2">Update Status</h3>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'confirmed')}
                      disabled={selectedOrder.status === 'confirmed'}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Confirm
                    </Button>
                    <Button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                      disabled={selectedOrder.status === 'processing'}
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Processing
                    </Button>
                    <Button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                      disabled={selectedOrder.status === 'shipped'}
                      size="sm"
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Truck size={16} className="mr-1" />
                      Ship
                    </Button>
                    <Button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                      disabled={selectedOrder.status === 'delivered'}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle size={16} className="mr-1" />
                      Delivered
                    </Button>
                    <Button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                      disabled={selectedOrder.status === 'cancelled'}
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <XCircle size={16} className="mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>

                {/* Tracking Info */}
                {selectedOrder.tracking_number && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Tracking Information</h3>
                    <p className="text-sm"><strong>Carrier:</strong> {selectedOrder.shipping_carrier}</p>
                    <p className="text-sm"><strong>Tracking Number:</strong> {selectedOrder.tracking_number}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;

