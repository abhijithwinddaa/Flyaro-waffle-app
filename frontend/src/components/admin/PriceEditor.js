import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const PriceEditor = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('https://flyaro-waffle-backend.onrender.com/api/menu/admin/all');
      setItems(response.data);
    } catch (error) {
      toast.error('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (id, newPrice) => {
    setItems(items.map(item => 
      item._id === id ? { ...item, price: newPrice } : item
    ));
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      // Create an array of promises for all price updates
      const updatePromises = items.map(item => 
        axios.put(`https://flyaro-waffle-backend.onrender.com/api/menu/${item._id}`, { price: item.price })
      );
      
      // Wait for all updates to complete
      await Promise.all(updatePromises);
      
      toast.success('Prices updated successfully');
    } catch (error) {
      toast.error('Failed to update prices');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Price Management</h2>
        <div className="flex space-x-2">
          <button 
            onClick={fetchItems}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          <button 
            onClick={saveChanges}
            disabled={saving}
            className="btn-primary flex items-center space-x-2"
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Item</th>
              <th className="text-left py-3 px-4">Category</th>
              <th className="text-left py-3 px-4">Current Price (₹)</th>
              <th className="text-left py-3 px-4">New Price (₹)</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={item.image || `https://source.unsplash.com/100x100/?waffle,${item.name.replace(/\s+/g, '')}`}
                      alt={item.name}
                      className="w-10 h-10 rounded-md object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://source.unsplash.com/100x100/?waffle,dessert";
                      }}
                    />
                    <span className="font-medium">{item.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4">{item.category}</td>
                <td className="py-3 px-4 font-medium">₹{item.price}</td>
                <td className="py-3 px-4">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => handlePriceChange(item._id, parseFloat(e.target.value))}
                    className="input-field py-1 px-2 w-24"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriceEditor;
