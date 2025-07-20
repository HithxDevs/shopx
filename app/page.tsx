'use client';

import { useUser } from '@clerk/nextjs';
import AdminDashboard from "@/components/AdminDashboard";
import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Menu, X, Star, Heart, Filter, ChevronDown, Package, Truck, Shield, RotateCcw, User, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

// import EcommerceLanding from "@/components/UserDashboard";


interface Category {
  id: number;
  name: string;
  icon: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  salePrice: number | null;
  image: string;
  rating: number;
  reviews: number;
  badge: string;
}

interface BannerOffer {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
}

interface CartItem extends Product {
  quantity: number;
}

// Mock data with proper typing
const categories: Category[] = [
  { id: 1, name: 'Cars', icon: '🚗' },
  { id: 2, name: 'Bags & Accessories', icon: '👜' },
  { id: 3, name: 'autos', icon: '🚘' },
  { id: 4, name: 'Tractors', icon: '🚜' },
  { id: 5, name: 'Furniture', icon: '🏠' }

];

const featuredProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    price: 99.99,
    salePrice: 79.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    rating: 4.5,
    reviews: 234,
    badge: 'Bestseller'
  },
  {
    id: 2,
    name: 'Smart Watch Series 7',
    price: 399.99,
    salePrice: 299.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
    rating: 4.8,
    reviews: 156,
    badge: 'New'
  },
  {
    id: 3,
    name: 'Wireless Charging Pad',
    price: 49.99,
    salePrice: 29.99,
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=300&fit=crop',
    rating: 4.3,
    reviews: 89,
    badge: 'Sale'
  },
  {
    id: 4,
    name: 'Premium Laptop Stand',
    price: 79.99,
    salePrice: 59.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop',
    rating: 4.6,
    reviews: 67,
    badge: 'Hot'
  },
  {
    id: 5,
    name: 'Bluetooth Speaker',
    price: 129.99,
    salePrice: 89.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop',
    rating: 4.4,
    reviews: 198,
    badge: 'Trending'
  },
  {
    id: 6,
    name: 'Gaming Mouse',
    price: 89.99,
    salePrice: 69.99,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=300&fit=crop',
    rating: 4.7,
    reviews: 342,
    badge: 'Popular'
  }
];

const bannerOffers: BannerOffer[] = [
  {
    id: 1,
    title: 'Summer Sale!',
    subtitle: 'Up to 70% off on Electronics',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop',
    cta: 'Shop Now'
  },
  {
    id: 2,
    title: 'New Arrivals',
    subtitle: 'Latest Fashion Trends',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
    cta: 'Explore'
  },
  {
    id: 3,
    title: 'Home Essentials',
    subtitle: 'Transform your space',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=400&fit=crop',
    cta: 'Browse'
  }
];




export default function Home() {
  const { user, isLoaded } = useUser();

  

  // Show loading state while user data is being fetched
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user has admin role
  const isAdmin = user?.publicMetadata?.role === 'admin';

  // Render based on user role
  if (isAdmin) {
    return <AdminDashboard />;
  } else {
    return <EcommerceLanding />;
  }
}





