import { useState } from 'react';
import { Link } from 'react-router-dom';

interface VehicleCardProps {
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
  onAddToCart: (vehicleId: number, quantity: number) => void;
}

const VehicleCard = ({ 
  id, 
  name, 
  brand, 
  model, 
  price, 
  type, 
  fuelType, 
  imageUrl, 
  quantityAvailable,
  onAddToCart
}: VehicleCardProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value));
  };

  const handleAddToCart = () => {
    onAddToCart(id, quantity);
    setQuantity(1); // Reset quantity after adding to cart
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-neutral-200 group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl || "https://placehold.co/600x400?text=Vehicle"} 
          alt={`${brand} ${model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-0 right-0 m-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-primary-dark">
            {fuelType}
          </span>
        </div>
        {quantityAvailable <= 3 && quantityAvailable > 0 && (
          <div className="absolute top-0 left-0 m-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
              Only {quantityAvailable} left
            </span>
          </div>
        )}
        {quantityAvailable === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              {brand} {model}
            </h3>
            <p className="text-sm text-neutral-500">{name}</p>
          </div>
          <span className="text-lg font-bold text-primary">
            ${price.toLocaleString()}
          </span>
        </div>
        
        <div className="mt-3 flex items-center text-sm text-neutral-500">
          <span className="inline-block px-2 py-1 bg-orange-50 rounded-md mr-2 text-primary-dark">
            {type}
          </span>
        </div>
        
        <div className="mt-4">
          {quantityAvailable > 0 ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center">
                <label htmlFor={`quantity-${id}`} className="sr-only">Quantity</label>
                <select
                  id={`quantity-${id}`}
                  className="block w-full rounded-md border-neutral-300 py-1.5 text-sm text-neutral-900 focus:border-primary focus:ring-primary"
                  value={quantity}
                  onChange={handleQuantityChange}
                >
                  {[...Array(Math.min(quantityAvailable, 10)).keys()].map(num => (
                    <option key={num + 1} value={num + 1}>
                      {num + 1}
                    </option>
                  ))}
                </select>
              </div>
              <button 
                onClick={handleAddToCart}
                className="flex-1 inline-flex justify-center items-center rounded-md py-2 px-3 text-sm font-medium bg-primary text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                Add to Cart
              </button>
            </div>
          ) : (
            <button 
              disabled
              className="w-full inline-flex justify-center items-center rounded-md py-2 px-3 text-sm font-medium bg-neutral-300 text-neutral-500 cursor-not-allowed"
            >
              Out of Stock
            </button>
          )}
          <Link 
            to={`/vehicles/${id}`}
            className="mt-2 block w-full text-center text-primary hover:text-primary-dark font-medium text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard; 