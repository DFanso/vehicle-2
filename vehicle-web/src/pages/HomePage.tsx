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
      {/* Hero Section with carousel */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-dark to-primary">
        <div className="absolute inset-0 z-0 opacity-20">
          <svg className="h-full w-full" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <circle cx="4" cy="4" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="text-white">
              <div className="inline-block bg-primary-dark px-3 py-1 rounded-full text-sm font-medium mb-6 text-white shadow-md">
                Premium Vehicle Selection
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 text-white drop-shadow-md">
                Drive Your Dream <span className="text-orange-300">Today</span>
              </h1>
          
              
            </div>
            
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-300 rounded-full opacity-30 animate-pulse"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-400 rounded-full opacity-30 animate-pulse"></div>
                <img 
                  src="https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?q=80&w=2070" 
                  alt="Luxury Car" 
                  className="rounded-xl shadow-2xl object-cover transform rotate-2 transition-transform duration-500 hover:rotate-0"
                />
                <div className="absolute -bottom-4 left-10 right-10 bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Premium Selection</h3>
                      <p className="text-sm text-orange-300">Luxury, Sport, Electric & More</p>
                    </div>
                    <span className="bg-primary-light text-white px-3 py-1 rounded-full text-xs font-bold">
                      Save 15%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Best Prices</h3>
                <p className="text-xs text-orange-100">Guaranteed</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Quality Guarantee</h3>
                <p className="text-xs text-orange-100">100% Assured</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Fast Delivery</h3>
                <p className="text-xs text-orange-100">Within 24 hours</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Secure Payments</h3>
                <p className="text-xs text-orange-100">100% Safe</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#fff" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,224C384,224,480,256,576,240C672,224,768,160,864,144C960,128,1056,160,1152,176C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>
      
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
      <section id="featured" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <div className="inline-block bg-orange-100 px-3 py-1 rounded-full text-xs font-medium text-primary-dark mb-3">
                EXPLORE OUR SELECTION
              </div>
              <h2 className="text-3xl font-bold text-neutral-900">Featured Vehicles</h2>
              <p className="mt-3 text-lg text-neutral-600 max-w-2xl">
                Discover our handpicked selection of premium vehicles for every need and budget
              </p>
            </div>
            
            <div className="flex justify-center md:justify-end space-x-2">
              <div className="inline-flex rounded-md shadow-sm">
                <button 
                  onClick={() => handlePageChange(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button 
                  onClick={() => handlePageChange(Math.min(totalPages - 1, page + 1))}
                  disabled={page === totalPages - 1 || totalPages === 0}
                  className="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <button
                onClick={() => fetchVehicles(filters, 0)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="sticky top-24 bg-gradient-to-br from-orange-50 to-white rounded-xl p-6 shadow-md border border-orange-100">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                  </svg>
                  Filter Vehicles
                </h3>
                <VehicleFilter onFilterChange={handleFilterChange} />
              </div>
            </div>
            
            <div className="md:col-span-3">
              {loading ? (
                <div className="flex flex-col justify-center items-center h-64 bg-orange-50/50 rounded-xl">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                  <p className="text-neutral-600">Loading vehicles...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 p-6 rounded-xl text-red-700 border border-red-200 flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              ) : vehicles.length === 0 ? (
                <div className="bg-orange-50 p-8 rounded-xl text-center border border-orange-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-primary-light mb-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-lg font-medium text-neutral-800">No vehicles found</h3>
                  <p className="mt-2 text-neutral-600">Try adjusting your filters to find what you're looking for.</p>
                  <button 
                    onClick={() => {
                      setFilters({} as FilterState);
                      fetchVehicles({} as FilterState, 0);
                    }}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark"
                  >
                    Clear Filters
                  </button>
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
                    <div className="mt-10 flex justify-center">
                      <div className="bg-orange-50/70 inline-flex rounded-lg p-1 shadow-sm">
                        <button
                          onClick={() => handlePageChange(page - 1)}
                          disabled={page === 0}
                          className="relative inline-flex items-center px-3 py-2 rounded-l-md text-sm font-medium text-neutral-500 hover:bg-white hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                              page === i ? 'bg-white text-primary shadow-sm rounded-md' : 'text-neutral-700 hover:bg-white/60 hover:text-primary-dark transition-colors'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => handlePageChange(page + 1)}
                          disabled={page === totalPages - 1}
                          className="relative inline-flex items-center px-3 py-2 rounded-r-md text-sm font-medium text-neutral-500 hover:bg-white hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Next</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block bg-orange-100 px-3 py-1 rounded-full text-xs font-medium text-primary-dark mb-3">
              OUR HAPPY CUSTOMERS
            </div>
            <h2 className="text-3xl font-bold text-neutral-900">Trusted by Thousands</h2>
            <p className="mt-3 text-lg text-neutral-600 max-w-2xl mx-auto">
              Hear what our satisfied customers have to say about their experience with our vehicles and service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-orange-100 flex flex-col">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <img className="h-12 w-12 rounded-full" src="https://randomuser.me/api/portraits/women/32.jpg" alt="Sarah J." />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-neutral-900">Sarah J.</h3>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <blockquote className="text-neutral-600 italic flex-grow">
                "I never thought buying a car could be so easy! The selection was amazing, and the team helped me find the perfect SUV for my family. Couldn't be happier with my purchase."
              </blockquote>
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <p className="text-sm text-primary-dark font-medium">Purchased: Toyota RAV4</p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-orange-100 flex flex-col">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <img className="h-12 w-12 rounded-full" src="https://randomuser.me/api/portraits/men/45.jpg" alt="David M." />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-neutral-900">David M.</h3>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <blockquote className="text-neutral-600 italic flex-grow">
                "The financing options were exceptional, and I appreciated the transparency throughout the whole process. The delivery was prompt, and my new EV exceeded all expectations!"
              </blockquote>
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <p className="text-sm text-primary-dark font-medium">Purchased: Tesla Model 3</p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-orange-100 flex flex-col">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <img className="h-12 w-12 rounded-full" src="https://randomuser.me/api/portraits/women/68.jpg" alt="Emily R." />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-neutral-900">Emily R.</h3>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < 4 ? 'text-yellow-400' : 'text-yellow-200'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <blockquote className="text-neutral-600 italic flex-grow">
                "Customer service was top-notch! When I had questions about my new truck's features, they were quick to respond and incredibly helpful. I'll definitely be recommending to friends."
              </blockquote>
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <p className="text-sm text-primary-dark font-medium">Purchased: Ford F-150</p>
              </div>
            </div>
          </div>
          
          
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark"></div>
        <div className="absolute inset-0 opacity-20">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
        
      </section>
    </div>
  );
};

export default HomePage; 