'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { ProductCardProps } from '@/types';

export function ProductCard({ product }: ProductCardProps) {
  const price = product.salePrice || product.price;
  const isOnSale = product.salePrice !== null;

  const addToCart = () => {
    // Get existing cart or initialize empty array
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already in cart
    const existingItem = cart.find((item: any) => item.productId === product.id);
    
    if (existingItem) {
      // Update quantity if already in cart
      existingItem.quantity += 1;
    } else {
      // Add new item to cart
      cart.push({
        productId: product.id,
        name: product.name,
        price: price,
        quantity: 1,
        imageUrl: product.imageUrls[0] || '/placeholder-product.jpg'
      });
    }
    
    // Save back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Optional: Show notification or toast
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="aspect-square relative bg-gray-100">
          <Image
            src={product.imageUrls[0] || '/placeholder-product.jpg'}
            alt={product.name}
            width={400}
            height={400}
            className="object-cover w-full h-full"
          />
          {isOnSale && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              SALE
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium mb-1 hover:text-blue-600">{product.name}</h3>
        </Link>
        
        <div className="flex items-center gap-2 mb-3">
          <span className={`font-bold ${isOnSale ? 'text-red-600' : 'text-gray-900'}`}>
            ${price.toFixed(2)}
          </span>
          {isOnSale && (
            <span className="text-sm text-gray-500 line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
        
        <Button 
          onClick={addToCart}
          className="w-full bg-blue-600 hover:bg-blue-700"
          size="sm"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}