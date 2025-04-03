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
      
      {/* Featured Categories */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900">Browse by Category</h2>
            <p className="mt-4 text-lg text-neutral-600">
              Find the right vehicle category for your needs
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <a href="/vehicles?type=SEDAN" className="group">
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg">
                <div className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-light/30 flex items-center justify-center group-hover:bg-primary-light transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 17h14m-11-3h2m6 0h2M3 10h18M5 7h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-primary transition-colors">Sedans</h3>
                </div>
              </div>
            </a>
            
            <a href="/vehicles?type=SUV" className="group">
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg">
                <div className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-light/30 flex items-center justify-center group-hover:bg-primary-light transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 17h14m-11-3h2m6 0h2M3 8h18M7 4h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-primary transition-colors">SUVs</h3>
                </div>
              </div>
            </a>
            
            <a href="/vehicles?type=TRUCK" className="group">
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg">
                <div className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-light/30 flex items-center justify-center group-hover:bg-primary-light transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 15v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2m9-4H3.4a.4.4 0 0 1-.4-.4V5a2 2 0 0 1 2-2h11.6a2 2 0 0 1 2 2v6h2a2 2 0 0 1 2 2v.5a.5.5 0 0 1-.5.5h-1.5" />
                      <circle cx="7" cy="16" r="2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-primary transition-colors">Trucks</h3>
                </div>
              </div>
            </a>
            
            <a href="/vehicles?fuelType=ELECTRIC" className="group">
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg">
                <div className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-light/30 flex items-center justify-center group-hover:bg-primary-light transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14.5 11h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20 19l-4.99-5z" />
                      <path d="M6.5 14a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                      <path d="M10 7l4-6h5l-4 6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-primary transition-colors">Electric</h3>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>
      
      {/* Featured Vehicles Section */}
      <section id="featured" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900">Featured Vehicles</h2>
            <p className="mt-4 text-lg text-neutral-600">
              Discover our selection of top vehicles for every need and budget
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <div className="sticky top-24 bg-orange-50 rounded-xl p-6 shadow">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Filter Vehicles</h3>
                <VehicleFilter onFilterChange={handleFilterChange} />
              </div>
            </div>
            
            <div className="md:col-span-3">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 p-4 rounded-md text-red-700">
                  {error}
                </div>
              ) : vehicles.length === 0 ? (
                <div className="bg-orange-50 p-8 rounded-lg text-center">
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
                              page === i ? 'text-primary bg-orange-50 border-primary' : 'text-neutral-700 hover:bg-neutral-50'
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
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-dark/30 rounded-2xl p-10 backdrop-blur">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Ready to find your dream vehicle?</h2>
              <p className="text-lg text-orange-100 mb-8">
                Our team of experts is ready to help you find the perfect vehicle for your needs and budget.
              </p>
              <a 
                href="/contact" 
                className="inline-block bg-white text-primary px-8 py-3 rounded-md font-medium hover:bg-orange-50 transition-colors"
              >
                Contact Us Today
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 