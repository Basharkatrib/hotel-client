import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaMapMarkerAlt, FaBed, FaUsers, FaWifi, FaSnowflake, FaTv, FaUtensils, FaBath, FaShower, FaSmokingBan, FaHeart, FaRegHeart } from 'react-icons/fa';
import { MdBalcony } from 'react-icons/md';
import { getImageUrls } from '../../../utils/imageHelper';
import { useCheckFavoriteQuery, useAddToFavoritesMutation, useRemoveFromFavoritesMutation } from '../../../services/favoritesApi';
import { toast } from 'react-toastify';

const RoomCard = ({ room }) => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [isFavorited, setIsFavorited] = useState(false);
  
  const images = getImageUrls(room.images);
  const mainImage = images[0] || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80';
  
  const hasDiscount = room.original_price && room.original_price > room.price_per_night;
  
  // Check if room is favorited
  const { data: favoriteData } = useCheckFavoriteQuery(
    { favoritable_type: 'room', favoritable_id: room.id },
    { skip: !token }
  );
  
  const [addToFavorites] = useAddToFavoritesMutation();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();
  
  useEffect(() => {
    if (favoriteData?.data?.is_favorited) {
      setIsFavorited(true);
    } else {
      setIsFavorited(false);
    }
  }, [favoriteData]);
  
  // Build bed description
  const beds = [];
  if (room.single_beds > 0) beds.push(`${room.single_beds} Single`);
  if (room.double_beds > 0) beds.push(`${room.double_beds} Double`);
  if (room.king_beds > 0) beds.push(`${room.king_beds} King`);
  if (room.queen_beds > 0) beds.push(`${room.queen_beds} Queen`);

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/room/${room.id}`);
  };
  
  const handleFavoriteToggle = async (e) => {
    e.stopPropagation();
    
    if (!token) {
      toast.info('Please login to add to favorites');
      navigate('/auth/login');
      return;
    }
    
    try {
      if (isFavorited) {
        await removeFromFavorites({
          favoritable_type: 'room',
          favoritable_id: room.id,
        }).unwrap();
        setIsFavorited(false);
        toast.success('Removed from favorites');
      } else {
        await addToFavorites({
          favoritable_type: 'room',
          favoritable_id: room.id,
        }).unwrap();
        setIsFavorited(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error(error.data?.messages?.[0] || 'Failed to update favorites');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Image */}
      <div className="relative h-48 w-full">
        <img
          src={mainImage}
          alt={room.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80';
          }}
        />
        
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-emerald-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg">
            {room.discount_percentage}% OFF
          </div>
        )}
        
        {/* Availability Badge */}
        {!room.is_available && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            Not Available
          </div>
        )}
        
        {/* Favorite Button */}
        <button
          type="button"
          onClick={handleFavoriteToggle}
          className={`absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform ${
            isFavorited ? 'text-red-500' : 'text-gray-700'
          }`}
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorited ? (
            <FaHeart size={18} />
          ) : (
            <FaRegHeart size={18} />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Hotel Info */}
        {room.hotel && (
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-blue-600 mb-1">{room.hotel.name}</h3>
            <p className="text-xs text-gray-600 flex items-center gap-1">
              <FaMapMarkerAlt className="text-gray-400" size={10} />
              {room.hotel.city || room.hotel.address}
            </p>
          </div>
        )}

        {/* Room Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">{room.name}</h2>

        {/* Room Type & Size */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium capitalize">
            {room.type}
          </span>
          {room.size && (
            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
              {room.size} m²
            </span>
          )}
          {room.view && room.view !== 'none' && (
            <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">
              {room.view} View
            </span>
          )}
        </div>

        {/* Beds & Guests */}
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
          {beds.length > 0 && (
            <div className="flex items-center gap-1.5">
              <FaBed className="text-gray-400" size={14} />
              <span>{beds.join(', ')}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <FaUsers className="text-gray-400" size={14} />
            <span>Up to {room.max_guests} guests</span>
          </div>
        </div>

        {/* Description */}
        {room.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {room.description}
          </p>
        )}

        {/* Amenities */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {room.has_breakfast && (
            <div className="flex items-center gap-1 text-xs text-orange-600">
              <FaUtensils size={12} />
              <span>Breakfast</span>
            </div>
          )}
          {room.has_wifi && (
            <div className="flex items-center gap-1 text-xs text-blue-600">
              <FaWifi size={12} />
              <span>WiFi</span>
            </div>
          )}
          {room.has_ac && (
            <div className="flex items-center gap-1 text-xs text-cyan-600">
              <FaSnowflake size={12} />
              <span>AC</span>
            </div>
          )}
          {room.has_tv && (
            <div className="flex items-center gap-1 text-xs text-purple-600">
              <FaTv size={12} />
              <span>TV</span>
            </div>
          )}
          {room.has_bathtub && (
            <div className="flex items-center gap-1 text-xs text-blue-500">
              <FaBath size={12} />
              <span>Bathtub</span>
            </div>
          )}
          {room.has_shower && (
            <div className="flex items-center gap-1 text-xs text-blue-400">
              <FaShower size={12} />
              <span>Shower</span>
            </div>
          )}
          {room.has_balcony && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <MdBalcony size={12} />
              <span>Balcony</span>
            </div>
          )}
          {room.no_smoking && (
            <div className="flex items-center gap-1 text-xs text-red-600">
              <FaSmokingBan size={12} />
              <span>No Smoking</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div>
            {hasDiscount && (
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-gray-400 line-through">
                  ${Number(room.original_price).toFixed(0)}
                </span>
                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-bold">
                  Save {room.discount_percentage}%
                </span>
              </div>
            )}
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-gray-900">
                ${Number(room.price_per_night).toFixed(0)}
              </span>
              <span className="text-sm text-gray-500 font-medium">/ night</span>
            </div>
          </div>
          <button
            onClick={handleViewDetails}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;

