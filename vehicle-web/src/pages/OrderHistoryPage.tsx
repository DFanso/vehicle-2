import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';

interface OrderItem {
  id: number;
  vehicleId: number;
  vehicleName: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
}

interface Order {
  id: number;
  userEmail: string;
  shippingAddress: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

// This interface represents the API response structure
interface OrdersResponse {
  content: Order[];
  totalPages: number;
}

const OrderHistoryPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=order-history');
      return;
    }

    fetchOrders();
  }, [isAuthenticated, page, navigate]);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response: OrdersResponse = await apiService.getUserOrders(page, 10, 'createdAt', 'desc');
      setOrders(response.content);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch your order history. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Format date string to a more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge color based on status
  const getStatusBadgeClass = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'PROCESSING':
        return 'bg-primary-light/30 text-primary-dark border border-primary-light/50';
      case 'SHIPPED':
        return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border border-neutral-200';
    }
  };

  const toggleOrderDetails = (orderId: number) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  return (
    <div className="bg-gradient-to-b from-orange-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-neutral-900">Order History</h1>
          <div className="mt-4 md:mt-0">
            <Link to="/" className="inline-flex items-center text-primary hover:text-primary-dark transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Continue Shopping
            </Link>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-xl shadow-sm border border-red-100">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white shadow-md rounded-xl p-10 text-center border border-orange-100">
            <div className="mx-auto h-24 w-24 rounded-full bg-orange-50 flex items-center justify-center">
              <svg className="h-12 w-12 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="mt-6 text-xl font-semibold text-neutral-900">No orders found</h2>
            <p className="mt-2 text-neutral-600">You haven't placed any orders yet.</p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-5 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white shadow-md rounded-xl overflow-hidden border border-orange-100">
                <div className="px-6 py-5 border-b border-neutral-200 bg-orange-50/50">
                  <div className="flex flex-wrap items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 hidden sm:block">
                        <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                            <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-0 sm:ml-4">
                        <h3 className="text-lg font-semibold text-neutral-900">Order #{order.id}</h3>
                        <p className="mt-1 text-sm text-neutral-500">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="mt-2 sm:mt-0 text-base font-medium text-primary-dark">
                        ${order.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => toggleOrderDetails(order.id)}
                      className="text-sm font-medium text-primary hover:text-primary-dark transition-colors flex items-center"
                    >
                      {expandedOrder === order.id ? 'Hide Details' : 'View Details'}
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-4 w-4 ml-1 transition-transform duration-200 ${expandedOrder === order.id ? 'rotate-180' : ''}`} 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {expandedOrder === order.id && (
                  <div className="px-6 py-5">
                    <div className="flow-root mt-2">
                      <h4 className="text-sm font-medium text-neutral-900 mb-3">Items</h4>
                      <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 overflow-hidden">
                        {order.items.map(item => (
                          <li key={item.id} className="py-4 px-4 hover:bg-orange-50/30 transition-colors">
                            <div className="flex items-center">
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="text-sm font-medium text-neutral-900">{item.vehicleName}</p>
                                    <p className="text-sm text-neutral-500 mt-1">
                                      Quantity: {item.quantity} × ${item.pricePerUnit.toLocaleString()}
                                    </p>
                                  </div>
                                  <p className="text-sm font-medium text-primary-dark">
                                    ${item.totalPrice.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-6 border-t border-neutral-200 pt-4">
                      <div className="flex justify-between items-start">
                        <div className="text-sm">
                          <p className="font-medium text-neutral-900">Shipping Address:</p>
                          <p className="mt-1 text-neutral-500">{order.shippingAddress}</p>
                        </div>
                        <div className="bg-orange-50 px-4 py-2 rounded-lg border border-orange-100">
                          <p className="text-xs font-medium text-neutral-500">Total Amount</p>
                          <p className="text-lg font-bold text-primary">${order.totalAmount.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPage(idx)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === idx
                          ? 'z-10 bg-orange-50 border-primary text-primary'
                          : 'bg-white border-neutral-300 text-neutral-500 hover:bg-neutral-50'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page === totalPages - 1}
                    className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage; 