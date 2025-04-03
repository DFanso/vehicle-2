import { useState } from 'react';

interface VehicleFilterProps {
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  brand: string;
  type: string;
  fuelType: string;
  minPrice: string;
  maxPrice: string;
}

const VehicleFilter = ({ onFilterChange }: VehicleFilterProps) => {
  const [filters, setFilters] = useState<FilterState>({
    brand: '',
    type: '',
    fuelType: '',
    minPrice: '',
    maxPrice: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      brand: '',
      type: '',
      fuelType: '',
      minPrice: '',
      maxPrice: ''
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">Filter Vehicles</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-neutral-700 mb-1">
            Brand
          </label>
          <select
            id="brand"
            name="brand"
            value={filters.brand}
            onChange={handleInputChange}
            className="w-full rounded-md border-neutral-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Brands</option>
            <option value="Toyota">Toyota</option>
            <option value="Honda">Honda</option>
            <option value="Ford">Ford</option>
            <option value="Tesla">Tesla</option>
            <option value="BMW">BMW</option>
            <option value="Audi">Audi</option>
            <option value="Mercedes">Mercedes</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-neutral-700 mb-1">
            Vehicle Type
          </label>
          <select
            id="type"
            name="type"
            value={filters.type}
            onChange={handleInputChange}
            className="w-full rounded-md border-neutral-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="SEDAN">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="TRUCK">Truck</option>
            <option value="HATCHBACK">Hatchback</option>
            <option value="COUPE">Coupe</option>
            <option value="CONVERTIBLE">Convertible</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="fuelType" className="block text-sm font-medium text-neutral-700 mb-1">
            Fuel Type
          </label>
          <select
            id="fuelType"
            name="fuelType"
            value={filters.fuelType}
            onChange={handleInputChange}
            className="w-full rounded-md border-neutral-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Fuel Types</option>
            <option value="PETROL">Petrol</option>
            <option value="DIESEL">Diesel</option>
            <option value="ELECTRIC">Electric</option>
            <option value="HYBRID">Hybrid</option>
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="minPrice" className="block text-sm font-medium text-neutral-700 mb-1">
              Min Price
            </label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleInputChange}
              placeholder="Min"
              className="w-full rounded-md border-neutral-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium text-neutral-700 mb-1">
              Max Price
            </label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleInputChange}
              placeholder="Max"
              className="w-full rounded-md border-neutral-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <button
          onClick={clearFilters}
          className="w-full mt-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default VehicleFilter; 