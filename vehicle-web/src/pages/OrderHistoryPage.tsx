import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-neutral-900 mb-6">Order History</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md">
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
          <div className="bg-white shadow-sm rounded-lg p-6 text-center">
            <svg className="h-12 w-12 text-neutral-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="mt-4 text-lg font-medium text-neutral-900">No orders found</h2>
            <p className="mt-2 text-sm text-neutral-500">You haven't placed any orders yet.</p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-neutral-200 bg-neutral-50">
                  <div className="flex flex-wrap items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-neutral-900">Order #{order.id}</h3>
                      <p className="mt-1 text-sm text-neutral-500">Placed on {formatDate(order.createdAt)}</p>
                    </div>
                    <div className="mt-2 sm:mt-0 flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="ml-4 text-sm font-medium text-neutral-900">
                        Total: ${order.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="px-4 py-5 sm:p-6">
                  <div className="flow-root mt-2">
                    <h4 className="text-sm font-medium text-neutral-900 mb-3">Items</h4>
                    <ul className="-my-5 divide-y divide-neutral-200">
                      {order.items.map(item => (
                        <li key={item.id} className="py-4">
                          <div className="flex items-center">
                            <div className="ml-3 flex-1">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-sm font-medium text-neutral-900">{item.vehicleName}</p>
                                  <p className="text-sm text-neutral-500">
                                    Quantity: {item.quantity} × ${item.pricePerUnit.toLocaleString()}
                                  </p>
                                </div>
                                <p className="text-sm font-medium text-neutral-900">
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
                      <div className="text-sm text-neutral-500">
                        <p className="font-medium text-neutral-900">Shipping Address:</p>
                        <p className="mt-1">{order.shippingAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="relative z-0 inline-flex shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-neutral-300 text-neutral-500 hover:bg-neutral-50'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page === totalPages - 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
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