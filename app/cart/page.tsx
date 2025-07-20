'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CartItem } from '@/components/CartItem';
import { Button } from '@/components/ui/button';


interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      setCart(JSON.parse(cartData));
    }
    setLoading(false);
  }, []);

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    const updatedCart = cart.map(item => 
      item.productId === productId ? { ...item, quantity } : item
    );
    
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (productId: string) => {
    const updatedCart = cart.filter(item => item.productId !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.price * item.quantity), 
    0
  );

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Button 
            onClick={() => router.push('/shop')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="divide-y">
                {cart.map((item) => (
                  <CartItem
                    key={item.productId}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-3 border-t">
                  <span>Estimated Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full bg-blue-600 hover:bg-blue-700 py-3"
              >
                Proceed to Checkout
              </Button>

              <Button
                onClick={() => router.push('/shop')}
                variant="outline"
                className="w-full mt-4 py-3"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}