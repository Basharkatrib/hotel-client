import React from 'react';

const RoomsHeader = ({ totalRooms }) => {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">All Rooms</h1>
      <p className="text-gray-600">
        Discover {totalRooms || 0} rooms across all hotels
      </p>
    </div>
  );
};

export default RoomsHeader;



