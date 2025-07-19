import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Save, X, Upload, ChevronLeft, ChevronRight, Image } from 'lucide-react';
import toast from 'react-hot-toast';

const MenuManagement = () => {
  const [items, setItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Classic',
    ingredients: '',
    preparationTime: 15,
    isPopular: false
  });
  const [images, setImages] = useState([null, null]);
  const [imagePreview, setImagePreview] = useState([null, null]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const categories = ['Classic', 'Sweet', 'Fruit', 'Premium', 'Savory', 'Dessert', 'Specialty'];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/menu/admin/all');
      setItems(response.data);
    } catch (error) {
      toast.error('Failed to fetch items');
    }
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImagePreview = [...imagePreview];
        newImagePreview[index] = reader.result;
        setImagePreview(newImagePreview);
        
        const newImages = [...images];
        newImages[index] = file;
        setImages(newImages);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a base item data object
      const itemData = {
        ...formData,
        price: parseFloat(formData.price),
        ingredients: formData.ingredients.split(',').map(i => i.trim()),
        image: imagePreview[0] || 'https://source.unsplash.com/400x300/?waffle,dessert'
      };
      
      // Add second image if available
      if (imagePreview[1]) {
        itemData.secondaryImage = imagePreview[1];
      }

      if (editingItem) {
        await axios.put(`http://localhost:5000/api/menu/${editingItem._id}`, itemData);
        toast.success('Item updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/menu', itemData);
        toast.success('Item added successfully');
      }

      resetForm();
      fetchItems();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`http://localhost:5000/api/menu/${id}`);
        toast.success('Item deleted successfully');
        fetchItems();
      } catch (error) {
        toast.error('Failed to delete item');
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      ingredients: item.ingredients?.join(', ') || '',
      preparationTime: item.preparationTime,
      isPopular: item.isPopular
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Classic',
      ingredients: '',
      preparationTime: 15,
      isPopular: false
    });
    setEditingItem(null);
    setShowAddForm(false);
    setImages([null, null]);
    setImagePreview([null, null]);
    setCurrentImageIndex(0);
  };
  
  const nextImage = () => {
    setCurrentImageIndex(1);
  };
  
  const prevImage = () => {
    setCurrentImageIndex(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Menu Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Item</span>
        </button>
      </div>

      {showAddForm && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </h3>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Price (₹)</label>
              <input
                type="number"
                step="0.01"
                required
                className="input-field"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                required
                className="input-field"
                rows="2"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                className="input-field"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Prep Time (min)</label>
              <input
                type="number"
                className="input-field"
                value={formData.preparationTime}
                onChange={(e) => setFormData({ ...formData, preparationTime: parseInt(e.target.value) })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Ingredients (comma separated)</label>
              <input
                type="text"
                className="input-field"
                value={formData.ingredients}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPopular"
                className="mr-2"
                checked={formData.isPopular}
                onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
              />
              <label htmlFor="isPopular" className="text-sm font-medium">Mark as Popular</label>
            </div>

            <div className="md:col-span-2 mb-4">
              <label className="block text-sm font-medium mb-2">Item Images (Up to 2)</label>
              <div className="border border-dashed border-primary-300 rounded-lg p-4">
                {/* Image Preview/Slider */}
                {(imagePreview[0] || imagePreview[1]) && (
                  <div className="relative mb-4 h-64 bg-gray-100 rounded-lg overflow-hidden">
                    {/* Image */}
                    <img 
                      src={imagePreview[currentImageIndex] || 'https://source.unsplash.com/400x300/?waffle,dessert'} 
                      alt="Food preview" 
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Navigation Arrows */}
                    {imagePreview[0] && imagePreview[1] && (
                      <div className="absolute inset-0 flex items-center justify-between px-2">
                        <button 
                          type="button"
                          onClick={prevImage} 
                          className={`p-2 rounded-full bg-white/80 shadow hover:bg-white ${currentImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={currentImageIndex === 0}
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button 
                          type="button"
                          onClick={nextImage} 
                          className={`p-2 rounded-full bg-white/80 shadow hover:bg-white ${currentImageIndex === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={currentImageIndex === 1}
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    )}
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                      {currentImageIndex + 1}/{imagePreview.filter(img => img !== null).length}
                    </div>
                  </div>
                )}
                
                {/* Upload Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block w-full cursor-pointer">
                      <div className={`flex flex-col items-center justify-center p-4 border rounded-lg ${imagePreview[0] ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-gray-50'} hover:bg-primary-100 transition-colors`}>
                        <Upload size={24} className={imagePreview[0] ? 'text-primary-500' : 'text-gray-400'} />
                        <span className="mt-2 text-sm font-medium">{imagePreview[0] ? 'Change Image 1' : 'Upload Image 1'}</span>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleImageChange(e, 0)}
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block w-full cursor-pointer">
                      <div className={`flex flex-col items-center justify-center p-4 border rounded-lg ${imagePreview[1] ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-gray-50'} hover:bg-primary-100 transition-colors`}>
                        <Upload size={24} className={imagePreview[1] ? 'text-primary-500' : 'text-gray-400'} />
                        <span className="mt-2 text-sm font-medium">{imagePreview[1] ? 'Change Image 2' : 'Upload Image 2'}</span>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleImageChange(e, 1)}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2 flex space-x-4">
              <button type="submit" className="btn-primary flex items-center space-x-2">
                <Save size={16} />
                <span>{editingItem ? 'Update' : 'Add'} Item</span>
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Price</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item._id} className="border-b">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.description.substring(0, 50)}...</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">{item.category}</td>
                  <td className="py-3 px-4">₹{item.price}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;