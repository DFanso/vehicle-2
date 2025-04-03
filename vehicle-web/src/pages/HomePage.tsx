import { useState, useEffect } from 'react';
import VehicleCard from '../components/VehicleCard';
import VehicleFilter from '../components/VehicleFilter';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';

interface Vehicle {
  id: number;
  name: string;
  brand: string;
  model: string;
  price: number;
  type: string;
  fuelType: string;
  imageUrl: string;
  quantityAvailable: number;
  description?: string;
  year?: number;
  color?: string;
}

interface FilterState {
  brand: string;
  type: string;
  fuelType: string;
  minPrice: string;
  maxPrice: string;
}

interface ApiResponse {
  content: Vehicle[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

const API_BASE_URL = 'http://localhost:8080';

const HomePage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [filters, setFilters] = useState<FilterState>({} as FilterState);
  const { addToCart } = useCart();
  
  const fetchVehicles = async (currentFilters: FilterState = {} as FilterState, pageNum: number = 0) => {
    setLoading(true);
    
    try {
      const params = new URLSearchParams();
      params.append('page', pageNum.toString());
      params.append('size', '10');
      params.append('sortBy', 'price');
      params.append('sortDir', 'asc');
      
      if (currentFilters.brand) params.append('brand', currentFilters.brand);
      if (currentFilters.type) params.append('type', currentFilters.type);
      if (currentFilters.fuelType) params.append('fuelType', currentFilters.fuelType);
      if (currentFilters.minPrice) params.append('minPrice', currentFilters.minPrice);
      if (currentFilters.maxPrice) params.append('maxPrice', currentFilters.maxPrice);
      
      const response = await axios.get<ApiResponse>(`${API_BASE_URL}/api/vehicles`, { params });
      
      setVehicles(response.data.content);
      setTotalPages(response.data.totalPages);
      setPage(response.data.number);
      setError(null);
    } catch {
      setError('Failed to load vehicles. Please try again later.');
      // Fallback to mock data in case the API is not available
      setVehicles(mockVehicles);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchVehicles();
  }, []);
  
  // Mock data for fallback if API is unavailable
  const mockVehicles: Vehicle[] = [
    {
      id: 1,
      name: "Tesla Model 3",
      model: "Model 3",
      brand: "Tesla",
      year: 2024,
      color: "White",
      price: 45000,
      quantityAvailable: 5,
      description: "The Tesla Model 3 is an electric four-door sedan. Standard features include autopilot capabilities and over-the-air software updates.",
      type: "SEDAN",
      fuelType: "ELECTRIC",
      imageUrl: "https://images.unsplash.com/photo-1562911791-c7a97b729ec5?q=80&w=1000"
    },
    {
      id: 2,
      name: "Toyota RAV4",
      model: "RAV4",
      brand: "Toyota",
      year: 2024,
      color: "Silver",
      price: 32000,
      quantityAvailable: 8,
      description: "The Toyota RAV4 is a compact crossover SUV with excellent fuel economy and reliability.",
      type: "SUV",
      fuelType: "HYBRID",
      imageUrl: "https://hips.hearstapps.com/hmg-prod/images/2025-toyota-rav4-101-6707e09a230c3.jpg"
    },
    {
      id: 3,
      name: "BMW M4",
      model: "M4",
      brand: "BMW",
      year: 2024,
      color: "Black",
      price: 75000,
      quantityAvailable: 3,
      description: "The BMW M4 is a high-performance luxury sports car with twin-turbo engine and advanced driving dynamics.",
      type: "COUPE",
      fuelType: "PETROL",
      imageUrl: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068"
    },
    {
      id: 4,
      name: "Porsche 911",
      model: "911 Carrera",
      brand: "Porsche",
      year: 2024,
      color: "Red",
      price: 115000,
      quantityAvailable: 2,
      description: "The iconic Porsche 911 Carrera offers exceptional performance and luxury in a timeless design.",
      type: "COUPE",
      fuelType: "PETROL",
      imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70"
    },
    {
      id: 5,
      name: "Ford F-150",
      model: "F-150 Lightning",
      brand: "Ford",
      year: 2024,
      color: "Blue",
      price: 55000,
      quantityAvailable: 0,
      description: "The all-electric Ford F-150 Lightning combines legendary truck capability with zero emissions.",
      type: "TRUCK",
      fuelType: "ELECTRIC",
      imageUrl: "https://images.unsplash.com/photo-1583121274602-3e2820c69888"
    },
    {
      id: 6,
      name: "Honda Civic",
      model: "Civic",
      brand: "Honda",
      year: 2024,
      color: "Gray",
      price: 28000,
      quantityAvailable: 12,
      description: "The Honda Civic is a practical and fuel-efficient compact car with modern features and reliability.",
      type: "SEDAN",
      fuelType: "PETROL",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Honda_Civic_e-HEV_Sport_%28XI%29_%E2%80%93_f_30062024.jpg"
    }
  ];
  
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    fetchVehicles(newFilters, 0); // Reset to first page when filters change
  };
  
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
      fetchVehicles(filters, newPage);
    }
  };

  const handleAddToCart = (vehicleId: number, quantity: number) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      addToCart({
        id: vehicle.id,
        name: vehicle.name,
        brand: vehicle.brand,
        model: vehicle.model,
        price: vehicle.price,
        imageUrl: vehicle.imageUrl
      }, quantity);
    }
  };
  
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-700 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:w-2/3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Find Your Perfect Vehicle
            </h1>
            <p className="text-xl mb-8">
              Browse our extensive collection of quality vehicles with easy filtering and competitive prices.
            </p>
            <div className="space-x-4">
              <a href="/vehicles" className="inline-block bg-white text-blue-700 px-6 py-3 rounded-md font-medium hover:bg-neutral-100 transition-colors">
                Browse Vehicles
              </a>
              <a href="/cart" className="inline-block border border-white text-white px-6 py-3 rounded-md font-medium hover:bg-blue-800 transition-colors">
                View Cart
              </a>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-indigo-800/50 mix-blend-overlay"></div>
      </section>
      
      {/* Featured Vehicles Section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900">Featured Vehicles</h2>
            <p className="mt-4 text-lg text-neutral-600">
              Discover our selection of top vehicles for every need and budget
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <VehicleFilter onFilterChange={handleFilterChange} />
            </div>
            
            <div className="md:col-span-2 lg:col-span-3">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 p-4 rounded-md text-red-700">
                  {error}
                </div>
              ) : vehicles.length === 0 ? (
                <div className="bg-neutral-50 p-8 rounded-lg text-center">
                  <h3 className="text-lg font-medium text-neutral-800">No vehicles found</h3>
                  <p className="mt-2 text-neutral-600">Try adjusting your filters to find what you're looking for.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vehicles.map(vehicle => (
                      <VehicleCard 
                        key={vehicle.id} 
                        {...vehicle} 
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                      <nav className="inline-flex rounded-md shadow">
                        <button
                          onClick={() => handlePageChange(page - 1)}
                          disabled={page === 0}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        
                        {[...Array(totalPages).keys()].map(i => (
                          <button
                            key={i}
                            onClick={() => handlePageChange(i)}
                            className={`relative inline-flex items-center px-4 py-2 border border-neutral-300 bg-white text-sm font-medium ${
                              page === i ? 'text-blue-600 bg-blue-50' : 'text-neutral-700 hover:bg-neutral-50'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => handlePageChange(page + 1)}
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
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className="bg-neutral-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to find your dream vehicle?</h2>
          <p className="text-lg text-neutral-300 mb-8 max-w-3xl mx-auto">
            Our team of experts is ready to help you find the perfect vehicle for your needs and budget.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Contact Us Today
          </a>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 