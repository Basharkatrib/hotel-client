import React from 'react';

const RoomDescription = ({ description }) => {
  if (!description) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

export default RoomDescription;



