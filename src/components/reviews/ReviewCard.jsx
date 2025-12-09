import React, { useState, useRef, useEffect } from 'react';
import RatingStars from './RatingStars';
import { HiDotsVertical } from 'react-icons/hi';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ReviewCard = ({ review, onEdit, onDelete, canEdit = false, canDelete = false }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleEdit = () => {
    setShowMenu(false);
    if (onEdit) {
      onEdit(review);
    }
  };

  const handleDelete = () => {
    setShowMenu(false);
    if (onDelete) {
      onDelete(review);
    }
  };

  return (
    <div className="pb-4 sm:pb-6 border-b border-gray-200 last:border-0 last:pb-0">
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Avatar */}
        <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
          {review.user?.avatar ? (
            <img
              src={review.user.avatar}
              alt={review.user.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-sm sm:text-lg font-semibold text-white">
              {getInitials(review.user?.name || review.name)}
            </span>
          )}
        </div>

        {/* Review Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                  {review.user?.name || review.name || 'Anonymous'}
                </div>
                <RatingStars rating={review.rating} size={12} showNumber={false} />
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">
                {formatDate(review.created_at || review.date)}
              </div>
            </div>

            {/* Three Dots Menu */}
            {(canEdit || canDelete) && (
              <div className="relative shrink-0" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="More options"
                >
                  <HiDotsVertical className="w-5 h-5 text-gray-600" />
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <div className="absolute right-0 top-10 z-10 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 transform transition-all duration-200 ease-out">
                    {canEdit && (
                      <button
                        onClick={handleEdit}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                      >
                        <FaEdit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={handleDelete}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <FaTrash className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Review Comment */}
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
            {review.comment || review.content}
          </p>

          {/* Review Images */}
          {review.images && review.images.length > 0 && (
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {review.images.slice(0, 3).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Review image ${index + 1}`}
                  className="w-full h-20 sm:h-24 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
