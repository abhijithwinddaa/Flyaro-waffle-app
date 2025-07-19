import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 hover-subtle">
            <img 
              src="/images/flyaro-logo.png" 
              alt="Flyaro Logo" 
              className="w-12 h-12 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="w-10 h-10 bg-primary-500 rounded-lg items-center justify-center" style={{display: 'none'}}>
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-primary-700">Flyaro - Hello Waffle Love</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-500 font-medium">Home</Link>
            <Link to="/menu" className="text-gray-700 hover:text-primary-500 font-medium">Menu</Link>
            {isAuthenticated && (
              <Link to="/orders" className="text-gray-700 hover:text-primary-500 font-medium">My Orders</Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="relative p-2 text-gray-700 hover:text-primary-500">
                  <ShoppingCart size={24} />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>
                
                <div className="flex items-center space-x-2">
                  <User size={20} className="text-gray-700" />
                  <span className="text-gray-700 font-medium">{user?.name}</span>
                </div>

                {user?.role === 'admin' && (
                  <Link to="/admin" className="p-2 text-gray-700 hover:text-primary-500">
                    <Settings size={20} />
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-700 hover:text-red-500"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-primary-500 font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;