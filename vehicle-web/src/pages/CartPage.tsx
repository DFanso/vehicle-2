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
      <div className="bg-gradient-to-b from-orange-50 to-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-neutral-900 mb-6">Your Cart</h1>
            <div className="bg-white p-10 rounded-xl shadow-sm border border-orange-100 max-w-md mx-auto">
              <div className="h-24 w-24 mx-auto bg-orange-50 rounded-full flex items-center justify-center">
                <svg className="h-12 w-12 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="mt-6 text-lg text-neutral-600">Your cart is empty</p>
              <p className="text-neutral-500 text-sm mt-1 mb-6">Add some vehicles to get started!</p>
              <Link to="/" className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors">
                Browse Vehicles
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-orange-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-neutral-900 mb-6">Your Cart</h1>
        
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <div className="border-b border-neutral-200">
            <div className="hidden md:grid md:grid-cols-12 py-3 px-6 text-sm font-medium text-neutral-500 bg-orange-50">
              <div className="md:col-span-6">Vehicle</div>
              <div className="md:col-span-2 text-center">Price</div>
              <div className="md:col-span-2 text-center">Quantity</div>
              <div className="md:col-span-2 text-center">Total</div>
            </div>
          </div>
          
          <div>
            {items.map(item => (
              <div key={item.id} className="border-b border-neutral-200 last:border-b-0 hover:bg-orange-50/30 transition-colors">
                <div className="py-6 px-6 md:grid md:grid-cols-12 md:gap-x-6 md:items-center">
                  <div className="flex items-center md:col-span-6">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-neutral-200">
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
                            <Link to={`/vehicles/${item.id}`} className="hover:text-primary">
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
                            className="max-w-full rounded-md border border-neutral-300 py-1.5 text-sm text-neutral-900 focus:border-primary focus:ring-primary"
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
                          className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
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
                      className="max-w-full rounded-md border border-neutral-300 py-1.5 text-sm text-neutral-900 focus:border-primary focus:ring-primary"
                    >
                      {[...Array(10).keys()].map(num => (
                        <option key={num + 1} value={num + 1}>
                          {num + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="hidden md:block md:col-span-2 text-center text-sm font-medium text-primary-dark">
                    ${(item.price * item.quantity).toLocaleString()}
                    <div className="mt-1">
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        className="text-xs font-medium text-primary hover:text-primary-dark transition-colors"
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
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
              <button
                type="button"
                onClick={() => clearCart()}
                className="text-sm font-medium text-primary-dark hover:text-primary transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Clear Cart
              </button>
              <Link
                to="/"
                className="text-sm font-medium text-primary hover:text-primary-dark transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>
          
          <div className="mt-6 rounded-xl border border-orange-100 bg-white shadow-md lg:col-span-5 lg:mt-0">
            <div className="border-b border-neutral-200 py-6 px-6">
              <h2 className="text-xl font-semibold text-neutral-900">Order Summary</h2>
            </div>
            
            <div className="px-6 py-6">
              <div className="flow-root">
                <dl className="divide-y divide-neutral-200">
                  <div className="flex items-center justify-between py-4">
                    <dt className="text-base font-medium text-neutral-700">Subtotal</dt>
                    <dd className="text-base font-medium text-neutral-900">${getCartTotal().toLocaleString()}</dd>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <dt className="text-base font-medium text-neutral-700">Shipping</dt>
                    <dd className="text-base font-medium text-green-600">Free</dd>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <dt className="text-base font-bold text-neutral-900">Order Total</dt>
                    <dd className="text-xl font-bold text-primary">${getCartTotal().toLocaleString()}</dd>
                  </div>
                </dl>
              </div>
            </div>
            
            <div className="border-t border-neutral-200 py-6 px-6">
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full rounded-lg border border-transparent bg-primary py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
              </button>
              
              <div className="mt-4 flex items-center justify-center text-sm text-neutral-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Secure checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 