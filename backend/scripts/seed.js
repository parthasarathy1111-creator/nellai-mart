const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Shop = require('../models/Shop');
const ShopProduct = require('../models/ShopProduct');
const Banner = require('../models/Banner');
const ActivityLog = require('../models/ActivityLog');
const generateSlug = require('../utils/slugify');

const seedDatabase = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Connected to MongoDB.');

    console.log('🧹 Cleaning up existing collections...');
    await Promise.all([
      Admin.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Shop.deleteMany({}),
      ShopProduct.deleteMany({}),
      Banner.deleteMany({}),
      ActivityLog.deleteMany({}),
    ]);
    console.log('✅ Cleaned up old data.');

    // 1. Create Super Admin
    console.log('👤 Creating Super Admin...');
    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash('Admin@123456', 10);
    const admin = await Admin.create({
      name: 'Nellai Mart Super Admin',
      email: 'admin@nellaimart.com',
      passwordHash,
      role: 'super_admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    });
    console.log(`✅ Admin created: admin@nellaimart.com / Admin@123456`);

    // 2. Create Categories
    console.log('📦 Creating Categories...');
    const categoryData = [
      { name: 'Fresh Vegetables & Fruits', icon: '🥦', description: 'Farm fresh organic vegetables and seasonal fruits sourced directly from local Tirunelveli farmers.', sortOrder: 1 },
      { name: 'Groceries & Staples', icon: '🌾', description: 'Quality rice, pulses, cooking oils, spices, and daily kitchen essentials.', sortOrder: 2 },
      { name: 'Nellai Sweets & Snacks', icon: '🍬', description: 'Famous Tirunelveli Halwa, Mixture, Murukku, and traditional south Indian snacks.', sortOrder: 3 },
      { name: 'Dairy & Bakery', icon: '🥛', description: 'Fresh milk, butter, ghee, curd, artisan bread, and fresh cakes.', sortOrder: 4 },
      { name: 'Personal Care & Health', icon: '🌿', description: 'Ayurvedic products, soap, shampoo, health drinks, and wellness items.', sortOrder: 5 },
    ];

    const categories = [];
    for (const cat of categoryData) {
      const created = await Category.create({
        ...cat,
        slug: generateSlug(cat.name),
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
      });
      categories.push(created);
    }
    console.log(`✅ Created ${categories.length} categories.`);

    // 3. Create Shops in Tirunelveli
    console.log('🏪 Creating Hyperlocal Shops...');
    const shopData = [
      {
        name: 'Iruttukadai Halwa Store',
        ownerName: 'Harihara Iyer',
        phone: '+919876543210',
        email: 'iruttukadai@nellai.com',
        address: 'East Car Street, Near Nellaiyappar Temple',
        locality: 'Tirunelveli Town',
        city: 'Tirunelveli',
        category: 'Sweets & Snacks',
        timing: '5:30 PM - 9:30 PM',
        rating: 4.9,
        reviewCount: 450,
        isVerified: true,
        isFeatured: true,
        status: 'ACTIVE',
        isOpen: true,
        geoLocation: { type: 'Point', coordinates: [77.6974, 8.7274] },
        logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300',
        bannerAddress: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000',
      },
      {
        name: 'Nellai Organic Farmer Store',
        ownerName: 'Subramanian K',
        phone: '+919876543211',
        email: 'organic@nellai.com',
        address: 'High Ground Road, Near Sarah Tucker College',
        locality: 'Palayamkottai',
        city: 'Tirunelveli',
        category: 'Fresh Vegetables & Fruits',
        timing: '7:00 AM - 9:00 PM',
        rating: 4.7,
        reviewCount: 180,
        isVerified: true,
        isFeatured: true,
        status: 'ACTIVE',
        isOpen: true,
        geoLocation: { type: 'Point', coordinates: [77.7289, 8.7135] },
        logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300',
        bannerAddress: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1000',
      },
      {
        name: 'Vannarpettai Super Bazaar',
        ownerName: 'Muthu Raman',
        phone: '+919876543212',
        email: 'bazaar@nellai.com',
        address: 'Trivandrum Road, Opp. Bus Stand',
        locality: 'Vannarpettai',
        city: 'Tirunelveli',
        category: 'Groceries & Staples',
        timing: '8:00 AM - 10:00 PM',
        rating: 4.6,
        reviewCount: 220,
        isVerified: true,
        isFeatured: false,
        status: 'ACTIVE',
        isOpen: true,
        geoLocation: { type: 'Point', coordinates: [77.7123, 8.7201] },
        logo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=300',
        bannerAddress: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1000',
      },
      {
        name: 'Junction Fresh Milk & Bakery',
        ownerName: 'Alexander V',
        phone: '+919876543213',
        email: 'junctionbakery@nellai.com',
        address: 'Madurai Road, Near Railway Junction',
        locality: 'Tirunelveli Junction',
        city: 'Tirunelveli',
        category: 'Dairy & Bakery',
        timing: '6:00 AM - 10:30 PM',
        rating: 4.5,
        reviewCount: 140,
        isVerified: true,
        isFeatured: false,
        status: 'ACTIVE',
        isOpen: true,
        geoLocation: { type: 'Point', coordinates: [77.6991, 8.7350] },
        logo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300',
        bannerAddress: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1000',
      },
    ];

    const shops = [];
    for (const shop of shopData) {
      const created = await Shop.create({
        ...shop,
        slug: generateSlug(shop.name),
      });
      shops.push(created);
    }
    console.log(`✅ Created ${shops.length} shops.`);

    // 4. Create Products
    console.log('🛍️ Creating Products...');
    const productData = [
      {
        name: 'Original Tirunelveli Wheat Halwa',
        brand: 'Iruttukadai',
        description: 'Authentic melting wheat halwa made using Thamirabarani water and pure cow ghee.',
        unit: '500 g',
        category: categories[2]._id, // Sweets & Snacks
        tags: ['Halwa', 'Nellai Special', 'Ghee Sweets', 'Iruttukadai'],
        isFeatured: true,
        images: ['https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=600'],
      },
      {
        name: 'Farm Fresh Organic Tomato',
        brand: 'Nellai Organic',
        description: 'Naturally grown red tomatoes harvested fresh daily from Surandai farms.',
        unit: '1 kg',
        category: categories[0]._id, // Vegetables
        tags: ['Organic', 'Tomato', 'Vegetables', 'Fresh'],
        isFeatured: true,
        images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600'],
      },
      {
        name: 'Ponni Boiled Rice Premium',
        brand: 'Thamirabarani Gold',
        description: 'Aged premium Tanjore Ponni rice perfect for everyday South Indian meals.',
        unit: '5 kg',
        category: categories[1]._id, // Groceries
        tags: ['Rice', 'Ponni Rice', 'Staples'],
        isFeatured: false,
        images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600'],
      },
      {
        name: 'Pure Cow Milk Fresh',
        brand: 'Aavin',
        description: 'Pasteurized homogenized pure cow milk packed with nutrients.',
        unit: '500 ml',
        category: categories[3]._id, // Dairy
        tags: ['Milk', 'Dairy', 'Aavin'],
        isFeatured: false,
        images: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600'],
      },
      {
        name: 'Herbal Neem & Turmeric Soap',
        brand: 'Nellai Herbs',
        description: 'Traditional handcrafted soap enriched with pure neem and wild turmeric extracts.',
        unit: '125 g',
        category: categories[4]._id, // Personal Care
        tags: ['Ayurvedic', 'Soap', 'Personal Care', 'Herbal'],
        isFeatured: false,
        images: ['https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=600'],
      },
    ];

    const products = [];
    for (const prod of productData) {
      const created = await Product.create({
        ...prod,
        slug: generateSlug(prod.name),
      });
      products.push(created);
    }
    console.log(`✅ Created ${products.length} products.`);

    // 5. Create ShopProduct mappings (Inventory & Pricing)
    console.log('🔗 Mapping Products to Shops...');
    const shopProductsData = [
      { shop: shops[0]._id, product: products[0]._id, price: 180, mrp: 200, discountText: '10% OFF', stockStatus: 'IN_STOCK' },
      { shop: shops[1]._id, product: products[1]._id, price: 35, mrp: 45, discountText: '22% OFF', stockStatus: 'IN_STOCK' },
      { shop: shops[2]._id, product: products[2]._id, price: 340, mrp: 380, discountText: 'Rs. 40 OFF', stockStatus: 'IN_STOCK' },
      { shop: shops[3]._id, product: products[3]._id, price: 28, mrp: 30, discountText: 'MRP', stockStatus: 'IN_STOCK' },
      { shop: shops[1]._id, product: products[4]._id, price: 65, mrp: 75, discountText: '13% OFF', stockStatus: 'IN_STOCK' },
    ];

    for (const sp of shopProductsData) {
      await ShopProduct.create({ ...sp, isAvailable: true });
    }
    console.log('✅ Mapped products to shops with local pricing.');

    // 6. Create Banners
    console.log('🖼️ Creating Banners...');
    await Banner.create([
      {
        title: 'Fresh Local Groceries Delivered in Tirunelveli',
        subtitle: 'Support local vendors from Palayamkottai, Town & Junction with instant price comparison.',
        imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200',
        linkUrl: '/search?category=groceries',
        sortOrder: 1,
        isActive: true,
      },
      {
        title: 'Authentic Iruttukadai Wheat Halwa',
        subtitle: 'Direct from East Car Street, Tirunelveli Town to your doorstep.',
        imageUrl: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=1200',
        linkUrl: '/product/original-tirunelveli-wheat-halwa',
        sortOrder: 2,
        isActive: true,
      },
    ]);
    console.log('✅ Created homepage hero banners.');

    // 7. Initial Activity Log
    await ActivityLog.create({
      admin: admin._id,
      action: 'SYSTEM_SEED',
      module: 'SYSTEM',
      description: 'Database initialized and seeded with Nellai Mart v1 default dataset.',
      ipAddress: '127.0.0.1',
    });

    console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedDatabase();
