import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const RoomDetailsHeader = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/rooms')}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
    >
      <FaArrowLeft />
      <span>Back to Rooms</span>
    </button>
  );
};

export default RoomDetailsHeader;



