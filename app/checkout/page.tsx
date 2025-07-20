'use client';

import { useState, useEffect } from 'react';
import { CartItem } from '@/components/CartItem';
import { Button } from '@/components/ui/button';

export default function CheckoutPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      setCart(JSON.parse(cartData));
    }
    setLoading(false);
  }, []);

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.price * item.quantity), 
    0
  );

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping and Payment Info */}
        <div>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <input type="text" className="w-full border rounded px-3 py-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <input type="text" className="w-full border rounded px-3 py-2" required />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input type="text" className="w-full border rounded px-3 py-2" required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input type="text" className="w-full border rounded px-3 py-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ZIP Code</label>
                  <input type="text" className="w-full border rounded px-3 py-2" required />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <select className="w-full border rounded px-3 py-2" required>
                  <option value="">Select Country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input type="tel" className="w-full border rounded px-3 py-2" required />
              </div>
            </form>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input type="radio" id="credit-card" name="payment" defaultChecked />
                <label htmlFor="credit-card">Credit Card</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="radio" id="paypal" name="payment" />
                <label htmlFor="paypal">PayPal</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="radio" id="bank-transfer" name="payment" />
                <label htmlFor="bank-transfer">Bank Transfer</label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="divide-y">
              {cart.map((item) => (
                <div key={item.productId} className="py-3 flex justify-between">
                  <div>
                    <p>{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 mt-4 pt-4 border-t">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-3 border-t">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
            
            <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 py-3">
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}