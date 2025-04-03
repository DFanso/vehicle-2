import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleQuantityChange = (id: number, e: React.ChangeEvent<HTMLSelectElement>) => {
    const quantity = parseInt(e.target.value);
    updateQuantity(id, quantity);
  };

  const handleRemove = (id: number) => {
    removeFromCart(id);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
      return;
    }
    
    setIsCheckingOut(true);
    // Simulate API call delay
    setTimeout(() => {
      navigate('/checkout');
    }, 1000);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-neutral-900 mb-6">Your Cart</h1>
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <svg className="mx-auto h-16 w-16 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="mt-4 text-lg text-neutral-600">Your cart is empty</p>
            <Link to="/" className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-neutral-900 mb-6">Your Cart</h1>
      
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="border-b border-neutral-200">
          <div className="hidden md:grid md:grid-cols-12 py-3 px-4 text-sm font-medium text-neutral-500 bg-neutral-50">
            <div className="md:col-span-6">Vehicle</div>
            <div className="md:col-span-2 text-center">Price</div>
            <div className="md:col-span-2 text-center">Quantity</div>
            <div className="md:col-span-2 text-center">Total</div>
          </div>
        </div>
        
        <div>
          {items.map(item => (
            <div key={item.id} className="border-b border-neutral-200 last:border-b-0">
              <div className="py-4 px-4 md:grid md:grid-cols-12 md:gap-x-6 md:items-center">
                <div className="flex items-center md:col-span-6">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-neutral-200">
                    <img 
                      src={item.imageUrl || "https://placehold.co/600x400?text=Vehicle"} 
                      alt={item.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-base font-medium text-neutral-900">
                          <Link to={`/vehicles/${item.id}`} className="hover:text-blue-600">
                            {item.name}
                          </Link>
                        </h3>
                      </div>
                      <p className="mt-1 text-sm text-neutral-500">{item.brand} {item.model}</p>
                    </div>
                    <div className="mt-2 md:hidden">
                      <p className="text-sm font-medium text-neutral-900">${item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex flex-1 items-end justify-between mt-2 md:hidden">
                      <div className="flex">
                        <select
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, e)}
                          className="max-w-full rounded-md border border-neutral-300 py-1.5 text-sm text-neutral-900 focus:border-blue-500 focus:ring-blue-500"
                        >
                          {[...Array(10).keys()].map(num => (
                            <option key={num + 1} value={num + 1}>
                              {num + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="hidden md:block md:col-span-2 text-center">
                  <span className="text-sm font-medium text-neutral-900">${item.price.toLocaleString()}</span>
                </div>
                
                <div className="hidden md:flex md:col-span-2 justify-center">
                  <select
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, e)}
                    className="max-w-full rounded-md border border-neutral-300 py-1.5 text-sm text-neutral-900 focus:border-blue-500 focus:ring-blue-500"
                  >
                    {[...Array(10).keys()].map(num => (
                      <option key={num + 1} value={num + 1}>
                        {num + 1}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="hidden md:block md:col-span-2 text-center text-sm font-medium text-neutral-900">
                  ${(item.price * item.quantity).toLocaleString()}
                  <div className="mt-1">
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      className="text-xs font-medium text-blue-600 hover:text-blue-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Cart summary */}
      <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-x-12">
        <div className="lg:col-span-7">
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => clearCart()}
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Clear Cart
            </button>
            <Link
              to="/"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
        
        <div className="mt-6 rounded-lg border border-neutral-200 bg-white shadow-sm lg:col-span-5 lg:mt-0">
          <div className="border-b border-neutral-200 py-6 px-4 sm:px-6">
            <h2 className="text-lg font-medium text-neutral-900">Order Summary</h2>
          </div>
          
          <div className="px-4 py-6 sm:p-6">
            <div className="flow-root">
              <dl className="divide-y divide-neutral-200">
                <div className="flex items-center justify-between py-4">
                  <dt className="text-base font-medium text-neutral-900">Subtotal</dt>
                  <dd className="text-base font-medium text-neutral-900">${getCartTotal().toLocaleString()}</dd>
                </div>
                <div className="flex items-center justify-between py-4">
                  <dt className="text-base font-medium text-neutral-900">Shipping</dt>
                  <dd className="text-base font-medium text-green-600">Free</dd>
                </div>
                <div className="flex items-center justify-between py-4">
                  <dt className="text-base font-bold text-neutral-900">Order Total</dt>
                  <dd className="text-base font-bold text-neutral-900">${getCartTotal().toLocaleString()}</dd>
                </div>
              </dl>
            </div>
          </div>
          
          <div className="border-t border-neutral-200 py-6 px-4 sm:px-6">
            <button
              type="button"
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full rounded-md border border-transparent bg-blue-600 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isCheckingOut ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 