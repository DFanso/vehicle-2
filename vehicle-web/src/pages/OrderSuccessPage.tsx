import { Link } from 'react-router-dom';

const OrderSuccessPage = () => {
  return (
    <div className="bg-gradient-to-b from-orange-50 to-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <div className="px-4 py-8 sm:p-10 text-center">
              <div className="mx-auto h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
                <svg 
                  className="h-16 w-16 text-green-600" 
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
              </div>
              
              <h1 className="mt-6 text-3xl font-bold text-neutral-900">Order Successful!</h1>
              <p className="mt-2 text-lg text-neutral-600">
                Thank you for your purchase. Your order has been received and is being processed.
              </p>
              
              <div className="mt-10 border-t border-neutral-200 pt-8">
                <h2 className="text-xl font-semibold text-neutral-900">What's Next?</h2>
                <p className="mt-3 text-neutral-600">
                  You will receive an email confirmation shortly with order details.
                  Our team will be in touch regarding delivery arrangements.
                </p>
                
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Link 
                    to="/"
                    className="inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Continue Shopping
                  </Link>
                  <Link 
                    to="/order-history"
                    className="inline-flex justify-center items-center px-4 py-3 border border-neutral-300 text-sm font-medium rounded-lg text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    View Order History
                  </Link>
                </div>
              </div>
              
              <div className="mt-10 bg-orange-50 rounded-xl p-6 text-left border border-orange-100">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-primary-dark">Note</h3>
                    <div className="mt-2 text-sm text-neutral-700">
                      <p>
                        This is a demo application. No actual vehicles have been purchased.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">Recommended for You</h3>
            <p className="text-neutral-600 mb-6">Based on your recent order, you might also like:</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-40 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1580273916550-e323be2ae537" alt="SUV" className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-neutral-900">Premium SUVs</h4>
                  <p className="text-sm text-neutral-500 mt-1">Explore our collection</p>
                  <Link to="/vehicles?type=SUV" className="mt-3 text-sm font-medium text-primary inline-block">View more</Link>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-40 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1603553329474-99f95f35394f" alt="Convertible" className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-neutral-900">Luxury Models</h4>
                  <p className="text-sm text-neutral-500 mt-1">Premium selection</p>
                  <Link to="/vehicles?type=COUPE" className="mt-3 text-sm font-medium text-primary inline-block">View more</Link>
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