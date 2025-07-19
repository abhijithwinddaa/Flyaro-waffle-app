const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
const User = require('./models/User');
require('dotenv').config();

const menuItems = [
  {
    name: "Classic Belgian Waffle",
    description: "Traditional Belgian waffle with crispy exterior and fluffy interior",
    price: 8.99,
    image: "/images/waffles/classic-belgian.jpg",
    category: "Classic",
    rating: 4.8,
    reviewCount: 156,
    ingredients: ["Flour", "Eggs", "Milk", "Butter", "Sugar"],
    nutritionInfo: { calories: 320, protein: 8, carbs: 45, fat: 12 },
    preparationTime: 12,
    isPopular: true
  },
  {
    name: "Chocolate Chip Waffle",
    description: "Belgian waffle loaded with premium chocolate chips",
    price: 10.99,
    image: "/images/chocolate-chip.jpg",
    category: "Sweet",
    rating: 4.9,
    reviewCount: 203,
    ingredients: ["Flour", "Eggs", "Milk", "Butter", "Chocolate Chips"],
    nutritionInfo: { calories: 380, protein: 9, carbs: 52, fat: 16 },
    preparationTime: 15,
    isPopular: true
  },
  {
    name: "Strawberry Delight",
    description: "Fresh strawberries with whipped cream on golden waffle",
    price: 12.99,
    image: "/images/strawberry-delight.jpg",
    category: "Fruit",
    rating: 4.7,
    reviewCount: 89,
    ingredients: ["Flour", "Eggs", "Milk", "Fresh Strawberries", "Whipped Cream"],
    nutritionInfo: { calories: 350, protein: 7, carbs: 48, fat: 14 },
    preparationTime: 18
  },
  {
    name: "Nutella Heaven",
    description: "Warm waffle drizzled with Nutella and crushed hazelnuts",
    price: 11.99,
    image: "/images/nutella-heaven.jpg",
    category: "Sweet",
    rating: 4.9,
    reviewCount: 178,
    ingredients: ["Flour", "Eggs", "Milk", "Nutella", "Hazelnuts"],
    nutritionInfo: { calories: 420, protein: 10, carbs: 55, fat: 18 },
    preparationTime: 14,
    isPopular: true
  },
  {
    name: "Banana Caramel",
    description: "Sliced bananas with rich caramel sauce",
    price: 10.49,
    image: "/images/banana-caramel.jpg",
    category: "Fruit",
    rating: 4.6,
    reviewCount: 92,
    ingredients: ["Flour", "Eggs", "Milk", "Bananas", "Caramel Sauce"],
    nutritionInfo: { calories: 365, protein: 8, carbs: 58, fat: 13 },
    preparationTime: 16
  },
  {
    name: "Savory Cheese Waffle",
    description: "Crispy waffle with melted cheese and herbs",
    price: 9.99,
    image: "/images/savory-cheese.jpg",
    category: "Savory",
    rating: 4.5,
    reviewCount: 67,
    ingredients: ["Flour", "Eggs", "Milk", "Cheddar Cheese", "Herbs"],
    nutritionInfo: { calories: 340, protein: 15, carbs: 35, fat: 16 },
    preparationTime: 13
  },
  {
    name: "Blueberry Burst",
    description: "Fresh blueberries baked into fluffy waffle",
    price: 11.49,
    image: "/images/blueberry-burst.jpg",
    category: "Fruit",
    rating: 4.8,
    reviewCount: 134,
    ingredients: ["Flour", "Eggs", "Milk", "Fresh Blueberries", "Maple Syrup"],
    nutritionInfo: { calories: 335, protein: 7, carbs: 49, fat: 12 },
    preparationTime: 17
  },
  {
    name: "Cinnamon Sugar",
    description: "Warm waffle dusted with cinnamon and sugar",
    price: 8.49,
    image: "/images/cinnamon-sugar.jpg",
    category: "Classic",
    rating: 4.7,
    reviewCount: 98,
    ingredients: ["Flour", "Eggs", "Milk", "Cinnamon", "Sugar"],
    nutritionInfo: { calories: 310, protein: 7, carbs: 44, fat: 11 },
    preparationTime: 11
  },
  {
    name: "Maple Pecan",
    description: "Toasted pecans with pure maple syrup",
    price: 13.99,
    image: "/images/maple-pecan.jpg",
    category: "Premium",
    rating: 4.9,
    reviewCount: 156,
    ingredients: ["Flour", "Eggs", "Milk", "Pecans", "Maple Syrup"],
    nutritionInfo: { calories: 445, protein: 9, carbs: 52, fat: 22 },
    preparationTime: 19,
    isPopular: true
  },
  {
    name: "Ice Cream Waffle",
    description: "Warm waffle served with vanilla ice cream",
    price: 12.49,
    image: "/images/ice-cream-waffle.jpg",
    category: "Dessert",
    rating: 4.8,
    reviewCount: 187,
    ingredients: ["Flour", "Eggs", "Milk", "Vanilla Ice Cream", "Chocolate Sauce"],
    nutritionInfo: { calories: 485, protein: 10, carbs: 62, fat: 20 },
    preparationTime: 15
  },
  {
    name: "Lemon Zest",
    description: "Light waffle with fresh lemon zest and powdered sugar",
    price: 9.49,
    image: "/images/lemon-zest.jpg",
    category: "Citrus",
    rating: 4.6,
    reviewCount: 73,
    ingredients: ["Flour", "Eggs", "Milk", "Lemon Zest", "Powdered Sugar"],
    nutritionInfo: { calories: 295, protein: 7, carbs: 42, fat: 10 },
    preparationTime: 13
  },
  {
    name: "Oreo Crunch",
    description: "Crushed Oreo cookies mixed into waffle batter",
    price: 11.99,
    image: "/images/oreo-crunch.jpg",
    category: "Sweet",
    rating: 4.9,
    reviewCount: 201,
    ingredients: ["Flour", "Eggs", "Milk", "Oreo Cookies", "Cream"],
    nutritionInfo: { calories: 410, protein: 8, carbs: 58, fat: 17 },
    preparationTime: 16,
    isPopular: true
  },
  {
    name: "Peanut Butter Delight",
    description: "Creamy peanut butter spread with banana slices",
    price: 10.99,
    image: "/images/peanut-butter.jpg",
    category: "Nut",
    rating: 4.7,
    reviewCount: 112,
    ingredients: ["Flour", "Eggs", "Milk", "Peanut Butter", "Bananas"],
    nutritionInfo: { calories: 395, protein: 14, carbs: 48, fat: 18 },
    preparationTime: 14
  },
  {
    name: "Red Velvet Waffle",
    description: "Rich red velvet waffle with cream cheese frosting",
    price: 13.49,
    image: "/images/red-velvet.jpg",
    category: "Premium",
    rating: 4.8,
    reviewCount: 145,
    ingredients: ["Flour", "Eggs", "Milk", "Cocoa", "Cream Cheese"],
    nutritionInfo: { calories: 425, protein: 9, carbs: 55, fat: 19 },
    preparationTime: 20
  },
  {
    name: "Coconut Paradise",
    description: "Toasted coconut flakes with tropical fruit",
    price: 12.99,
    image: "/images/coconut-paradise.jpg",
    category: "Tropical",
    rating: 4.6,
    reviewCount: 88,
    ingredients: ["Flour", "Eggs", "Milk", "Coconut", "Tropical Fruits"],
    nutritionInfo: { calories: 375, protein: 8, carbs: 51, fat: 15 },
    preparationTime: 17
  },
  {
    name: "Bacon & Cheese",
    description: "Crispy bacon bits with melted cheese",
    price: 12.99,
    image: "/images/bacon-cheese.jpg",
    category: "Savory",
    rating: 4.7,
    reviewCount: 156,
    ingredients: ["Flour", "Eggs", "Milk", "Bacon", "Cheese"],
    nutritionInfo: { calories: 455, protein: 18, carbs: 38, fat: 24 },
    preparationTime: 18
  },
  {
    name: "Apple Cinnamon",
    description: "Caramelized apples with warm cinnamon spice",
    price: 10.49,
    image: "/images/apple-cinnamon.jpg",
    category: "Fruit",
    rating: 4.8,
    reviewCount: 123,
    ingredients: ["Flour", "Eggs", "Milk", "Apples", "Cinnamon"],
    nutritionInfo: { calories: 345, protein: 7, carbs: 52, fat: 12 },
    preparationTime: 16
  },
  {
    name: "S'mores Waffle",
    description: "Graham cracker, chocolate, and marshmallow",
    price: 13.99,
    image: "/images/smores-waffle.jpg",
    category: "Dessert",
    rating: 4.9,
    reviewCount: 189,
    ingredients: ["Flour", "Eggs", "Milk", "Graham Crackers", "Marshmallows", "Chocolate"],
    nutritionInfo: { calories: 465, protein: 9, carbs: 68, fat: 18 },
    preparationTime: 19,
    isPopular: true
  },
  {
    name: "Matcha Green Tea",
    description: "Japanese matcha powder with white chocolate drizzle",
    price: 11.99,
    image: "/images/matcha-waffle.jpg",
    category: "Specialty",
    rating: 4.5,
    reviewCount: 76,
    ingredients: ["Flour", "Eggs", "Milk", "Matcha Powder", "White Chocolate"],
    nutritionInfo: { calories: 355, protein: 8, carbs: 48, fat: 14 },
    preparationTime: 15
  },
  {
    name: "Caramel Apple Pie",
    description: "Spiced apples with caramel sauce and pie crust crumbs",
    price: 14.49,
    image: "/images/caramel-apple-pie.jpg",
    category: "Premium",
    rating: 4.9,
    reviewCount: 167,
    ingredients: ["Flour", "Eggs", "Milk", "Spiced Apples", "Caramel", "Pie Crust"],
    nutritionInfo: { calories: 485, protein: 8, carbs: 72, fat: 18 },
    preparationTime: 22,
    isPopular: true
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Only create admin user, don't add menu items
    const adminExists = await User.findOne({ email: 'admin@waffles.com' });
    if (!adminExists) {
      const admin = new User({
        name: 'Admin',
        email: 'admin@waffles.com',
        password: 'admin123',
        phone: '1234567890',
        address: 'Shop Address',
        role: 'admin'
      });
      await admin.save();
    }
    
    console.log('Admin user created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();