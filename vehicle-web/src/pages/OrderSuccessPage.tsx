import { Link } from 'react-router-dom';

const OrderSuccessPage = () => {
  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6 text-center">
              <svg 
                className="mx-auto h-24 w-24 text-green-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              
              <h1 className="mt-4 text-3xl font-bold text-neutral-900">Order Successful!</h1>
              <p className="mt-2 text-lg text-neutral-600">
                Thank you for your purchase. Your order has been received and is being processed.
              </p>
              
              <div className="mt-8 border-t border-neutral-200 pt-8">
                <h2 className="text-lg font-medium text-neutral-900">What's Next?</h2>
                <p className="mt-2 text-neutral-600">
                  You will receive an email confirmation shortly with order details.
                  Our team will be in touch regarding delivery arrangements.
                </p>
                
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Link 
                    to="/"
                    className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Continue Shopping
                  </Link>
                  <Link 
                    to="/order-history"
                    className="inline-flex justify-center items-center px-4 py-2 border border-neutral-300 text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View Order History
                  </Link>
                </div>
              </div>
              
              <div className="mt-8 bg-blue-50 rounded-lg p-4 text-left">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Note</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        This is a demo application. No actual vehicles have been purchased.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage; 