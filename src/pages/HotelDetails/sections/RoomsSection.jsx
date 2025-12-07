import React, { useState } from 'react';
import RoomCard from '../components/RoomCard';

const RoomsSection = ({ hotelId, rooms, loading, hotel, checkIn, checkOut, guests }) => {
  const [selectedBedFilter, setSelectedBedFilter] = useState('all');

  // Filter rooms by bed type
  const filteredRooms = rooms.filter(room => {
    if (selectedBedFilter === 'all') return true;
    if (selectedBedFilter === '1') return room.single_beds > 0;
    if (selectedBedFilter === '2') return room.double_beds > 0 || room.single_beds >= 2;
    if (selectedBedFilter === '3') return (room.single_beds + room.double_beds + room.king_beds + room.queen_beds) >= 3;
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="flex gap-4">
              <div className="w-48 h-32 bg-gray-200 rounded-lg" />
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Available Rooms</h2>
        
        {/* Bed Filters */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 hidden sm:inline">Filter by beds:</span>
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All Rooms' },
              { value: '1', label: '1 Bed' },
              { value: '2', label: '2 Beds' },
              { value: '3', label: '3+ Beds' },
            ].map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setSelectedBedFilter(filter.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedBedFilter === filter.value
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rooms List */}
      {filteredRooms.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-gray-400 text-4xl mb-4">🛏️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No rooms found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRooms.map((room) => (
            <RoomCard 
              key={room.id} 
              room={room} 
              hotel={hotel}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomsSection;


