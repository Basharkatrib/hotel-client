import React from 'react';

const RoomsHeader = ({ totalRooms }) => {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">All Rooms</h1>
      <p className="text-gray-600 dark:text-gray-400 font-medium">
        Discover {totalRooms || 0} rooms across all hotels
      </p>
    </div>
  );
};

export default RoomsHeader;










