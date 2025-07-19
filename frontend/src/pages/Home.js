import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, Shield } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-orange-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <img 
                src="/images/flyaro-logo.png" 
                alt="Flyaro - Hello Waffle Love" 
                className="w-64 h-64 object-contain hover-lift"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-700 mb-6">
              Hello Waffle Love!
            </h1>
            <p className="text-xl text-primary-600 mb-8 max-w-2xl mx-auto">
              Welcome to Flyaro! Indulge in our handcrafted Belgian waffles made with premium ingredients. 
              Order now and taste the love in every bite.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/menu" className="btn-primary inline-flex items-center space-x-2">
                <span>Order Now</span>
                <ArrowRight size={20} />
              </Link>
              <Link to="/menu" className="btn-secondary">
                View Menu
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Waffle Delight?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to delivering the finest waffle experience with every order
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center hover-lift p-6 rounded-xl bg-white shadow-sm">
              <div className="w-16 h-16 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-primary-300 transition-colors">
                <Star className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-primary-700">Premium Quality</h3>
              <p className="text-primary-600">Made with finest Belgian waffle mix and premium toppings</p>
            </div>
            
            <div className="text-center hover-lift p-6 rounded-xl bg-white shadow-sm">
              <div className="w-16 h-16 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-primary-300 transition-colors">
                <Clock className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-primary-700">Quick Pickup</h3>
              <p className="text-primary-600">Ready in 15-20 minutes with convenient pickup codes</p>
            </div>
            
            <div className="text-center hover-lift p-6 rounded-xl bg-white shadow-sm">
              <div className="w-16 h-16 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-primary-300 transition-colors">
                <Shield className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-primary-700">Loyalty Rewards</h3>
              <p className="text-primary-600">Earn points with every order and get exclusive discounts</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Experience Premium Waffles?
          </h2>
          <p className="text-primary-100 mb-8 text-lg">
            Join thousands of satisfied customers who trust us for their waffle cravings
          </p>
          <Link to="/menu" className="bg-white text-primary-500 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
            Browse Our Menu
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;