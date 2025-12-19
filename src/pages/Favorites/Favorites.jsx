import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetFavoritesQuery, useRemoveFavoriteByIdMutation } from '../../services/favoritesApi';
import { FaHeart, FaHotel, FaBed, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getImageUrls } from '../../utils/imageHelper';

const Favorites = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'hotels', 'rooms'
  
  const { data: favoritesData, isLoading, refetch } = useGetFavoritesQuery({});
  const [removeFavorite] = useRemoveFavoriteByIdMutation();
  
  const hotels = favoritesData?.data?.hotels || [];
  const rooms = favoritesData?.data?.rooms || [];

  const handleRemoveFavorite = async (favoriteId, itemName) => {
    if (!favoriteId) {
      toast.error('Favorite ID not found');
      return;
    }
    
    try {
      await removeFavorite(favoriteId).unwrap();
      toast.success(`${itemName} removed from favorites`);
      refetch();
    } catch (error) {
      toast.error(error.data?.messages?.[0] || 'Failed to remove from favorites');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <FaHeart className="mx-auto text-gray-400 mb-4" size={48} />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h2>
        <p className="text-gray-600 mb-6">You need to be logged in to view your favorites.</p>
        <button
          onClick={() => navigate('/auth/login')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Login
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const filteredHotels = activeTab === 'all' || activeTab === 'hotels' ? hotels : [];
  const filteredRooms = activeTab === 'all' || activeTab === 'rooms' ? rooms : [];
  const hasItems = filteredHotels.length > 0 || filteredRooms.length > 0;

  return (
    <div className="bg-white border border-gray-200 p-4 sm:p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">My Favorites</h1>
          <p className="text-gray-600">
            {hotels.length + rooms.length} {hotels.length + rooms.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'all'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All ({hotels.length + rooms.length})
          </button>
          <button
            onClick={() => setActiveTab('hotels')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'hotels'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Hotels ({hotels.length})
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'rooms'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Rooms ({rooms.length})
          </button>
        </div>

        {/* Content */}
        {!hasItems ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <FaHeart className="mx-auto text-gray-300 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Favorites Yet</h2>
            <p className="text-gray-600 mb-6">
              Start exploring and add hotels or rooms to your favorites!
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/explore')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Explore Hotels
              </button>
              <button
                onClick={() => navigate('/rooms')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Browse Rooms
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Hotels Section */}
            {filteredHotels.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaHotel className="text-blue-600" />
                  Hotels ({filteredHotels.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredHotels.map((hotel) => {
                    const images = getImageUrls(hotel.images);
                    const mainImage = images[0] || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80';
                    
                    return (
                      <div
                        key={hotel.id}
                        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                      >
                        <div className="relative h-48">
                          <img
                            src={mainImage}
                            alt={hotel.name}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => navigate(`/hotel/${hotel.slug}`)}
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80';
                            }}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFavorite(hotel.favorite_id, hotel.name);
                            }}
                            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                            aria-label="Remove from favorites"
                          >
                            <FaHeart className="text-red-500" size={20} />
                          </button>
                        </div>
                        <div className="p-5">
                          <h3
                            onClick={() => navigate(`/hotel/${hotel.slug}`)}
                            className="text-xl font-bold text-gray-900 mb-2 cursor-pointer hover:text-blue-600 transition-colors"
                          >
                            {hotel.name}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center gap-1 mb-3">
                            <FaMapMarkerAlt className="text-gray-400" size={12} />
                            {hotel.city}, {hotel.country}
                          </p>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-2xl font-bold text-gray-900">
                                ${Number(hotel.price_per_night).toFixed(0)}
                              </span>
                              <span className="text-sm text-gray-500">/ night</span>
                            </div>
                            <button
                              onClick={() => navigate(`/hotel/${hotel.slug}`)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Rooms Section */}
            {filteredRooms.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaBed className="text-blue-600" />
                  Rooms ({filteredRooms.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRooms.map((room) => {
                    const images = getImageUrls(room.images);
                    const mainImage = images[0] || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80';
                    
                    return (
                      <div
                        key={room.id}
                        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                      >
                        <div className="relative h-48">
                          <img
                            src={mainImage}
                            alt={room.name}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => navigate(`/room/${room.id}`)}
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80';
                            }}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFavorite(room.favorite_id, room.name);
                            }}
                            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                            aria-label="Remove from favorites"
                          >
                            <FaHeart className="text-red-500" size={20} />
                          </button>
                        </div>
                        <div className="p-5">
                          {room.hotel && (
                            <p className="text-sm text-blue-600 font-semibold mb-1">
                              {room.hotel.name}
                            </p>
                          )}
                          <h3
                            onClick={() => navigate(`/room/${room.id}`)}
                            className="text-xl font-bold text-gray-900 mb-2 cursor-pointer hover:text-blue-600 transition-colors"
                          >
                            {room.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium capitalize">
                              {room.type}
                            </span>
                            <span className="text-sm text-gray-600">
                              Up to {room.max_guests} guests
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-2xl font-bold text-gray-900">
                                ${Number(room.price_per_night).toFixed(0)}
                              </span>
                              <span className="text-sm text-gray-500">/ night</span>
                            </div>
                            <button
                              onClick={() => navigate(`/room/${room.id}`)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
  );
};

export default Favorites;

