import React, { useState } from 'react';
import { Star, Clock, Plus, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const MenuCard = ({ item }) => {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [currentImage, setCurrentImage] = useState(0);
  
  const hasMultipleImages = item.secondaryImage && item.image;
  
  const nextImage = () => {
    setCurrentImage(1);
  };
  
  const prevImage = () => {
    setCurrentImage(0);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    addItem(item);
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <div className="card hover:shadow-lg transition-all duration-300 group hover-lift bg-white border-primary-200">
      <div className="relative overflow-hidden rounded-lg mb-4">
        <div className="relative w-full h-48 overflow-hidden">
          <img
            src={currentImage === 0 || !hasMultipleImages ? 
              (item.image || "https://source.unsplash.com/400x300/?waffle,dessert") : 
              item.secondaryImage}
            alt={item.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Image Navigation Arrows */}
          {hasMultipleImages && (
            <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={(e) => { e.stopPropagation(); prevImage(); }} 
                className={`p-1.5 rounded-full bg-white/80 shadow hover:bg-white ${currentImage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={currentImage === 0}
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); nextImage(); }} 
                className={`p-1.5 rounded-full bg-white/80 shadow hover:bg-white ${currentImage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={currentImage === 1}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
          
          {/* Image Counter */}
          {hasMultipleImages && (
            <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-0.5 rounded text-xs">
              {currentImage + 1}/2
            </div>
          )}
        </div>
        {item.isPopular && (
          <div className="absolute top-2 left-2 bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Popular
          </div>
        )}
        {item.discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            {item.discount}% OFF
          </div>
        )}
        <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 cursor-pointer">
          <Heart size={16} className="text-primary-500" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
          <div className="text-right">
            <p className="text-xl font-bold text-primary-600">₹{item.price}</p>
            {item.discount > 0 && (
              <p className="text-sm text-gray-500 line-through">
                ₹{(item.price / (1 - item.discount / 100)).toFixed(2)}
              </p>
            )}
          </div>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span>{item.rating}</span>
            <span>({item.reviewCount})</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock size={16} />
            <span>{item.preparationTime} min</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {item.ingredients?.slice(0, 3).map((ingredient, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              {ingredient}
            </span>
          ))}
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full btn-primary flex items-center justify-center space-x-2 hover-lift"
        >
          <Plus size={20} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default MenuCard;