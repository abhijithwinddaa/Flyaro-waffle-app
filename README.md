# Flyaro - Hello Waffle Love! 🧇

A full-stack MERN application for Flyaro's premium waffle delivery service with modern UI/UX and comprehensive features.

## Features

### Core Features
- **User Authentication** - Registration, login, and profile management
- **Menu Display** - 20 premium waffle items with ratings, prices, and descriptions
- **Shopping Cart** - Add/remove items, quantity management
- **Order Management** - Place orders with 4-digit pickup codes
- **Admin Dashboard** - Order management and pickup code verification

### Enhanced Features for Retention
- **Loyalty Points System** - Earn points with every purchase
- **Favorites System** - Save favorite menu items
- **Search & Filter** - Find waffles by name or category
- **Order History** - Track all previous orders
- **Real-time Status Updates** - Order progress tracking
- **Special Instructions** - Custom order notes
- **Responsive Design** - Works on all devices

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- CORS enabled

### Frontend
- React 18 with Hooks
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls
- React Hot Toast for notifications
- Lucide React for icons

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Git

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update `.env` file with your MongoDB connection string and JWT secret

4. Seed the database with sample data:
   ```bash
   node seedData.js
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Usage

### For Customers
1. **Register/Login** - Create account or sign in
2. **Browse Menu** - View 20 premium waffle options
3. **Add to Cart** - Select items and quantities
4. **Place Order** - Checkout and receive pickup code
5. **Track Order** - Monitor order status
6. **Pickup** - Show 4-digit code at store

### For Admin
1. **Login** with admin credentials (admin@waffles.com / admin123)
2. **Verify Pickup Codes** - Enter customer's 4-digit code
3. **Manage Orders** - Update order status
4. **View Order History** - Track all orders

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get single menu item

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/admin` - Get all orders (admin)
- `POST /api/orders/verify-code` - Verify pickup code
- `PUT /api/orders/:id/status` - Update order status

### Users
- `POST /api/users/favorites/:itemId` - Toggle favorite item
- `GET /api/users/loyalty-points` - Get loyalty points

## Database Schema

### User Model
- Personal information (name, email, phone, address)
- Authentication (password hash)
- Role (user/admin)
- Loyalty points
- Favorite items
- Last login tracking

### MenuItem Model
- Product details (name, description, price, image)
- Category and availability
- Rating and review count
- Nutrition information
- Preparation time
- Popular/discount flags

### Order Model
- User reference
- Order items with quantities
- Total amount
- Unique 4-digit pickup code
- Order status tracking
- Payment status
- Loyalty points earned/used

## Security Features
- Password hashing with bcryptjs
- JWT token authentication
- Protected routes for admin functions
- Input validation and sanitization
- CORS configuration

## UI/UX Features
- **Clean Design** - Modern, minimalist interface
- **Premium Appearance** - Professional color scheme and typography
- **Responsive Layout** - Mobile-first design
- **Smooth Animations** - Hover effects and transitions
- **Intuitive Navigation** - Clear user flow
- **Visual Feedback** - Toast notifications and loading states

## Deployment

### Backend Deployment
1. Set up MongoDB Atlas or use local MongoDB
2. Configure environment variables
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to Netlify, Vercel, or serve with Express

## Contributing
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License
This project is licensed under the MIT License.

## Support
For support, email support@waffledelivery.com or create an issue in the repository.