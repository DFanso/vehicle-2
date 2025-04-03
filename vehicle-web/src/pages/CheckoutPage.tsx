import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';

interface CheckoutFormData {
  shippingAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phoneNumber: string;
}

const CheckoutPage = () => {
  const { items, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CheckoutFormData>({
    shippingAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Handle redirects in useEffect
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
    } else if (items.length === 0) {
      navigate('/cart');
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, items, navigate]);

  // Don't render the main content while checking auth or redirecting
  if (isLoading) {
    return <div className="bg-neutral-50 min-h-screen flex items-center justify-center">
      <p className="text-neutral-600">Loading...</p>
    </div>;
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutFormData> = {};
    
    if (!formData.shippingAddress.trim()) {
      newErrors.shippingAddress = 'Shipping address is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }
    
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setOrderError(null);

    // Create the complete shipping address string
    const fullShippingAddress = `${formData.shippingAddress}, ${formData.city}, ${formData.state} ${formData.zipCode}, ${formData.country}`;
    
    // Prepare order data according to API structure
    const orderData = {
      shippingAddress: fullShippingAddress,
      items: items.map(item => ({
        vehicleId: item.id,
        quantity: item.quantity
      }))
    };
    
    try {
      // Call the API to create the order
      await apiService.createOrder(orderData);
      
      // Order created successfully
      setOrderSuccess(true);
      clearCart(); // Clear the cart after successful order
      
      // Auto redirect to success page after 3 seconds
      setTimeout(() => {
        navigate('/order-success');
      }, 3000);
    } catch (error) {
      console.error('Error creating order:', error);
      setOrderError('Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-neutral-900 mb-6">Checkout</h1>
        
        {orderSuccess ? (
          <div className="bg-green-50 p-6 rounded-lg shadow-sm">
            <svg className="h-12 w-12 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <h2 className="text-xl font-semibold text-green-800 text-center mt-4">Order Placed Successfully!</h2>
            <p className="text-center text-green-700 mt-2">
              Thank you for your order. Your order has been received and is being processed.
            </p>
            <p className="text-center text-green-700 mt-1">
              You will be redirected to the order confirmation page in a few seconds...
            </p>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
            <div className="lg:col-span-7">
              <div className="bg-white shadow-sm rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-neutral-900 mb-4">Shipping Information</h2>
                  
                  {orderError && (
                    <div className="mb-4 bg-red-50 p-4 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">{orderError}</h3>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="shippingAddress" className="block text-sm font-medium text-neutral-700">
                        Street Address
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="shippingAddress"
                          name="shippingAddress"
                          value={formData.shippingAddress}
                          onChange={handleChange}
                          className={`block w-full rounded-md shadow-sm sm:text-sm ${
                            errors.shippingAddress ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-neutral-300 focus:border-blue-500 focus:ring-blue-500'
                          }`}
                        />
                        {errors.shippingAddress && (
                          <p className="mt-2 text-sm text-red-600">{errors.shippingAddress}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-neutral-700">
                          City
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className={`block w-full rounded-md shadow-sm sm:text-sm ${
                              errors.city ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-neutral-300 focus:border-blue-500 focus:ring-blue-500'
                            }`}
                          />
                          {errors.city && (
                            <p className="mt-2 text-sm text-red-600">{errors.city}</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-neutral-700">
                          State/Province
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className={`block w-full rounded-md shadow-sm sm:text-sm ${
                              errors.state ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-neutral-300 focus:border-blue-500 focus:ring-blue-500'
                            }`}
                          />
                          {errors.state && (
                            <p className="mt-2 text-sm text-red-600">{errors.state}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-neutral-700">
                          ZIP / Postal code
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            className={`block w-full rounded-md shadow-sm sm:text-sm ${
                              errors.zipCode ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-neutral-300 focus:border-blue-500 focus:ring-blue-500'
                            }`}
                          />
                          {errors.zipCode && (
                            <p className="mt-2 text-sm text-red-600">{errors.zipCode}</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-neutral-700">
                          Country
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className={`block w-full rounded-md shadow-sm sm:text-sm ${
                              errors.country ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-neutral-300 focus:border-blue-500 focus:ring-blue-500'
                            }`}
                          />
                          {errors.country && (
                            <p className="mt-2 text-sm text-red-600">{errors.country}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-neutral-700">
                        Phone Number
                      </label>
                      <div className="mt-1">
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          className={`block w-full rounded-md shadow-sm sm:text-sm ${
                            errors.phoneNumber ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-neutral-300 focus:border-blue-500 focus:ring-blue-500'
                          }`}
                        />
                        {errors.phoneNumber && (
                          <p className="mt-2 text-sm text-red-600">{errors.phoneNumber}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="pt-5">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => navigate('/cart')}
                          className="bg-white py-2 px-4 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Back to Cart
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? 'Processing...' : 'Place Order'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            
            <div className="mt-10 lg:mt-0 lg:col-span-5">
              <div className="bg-white shadow-sm rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-neutral-900 mb-4">Order Summary</h2>
                  
                  <div className="flow-root mt-6">
                    <ul className="-my-5 divide-y divide-neutral-200">
                      {items.map(item => (
                        <li key={item.id} className="py-5">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-16 h-16 rounded overflow-hidden border border-neutral-200">
                              <img 
                                src={item.imageUrl || "https://placehold.co/600x400?text=Vehicle"} 
                                alt={item.name}
                                className="w-full h-full object-cover object-center"
                              />
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-sm font-medium text-neutral-900">{item.name}</h3>
                                  <p className="text-sm text-neutral-500">{item.brand} {item.model}</p>
                                </div>
                                <div className="ml-4 flex-shrink-0">
                                  <span className="text-sm font-medium text-neutral-900">${item.price.toLocaleString()}</span>
                                </div>
                              </div>
                              <div className="mt-1 flex justify-between items-end">
                                <p className="text-sm text-neutral-500">Qty {item.quantity}</p>
                                <p className="text-sm font-medium text-neutral-900">${(item.price * item.quantity).toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-neutral-200">
                    <div className="flex justify-between">
                      <dt className="text-sm text-neutral-600">Subtotal</dt>
                      <dd className="text-sm font-medium text-neutral-900">${getCartTotal().toLocaleString()}</dd>
                    </div>
                    <div className="flex justify-between mt-2">
                      <dt className="text-sm text-neutral-600">Shipping</dt>
                      <dd className="text-sm font-medium text-green-600">Free</dd>
                    </div>
                    <div className="flex justify-between mt-2">
                      <dt className="text-sm text-neutral-600">Taxes</dt>
                      <dd className="text-sm font-medium text-neutral-900">Calculated at next step</dd>
                    </div>
                    <div className="flex justify-between mt-6 border-t border-neutral-200 pt-6">
                      <dt className="text-base font-medium text-neutral-900">Total</dt>
                      <dd className="text-base font-medium text-neutral-900">${getCartTotal().toLocaleString()}</dd>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Information</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        This is a demo checkout page. No actual payment will be processed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage; 