const EcommerceLanding = () => {
  const [currentBanner, setCurrentBanner] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');

  // Auto-rotate banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerOffers.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bannerOffers.length]);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const calculateDiscount = (price: number, salePrice: number | null): number => {
    if (!salePrice) return 0;
    return Math.round(((price - salePrice) / price) * 100);
  };

  interface ProductCardProps {
    product: Product;
  }

  const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.badge && (
          <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded-full">
            {product.badge}
          </span>
        )}
        <button 
          onClick={() => toggleWishlist(product)}
          className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
            wishlist.some(item => item.id === product.id)
              ? 'bg-red-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Heart size={16} />
        </button>
        {product.salePrice && (
          <div className="absolute top-2 right-12 bg-green-500 text-white px-2 py-1 text-xs rounded">
            {calculateDiscount(product.price, product.salePrice)}% OFF
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center mr-2">
            <Star className="text-yellow-400 fill-current" size={16} />
            <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
          </div>
          <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
        </div>
        
        <div className="flex items-center mb-3">
          <span className="text-lg font-bold text-gray-900">
            ${product.salePrice || product.price}
          </span>
          {product.salePrice && (
            <span className="text-sm text-gray-500 line-through ml-2">
              ${product.price}
            </span>
          )}
        </div>
        
        <button 
          onClick={() => addToCart(product)}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <ShoppingCart size={16} className="mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mt-6">
      {/* Header */}
      <header className="p-2 bg-white shadow-sm transition-all duration-300">
        

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
           

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-2">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for products, brands and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-800" onClick={() => window.location.href = '/cart'}>
                <ShoppingCart size={24} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>
      </header>

      {/* Navigation Categories */}
     <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <div className="flex items-center justify-between h-4">
      {/* Categories */}
      <div className="flex items-center space-x-1 overflow-x-auto py-2 hide-scrollbar">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center space-x-2 text-sm font-medium whitespace-nowrap px-4 py-2 rounded-md transition-colors duration-200 ${
              selectedCategory === category.id
                ? 'bg-blue-50 text-blue-600 border border-blue-100'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="text-base">{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
      
      {/* Filter Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 ml-4 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors duration-200"
      >
        <Filter size={16} className="mr-2" />
        <span>Filters</span>
      </button>
    </div>
     </div>
    </nav>
    </div>

<style jsx>{`
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
`}</style>

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzMiAyIDIgNHYyYzAgMi0yIDQtMiA0cy0yLTItMi00di0yem0wLTEwVjEwaDEwdjEwaDEwdjEwSDM2di0xMHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                  🚀 Premium Quality Since 2020
                </div>
                <h1 className="text-6xl lg:text-7xl font-black leading-tight">
                  UPGRADE YOUR
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-white">
                    RIDE WITH
                  </span>
                  <span className="block">PREMIUM STYLE</span>
                </h1>
                <p className="text-xl text-orange-100 leading-relaxed">
                  మీ వాహనాన్ని మా ప్రీమియం సీట్ కవర్లు మరియు సంచులతో మార్చండి. 
                  సౌకర్యం కోసం రూపొందించబడింది, శైలి కోసం నిర్మించబడింది, మన్నిక కోసం రూపొందించబడింది.
                </p>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex -space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-4 border-white shadow-lg"></div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full border-4 border-white shadow-lg"></div>
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">10k+</span>
                  </div>
                </div>
                <div>
                  <div className="text-lg font-semibold">10,000+ Happy Customers</div>
                  <div className="text-orange-200 text-sm">Join the GIRI family today</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                onClick={() => window.location.href = '/shop'}
                className="group bg-white text-orange-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-orange-50 transition-all duration-300 inline-flex items-center justify-center transform hover:scale-105 shadow-2xl">
                  SHOP NOW
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="group bg-transparent border-2 border-white text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-orange-600 transition-all duration-300 inline-flex items-center justify-center">
                  View Collection
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative">
                <img 
                  src="https://elegantautoretail.com/cdn/shop/files/Blue-3_df508b21-82e5-4026-a9bb-48ad4410cadb_1000x.jpg?v=1689923451"
                  alt="Premium seat covers"
                  className="rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute -bottom-8 -right-8 bg-white text-gray-900 p-6 rounded-2xl shadow-2xl">
                  <div className="text-3xl font-black text-orange-500">4.8★</div>
                  <div className="text-sm font-medium text-gray-600">Customer Rating</div>
                  <div className="text-xs text-gray-500">Based on 2,847 reviews</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
            <img
              src={bannerOffers[currentBanner].image}
              alt={bannerOffers[currentBanner].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  {bannerOffers[currentBanner].title}
                </h2>
                <p className="text-xl mb-6">{bannerOffers[currentBanner].subtitle}</p>
                <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  {bannerOffers[currentBanner].cta}
                </button>
              </div>
            </div>
          </div>
          
          {/* Banner Indicators */}
          <div className="flex justify-center mt-4 space-x-2">
            {bannerOffers.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentBanner ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </section>



      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sort and Filter Bar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'Featured Products'}
          </h2>
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Load More Products
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">ShopKart</h3>
              <p className="text-gray-400 text-sm">
                Your one-stop destination for quality products at amazing prices.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Shipping</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Categories</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Electronics</a></li>
                <li><a href="#" className="hover:text-white">Fashion</a></li>
                <li><a href="#" className="hover:text-white">Home & Living</a></li>
                <li><a href="#" className="hover:text-white">Books</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Contact Info</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center">
                  <Phone size={16} className="mr-2" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <Mail size={16} className="mr-2" />
                  <span>support@shopkart.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2" />
                  <span>123 Commerce St, City</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 ShopKart. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="bg-white w-80 h-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Menu</h2>
              <button onClick={() => setShowMobileMenu(false)}>
                <X size={24} />
              </button>
            </div>
            <nav className="space-y-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center space-x-3 w-full text-left py-3 px-4 rounded-lg hover:bg-gray-100"
                >
                  <span className="text-2xl">{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};