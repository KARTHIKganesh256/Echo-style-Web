import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import ecommerceApi from '../utils/ecommerceApi';
import { motion } from 'framer-motion';

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await ecommerceApi.getOrders();
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
        return <Clock className="text-yellow-600" size={20} />;
      case 'processing':
        return <Package className="text-blue-600" size={20} />;
      case 'shipped':
        return <Truck className="text-indigo-600" size={20} />;
      case 'delivered':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'cancelled':
        return <XCircle className="text-red-600" size={20} />;
      default:
        return <Package className="text-gray-600" size={20} />;
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

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Order History
          </h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card className="p-12 text-center">
            <Package size={64} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here!</p>
            <Button
              onClick={() => navigate('/products')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Start Shopping
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        {getStatusIcon(order.status)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">{order.order_number}</h3>
                        <p className="text-sm text-gray-600">
                          Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {order.items?.length || 0} item(s) • ₹{parseFloat(order.total_amount).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <Button
                        onClick={() => viewOrderDetails(order)}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {order.items?.slice(0, 4).map((item) => (
                        <div key={item.id} className="flex gap-2 items-center">
                          {item.product_image && (
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.product_name}</p>
                            <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                      {order.items && order.items.length > 4 && (
                        <div className="flex items-center justify-center text-gray-600 text-sm">
                          +{order.items.length - 4} more
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {showDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Order Details</h2>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Order Status */}
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Order Number</p>
                      <p className="font-bold text-lg">{selectedOrder.order_number}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </span>
                  </div>

                  {/* Timeline */}
                  <div>
                    <h3 className="font-semibold mb-3">Order Timeline</h3>
                    <div className="space-y-3">
                      {selectedOrder.created_at && (
                        <div className="flex gap-3">
                          <div className="w-2 h-2 mt-2 rounded-full bg-purple-600"></div>
                          <div>
                            <p className="font-medium">Order Placed</p>
                            <p className="text-sm text-gray-600">
                              {new Date(selectedOrder.created_at).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedOrder.confirmed_at && (
                        <div className="flex gap-3">
                          <div className="w-2 h-2 mt-2 rounded-full bg-blue-600"></div>
                          <div>
                            <p className="font-medium">Order Confirmed</p>
                            <p className="text-sm text-gray-600">
                              {new Date(selectedOrder.confirmed_at).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedOrder.shipped_at && (
                        <div className="flex gap-3">
                          <div className="w-2 h-2 mt-2 rounded-full bg-indigo-600"></div>
                          <div>
                            <p className="font-medium">Order Shipped</p>
                            <p className="text-sm text-gray-600">
                              {new Date(selectedOrder.shipped_at).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedOrder.delivered_at && (
                        <div className="flex gap-3">
                          <div className="w-2 h-2 mt-2 rounded-full bg-green-600"></div>
                          <div>
                            <p className="font-medium">Order Delivered</p>
                            <p className="text-sm text-gray-600">
                              {new Date(selectedOrder.delivered_at).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tracking Info */}
                  {selectedOrder.tracking_number && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold mb-2">Tracking Information</h3>
                      <p className="text-sm"><strong>Carrier:</strong> {selectedOrder.shipping_carrier}</p>
                      <p className="text-sm"><strong>Tracking Number:</strong> {selectedOrder.tracking_number}</p>
                    </div>
                  )}

                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-semibold mb-2">Shipping Address</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium">{selectedOrder.customer_name}</p>
                      <p className="text-sm">{selectedOrder.customer_phone}</p>
                      <p className="text-sm mt-2">{selectedOrder.shipping_address.line1}</p>
                      {selectedOrder.shipping_address.line2 && (
                        <p className="text-sm">{selectedOrder.shipping_address.line2}</p>
                      )}
                      <p className="text-sm">
                        {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.postal_code}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="font-semibold mb-3">Order Items</h3>
                    <div className="space-y-3">
                      {selectedOrder.items?.map((item) => (
                        <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                          {item.product_image && (
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium">{item.product_name}</p>
                            {item.variant_name && (
                              <p className="text-sm text-gray-600">{item.variant_name}</p>
                            )}
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
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

                  {/* Payment Info */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm"><strong>Payment Method:</strong> {selectedOrder.payment_method}</p>
                    <p className="text-sm"><strong>Payment Status:</strong> 
                      <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                        selectedOrder.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedOrder.payment_status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;

