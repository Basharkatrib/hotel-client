import React from 'react';
import { 
  FaWifi, 
  FaSwimmingPool, 
  FaUtensils, 
  FaSpa, 
  FaParking,
  FaCheckCircle 
} from 'react-icons/fa';
import { MdRestaurant, MdFitnessCenter, MdLocalBar } from 'react-icons/md';

const AmenitiesSection = ({ hotel }) => {
  const amenities = [];

  // Map hotel features to amenity objects
  if (hotel.has_breakfast_included) {
    amenities.push({ icon: FaUtensils, label: 'Breakfast', available: true });
  }
  
  if (hotel.has_spa_access) {
    amenities.push({ icon: FaSpa, label: 'Spa', available: true });
  }
  
  if (hotel.has_free_cancellation) {
    amenities.push({ icon: FaCheckCircle, label: 'Free Cancellation', available: true });
  }
  
  if (hotel.has_metro_access) {
    amenities.push({ icon: FaCheckCircle, label: 'Metro Access', available: true });
  }

  // Add amenities from array
  if (hotel.amenities && Array.isArray(hotel.amenities)) {
    hotel.amenities.forEach(amenity => {
      const iconMap = {
        'WiFi': FaWifi,
        'Pool': FaSwimmingPool,
        'Restaurant': MdRestaurant,
        'Gym': MdFitnessCenter,
        'Bar': MdLocalBar,
        'Parking': FaParking,
      };
      
      amenities.push({
        icon: iconMap[amenity] || FaCheckCircle,
        label: amenity,
        available: true,
      });
    });
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
      
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {amenities.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No amenities information available
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {amenities.map((amenity, index) => {
              const Icon = amenity.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <Icon className="text-blue-600" size={20} />
                  </div>
                  <span className="font-medium text-gray-900">{amenity.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Popular Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Popular</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { icon: FaWifi, label: 'Wi-Fi', available: hotel.amenities?.includes('WiFi') },
              { icon: FaUtensils, label: 'Breakfast', available: hotel.has_breakfast_included },
              { icon: FaSpa, label: 'Spa', available: hotel.has_spa_access },
              { icon: FaParking, label: 'Parking', available: hotel.amenities?.includes('Parking') },
            ].map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 p-2 rounded-lg ${
                  item.available ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                <item.icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmenitiesSection;

