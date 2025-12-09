import React from 'react';
import {
  FaWifi,
  FaSnowflake,
  FaTv,
  FaUtensils,
  FaBath,
  FaShower,
  FaSmokingBan,
} from 'react-icons/fa';
import { MdBalcony } from 'react-icons/md';

const RoomAmenities = ({ room }) => {
  const amenities = [];

  if (room.has_breakfast) {
    amenities.push({ icon: FaUtensils, label: 'Breakfast', color: 'text-orange-600' });
  }
  if (room.has_wifi) {
    amenities.push({ icon: FaWifi, label: 'WiFi', color: 'text-blue-600' });
  }
  if (room.has_ac) {
    amenities.push({ icon: FaSnowflake, label: 'AC', color: 'text-cyan-600' });
  }
  if (room.has_tv) {
    amenities.push({ icon: FaTv, label: 'TV', color: 'text-purple-600' });
  }
  if (room.has_bathtub) {
    amenities.push({ icon: FaBath, label: 'Bathtub', color: 'text-blue-500' });
  }
  if (room.has_shower) {
    amenities.push({ icon: FaShower, label: 'Shower', color: 'text-blue-400' });
  }
  if (room.has_balcony) {
    amenities.push({ icon: MdBalcony, label: 'Balcony', color: 'text-green-600' });
  }
  if (room.no_smoking) {
    amenities.push({ icon: FaSmokingBan, label: 'No Smoking', color: 'text-red-600' });
  }

  if (amenities.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {amenities.map((amenity, index) => {
          const Icon = amenity.icon;
          return (
            <div key={index} className="flex items-center gap-2 text-gray-700">
              <Icon className={amenity.color} size={18} />
              <span>{amenity.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoomAmenities;



