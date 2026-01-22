import React from 'react';

const RoomDescription = ({ description }) => {
  if (!description) return null;

  return (
    <div className="bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-gray-800 p-6 transition-colors duration-300">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Description</h2>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
};

export default RoomDescription;











