import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, CheckCircle, Package, Star, MapPin } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('https://flyaro-waffle-backend.onrender.com/api/orders/my-orders');
      setOrders(response.data);
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
        return <Clock className="text-yellow-500" size={20} />;
      case 'preparing':
        return <Package className="text-orange-500" size={20} />;
      case 'ready':
      case 'completed':
        return <CheckCircle className="text-green-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-orange-100 text-orange-800',
      ready: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">Start by ordering some delicious waffles!</p>
          <a href="/menu" className="btn-primary">Browse Menu</a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(order.status)}
                    <h3 className="text-lg font-semibold">Order #{order.pickupCode}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-600">₹{order.totalAmount.toFixed(2)}</p>
                  {order.status === 'ready' && (
                    <p className="text-green-600 font-medium text-sm">Ready for pickup!</p>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-medium mb-3">Order Items:</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.menuItem?.image || `https://source.unsplash.com/100x100/?waffle,${(item.menuItem?.name || 'dessert').replace(/\s+/g, '')}`}
                          alt={item.menuItem?.name || 'Waffle Item'}
                          className="w-12 h-12 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://source.unsplash.com/100x100/?waffle,dessert";
                          }}
                        />
                        <div>
                          <p className="font-medium">{item.menuItem?.name || 'Waffle Item'}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {order.specialInstructions && (
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <h4 className="font-medium mb-2">Special Instructions:</h4>
                  <p className="text-gray-600 text-sm">{order.specialInstructions}</p>
                </div>
              )}

              {order.status === 'ready' && (
                <div className="border-t border-gray-100 pt-4 mt-4 bg-green-50 -m-6 p-6 rounded-b-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-green-800 mb-1">Your order is ready!</h4>
                      <p className="text-green-700 text-sm">Show this pickup code at the store:</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-white border-2 border-green-500 rounded-lg px-4 py-2">
                        <p className="text-xs text-gray-600 mb-1">Pickup Code</p>
                        <p className="text-2xl font-bold text-green-600">{order.pickupCode}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <a
                      href="https://maps.app.goo.gl/tFUdUWx1bUsyCLME6?g_st=ipc"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                    >
                      <MapPin size={20} />
                      <span>Get Directions to Store</span>
                    </a>
                  </div>
                </div>
              )}

              {order.loyaltyPointsEarned > 0 && (
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex items-center space-x-2 text-primary-600">
                    <Star size={16} className="fill-current" />
                    <span className="text-sm font-medium">
                      Earned {order.loyaltyPointsEarned} loyalty points
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
