import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Clock, CheckCircle, Package, Menu, ShoppingBag, User, DollarSign, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import MenuManagement from '../components/admin/MenuManagement';
import AdminProfile from '../components/admin/AdminProfile';
import PriceEditor from '../components/admin/PriceEditor';
import CouponManagement from '../components/admin/CouponManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [pickupCode, setPickupCode] = useState('');
  const [verifiedOrder, setVerifiedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders/admin');
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const verifyPickupCode = async () => {
    if (!pickupCode.trim()) return;
    
    try {
      const response = await axios.post('http://localhost:5000/api/orders/verify-code', {
        pickupCode: pickupCode.trim()
      });
      setVerifiedOrder(response.data);
      toast.success('Order found!');
    } catch (error) {
      toast.error('Invalid pickup code');
      setVerifiedOrder(null);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status });
      toast.success('Order status updated');
      fetchOrders();
      if (verifiedOrder && verifiedOrder._id === orderId) {
        setVerifiedOrder({ ...verifiedOrder, status });
      }
    } catch (error) {
      toast.error('Failed to update order status');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'orders'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ShoppingBag size={16} className="inline mr-2" />
          Orders
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'menu'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Menu size={16} className="inline mr-2" />
          Menu Management
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'profile'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <User size={16} className="inline mr-2" />
          Profile
        </button>
        <button
          onClick={() => setActiveTab('prices')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'prices'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <DollarSign size={16} className="inline mr-2" />
          Prices
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'coupons'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Tag size={16} className="inline mr-2" />
          Coupons
        </button>
      </div>

      {activeTab === 'orders' && (
        <>
          {/* Pickup Code Verification */}
          <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-4">Verify Pickup Code</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Enter 4-digit pickup code"
            className="input-field flex-1"
            value={pickupCode}
            onChange={(e) => setPickupCode(e.target.value)}
            maxLength={4}
          />
          <button onClick={verifyPickupCode} className="btn-primary">
            <Search size={20} className="mr-2" />
            Verify
          </button>
        </div>

        {verifiedOrder && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">Order #{verifiedOrder.pickupCode}</h3>
                <p className="text-gray-600">Customer: {verifiedOrder.user.name}</p>
                <p className="text-gray-600">Phone: {verifiedOrder.user.phone}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(verifiedOrder.status)}`}>
                {verifiedOrder.status.charAt(0).toUpperCase() + verifiedOrder.status.slice(1)}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              {verifiedOrder.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.quantity}x {item.menuItem?.name || 'Waffle Item'}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 font-semibold">
                <div className="flex justify-between">
                  <span>Total: ₹{verifiedOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              {['confirmed', 'preparing', 'ready', 'completed'].map(status => (
                <button
                  key={status}
                  onClick={() => updateOrderStatus(verifiedOrder._id, status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    verifiedOrder.status === status
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Orders List */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-6">All Orders</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">Order ID</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Items</th>
                <th className="text-left py-3 px-4">Total</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Time</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-mono font-semibold">
                    #{order.pickupCode}
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{order.user.name}</p>
                      <p className="text-sm text-gray-500">{order.user.phone}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      {order.items.map((item, index) => (
                        <div key={index}>
                          {item.quantity}x {item.menuItem?.name || 'Waffle Item'}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold">
                    ₹{order.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="text-sm border border-gray-200 rounded px-2 py-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No orders found
          </div>
        )}
      </div>
        </>
      )}
      
      {activeTab === 'menu' && <MenuManagement />}
      
      {activeTab === 'profile' && <AdminProfile />}
      
      {activeTab === 'prices' && <PriceEditor />}
      
      {activeTab === 'coupons' && <CouponManagement />}
    </div>
  );
};

export default AdminDashboard;