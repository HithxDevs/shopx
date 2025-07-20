// types/index.ts

// Product Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  salePrice: number | null;
  imageUrls: string[];
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  category: string | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice: number | null;
    imageUrls: string[];
    isActive?: boolean;
  };
}

// Cart Types
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
}

// Filter Types
export interface FilterParams {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  sort?: 'price-asc' | 'price-desc' | 'newest';
}

export interface FilterSidebarProps {
  categories: string[];
  currentCategory?: string;
  minPrice?: string;
  maxPrice?: string;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: OrderItem[];
  paymentMethod?: string;
  paymentStatus?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productSlug: string;
  productImage?: string;
  price: number;
  quantity: number;
}

// User Types
export interface User {
  id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

// Utility Types
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type SortOption = 'price-asc' | 'price-desc' | 'newest';