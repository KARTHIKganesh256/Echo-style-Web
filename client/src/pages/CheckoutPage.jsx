import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ArrowLeft, CreditCard, Truck, CheckCircle } from 'lucide-react';
import ecommerceApi from '../utils/ecommerceApi';
import { motion } from 'framer-motion';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Review
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [customerNotes, setCustomerNotes] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cartResponse, addressResponse] = await Promise.all([
        ecommerceApi.getCart(),
        ecommerceApi.getAddresses()
      ]);

      if (cartResponse.error) throw cartResponse.error;
      setCartItems(cartResponse.data || []);

      if (addressResponse.data && addressResponse.data.length > 0) {
        const defaultAddress = addressResponse.data.find(addr => addr.is_default) || addressResponse.data[0];
        setShippingAddress({
          name: defaultAddress.name,
          phone: defaultAddress.phone,
          address_line1: defaultAddress.address_line1,
          address_line2: defaultAddress.address_line2 || '',
          city: defaultAddress.city,
          state: defaultAddress.state,
          postal_code: defaultAddress.postal_code,
          country: defaultAddress.country
        });
      }
      setAddresses(addressResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    return calculateSubtotal() > 1000 ? 0 : 50;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handlePlaceOrder = async () => {
    try {
      setProcessing(true);

      const orderData = {
        customer_name: shippingAddress.name,
        customer_email: '', // Will be filled from auth
        customer_phone: shippingAddress.phone,
        shipping_address: {
          line1: shippingAddress.address_line1,
          line2: shippingAddress.address_line2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postal_code: shippingAddress.postal_code,
          country: shippingAddress.country
        },
        billing_address: {
          line1: shippingAddress.address_line1,
          line2: shippingAddress.address_line2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postal_code: shippingAddress.postal_code,
          country: shippingAddress.country
        },
        subtotal: calculateSubtotal(),
        shipping_cost: calculateShipping(),
        tax_amount: 0,
        discount_amount: 0,
        total_amount: calculateTotal(),
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'COD' ? 'pending' : 'paid',
        customer_notes: customerNotes
      };

      const { data, error } = await ecommerceApi.createOrder(orderData);
      
      if (error) throw error;

      // Redirect to success page
      navigate(`/order-success/${data.id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="p-12 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2">No items to checkout</h2>
          <p className="text-gray-600 mb-6">Add some products to your cart first!</p>
          <Button
            onClick={() => navigate('/products')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Continue Shopping
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Cart
          </button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Checkout
          </h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            {[
              { num: 1, label: 'Shipping', icon: Truck },
              { num: 2, label: 'Payment', icon: CreditCard },
              { num: 3, label: 'Review', icon: CheckCircle }
            ].map((s, index) => {
              const Icon = s.icon;
              return (
                <div key={s.num} className="flex items-center">
                  <div className={`flex items-center gap-2 ${step >= s.num ? 'text-purple-600' : 'text-gray-400'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= s.num ? 'bg-purple-600 text-white' : 'bg-gray-200'
                    }`}>
                      <Icon size={20} />
                    </div>
                    <span className="font-medium hidden sm:inline">{s.label}</span>
                  </div>
                  {index < 2 && (
                    <div className={`w-12 h-1 mx-4 ${step > s.num ? 'bg-purple-600' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={shippingAddress.name}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address_line1">Address Line 1 *</Label>
                      <Input
                        id="address_line1"
                        value={shippingAddress.address_line1}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, address_line1: e.target.value })}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address_line2">Address Line 2</Label>
                      <Input
                        id="address_line2"
                        value={shippingAddress.address_line2}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, address_line2: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="postal_code">Postal Code *</Label>
                      <Input
                        id="postal_code"
                        value={shippingAddress.postal_code}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, postal_code: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        value={shippingAddress.country}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <Button
                    onClick={() => setStep(2)}
                    disabled={!shippingAddress.name || !shippingAddress.phone || !shippingAddress.address_line1}
                    className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Continue to Payment
                  </Button>
                </Card>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
                  
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-purple-600">
                      <input
                        type="radio"
                        name="payment"
                        value="COD"
                        checked={paymentMethod === 'COD'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <div>
                        <p className="font-semibold">Cash on Delivery</p>
                        <p className="text-sm text-gray-600">Pay when you receive your order</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-purple-600 opacity-50">
                      <input
                        type="radio"
                        name="payment"
                        value="Card"
                        disabled
                        className="w-4 h-4"
                      />
                      <div>
                        <p className="font-semibold">Credit/Debit Card</p>
                        <p className="text-sm text-gray-600">Coming Soon</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-purple-600 opacity-50">
                      <input
                        type="radio"
                        name="payment"
                        value="UPI"
                        disabled
                        className="w-4 h-4"
                      />
                      <div>
                        <p className="font-semibold">UPI</p>
                        <p className="text-sm text-gray-600">Coming Soon</p>
                      </div>
                    </label>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <Button
                      onClick={() => setStep(1)}
                      className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Review Order
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold">{shippingAddress.name}</p>
                    <p>{shippingAddress.phone}</p>
                    <p className="mt-2">{shippingAddress.address_line1}</p>
                    {shippingAddress.address_line2 && <p>{shippingAddress.address_line2}</p>}
                    <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}</p>
                    <p>{shippingAddress.country}</p>
                  </div>
                  <Button
                    onClick={() => setStep(1)}
                    className="mt-4 bg-gray-200 text-gray-800 hover:bg-gray-300"
                    size="sm"
                  >
                    Edit
                  </Button>
                </Card>

                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
                  <p className="font-semibold">{paymentMethod === 'COD' ? 'Cash on Delivery' : paymentMethod}</p>
                  <Button
                    onClick={() => setStep(2)}
                    className="mt-4 bg-gray-200 text-gray-800 hover:bg-gray-300"
                    size="sm"
                  >
                    Edit
                  </Button>
                </Card>

                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Order Items</h2>
                  <div className="space-y-3">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex justify-between items-center pb-3 border-b">
                        <div>
                          <p className="font-medium">{item.product?.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={processing}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-6 text-lg"
                >
                  {processing ? 'Processing...' : 'Place Order'}
                </Button>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items ({cartItems.length})</span>
                  <span className="font-semibold">₹{calculateSubtotal().toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {calculateShipping() === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${calculateShipping()}`
                    )}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{calculateTotal().toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

