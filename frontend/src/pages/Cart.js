import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Cart = () => {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setCouponLoading(true);
    try {
      const response = await axios.post('https://flyaro-waffle-backend.onrender.com/api/coupons/verify', { code: couponCode });
      setAppliedCoupon(response.data);
      toast.success(`Coupon applied! ${response.data.discountPercent}% discount`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid coupon code');
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };
  
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.success('Coupon removed');
  };
  
  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    return (getTotalPrice() * appliedCoupon.discountPercent / 100);
  };
  
  const calculateCGST = () => {
    const subtotal = getTotalPrice();
    const discount = calculateDiscount();
    return (subtotal - discount) * 0.09; // 9% CGST
  };
  
  const calculateSGST = () => {
    const subtotal = getTotalPrice();
    const discount = calculateDiscount();
    return (subtotal - discount) * 0.09; // 9% SGST
  };
  
  const calculateTotal = () => {
    const subtotal = getTotalPrice();
    const discount = calculateDiscount();
    const cgst = calculateCGST();
    const sgst = calculateSGST();
    return (subtotal - discount + cgst + sgst);
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setLoading(true);
    try {
      const orderData = {
        items: items.map(item => ({
          menuItem: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: calculateTotal(),
        specialInstructions,
        couponApplied: appliedCoupon ? appliedCoupon.code : null,
        discountAmount: calculateDiscount()
      };

      const response = await axios.post('https://flyaro-waffle-backend.onrender.com/api/orders', orderData);
      
      toast.success(`Order placed! Your pickup code is: ${response.data.pickupCode}`);
      clearCart();
      setAppliedCoupon(null);
      setCouponCode('');
      
      // Show pickup code prominently
      setTimeout(() => {
        alert(`🎉 Order Confirmed!\n\nYour Pickup Code: ${response.data.pickupCode}\n\nPlease save this code and show it at the store for pickup.`);
      }, 1000);
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some delicious waffles to get started!</p>
          <a href="/menu" className="btn-primary">Browse Menu</a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item._id} className="card flex items-center space-x-4">
              <img
                src={item.image || '/api/placeholder/100/100'}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-gray-600">₹{item.price}</p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <Minus size={16} />
                </button>
                
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                
                <button
                  onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="text-right">
                <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => removeItem(item._id)}
                  className="text-red-500 hover:text-red-700 mt-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{getTotalPrice().toFixed(2)}</span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({appliedCoupon.discountPercent}%)</span>
                  <span>-₹{calculateDiscount().toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>CGST (9%)</span>
                <span>₹{calculateCGST().toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>SGST (9%)</span>
                <span>₹{calculateSGST().toFixed(2)}</span>
              </div>
              
              <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coupon Code
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  className="input-field uppercase"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={appliedCoupon || couponLoading}
                />
                {appliedCoupon ? (
                  <button
                    onClick={removeCoupon}
                    className="btn-secondary whitespace-nowrap"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    onClick={applyCoupon}
                    disabled={!couponCode.trim() || couponLoading}
                    className="btn-primary whitespace-nowrap disabled:opacity-50"
                  >
                    {couponLoading ? 'Applying...' : 'Apply'}
                  </button>
                )}
              </div>
              {appliedCoupon && (
                <p className="text-sm text-green-600 mt-1">
                  Coupon {appliedCoupon.code} applied! ({appliedCoupon.discountPercent}% off)
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows="3"
                placeholder="Any special requests..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              />
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>

            <p className="text-xs text-gray-500 mt-2 text-center">
              You'll receive a pickup code after placing your order
            </p>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-800 mb-2">Store Location:</p>
              <a
                href="https://maps.app.goo.gl/tFUdUWx1bUsyCLME6?g_st=ipc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm underline"
              >
                📍 View on Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
