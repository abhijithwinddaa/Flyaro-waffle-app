import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Calendar, Percent, Tag, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountPercent: 10,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get('https://flyaro-waffle-backend.onrender.com/api/coupons/admin');
      setCoupons(response.data);
    } catch (error) {
      toast.error('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://flyaro-waffle-backend.onrender.com/api/coupons', formData);
      toast.success('Coupon created successfully');
      setShowAddForm(false);
      resetForm();
      fetchCoupons();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create coupon');
    }
  };

  const toggleCouponStatus = async (id) => {
    try {
      await axios.patch(`https://flyaro-waffle-backend.onrender.com/api/coupons/${id}/toggle`);
      fetchCoupons();
      toast.success('Coupon status updated');
    } catch (error) {
      toast.error('Failed to update coupon status');
    }
  };

  const deleteCoupon = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await axios.delete(`https://flyaro-waffle-backend.onrender.com/api/coupons/${id}`);
        toast.success('Coupon deleted successfully');
        fetchCoupons();
      } catch (error) {
        toast.error('Failed to delete coupon');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discountPercent: 10,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  };

  const isExpired = (date) => {
    return new Date(date) < new Date();
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Coupon Management</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Create Coupon</span>
        </button>
      </div>

      {showAddForm && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Create New Coupon</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Coupon Code</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    required
                    className="input-field pl-10"
                    placeholder="WELCOME20"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Uppercase letters and numbers only</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Discount (%)</label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    className="input-field pl-10"
                    value={formData.discountPercent}
                    onChange={(e) => setFormData({ ...formData, discountPercent: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Expiry Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="date"
                    required
                    className="input-field pl-10"
                    value={formData.expiresAt}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Create Coupon
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Active Coupons</h3>
        
        {coupons.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No coupons found. Create your first coupon!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Code</th>
                  <th className="text-left py-3 px-4">Discount</th>
                  <th className="text-left py-3 px-4">Expires</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map(coupon => (
                  <tr key={coupon._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-primary-600">{coupon.code}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold">{coupon.discountPercent}%</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={isExpired(coupon.expiresAt) ? 'text-red-500' : ''}>
                        {new Date(coupon.expiresAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          coupon.isActive && !isExpired(coupon.expiresAt)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {coupon.isActive && !isExpired(coupon.expiresAt) ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => toggleCouponStatus(coupon._id)}
                          className={`p-1 rounded hover:bg-gray-100 ${
                            coupon.isActive ? 'text-green-600' : 'text-gray-400'
                          }`}
                          title={coupon.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {coupon.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                        </button>
                        <button
                          onClick={() => deleteCoupon(coupon._id)}
                          className="p-1 rounded text-red-600 hover:bg-gray-100"
                          title="Delete"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponManagement;
