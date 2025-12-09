import React from 'react';
import RatingStars from './RatingStars';

const ReviewCard = ({ review, onEdit, onDelete, canEdit = false, canDelete = false }) => {
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

  return (
    <div className="pb-6 border-b border-gray-200 last:border-0 last:pb-0">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
          {review.user?.avatar ? (
            <img
              src={review.user.avatar}
              alt={review.user.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-lg font-semibold text-white">
              {getInitials(review.user?.name || review.name)}
            </span>
          )}
        </div>

        {/* Review Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-semibold text-gray-900">
                {review.user?.name || review.name || 'Anonymous'}
              </div>
              <div className="text-sm text-gray-500">
                {formatDate(review.created_at || review.date)}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RatingStars rating={review.rating} size={14} />
              {(canEdit || canDelete) && (
                <div className="flex items-center gap-2">
                  {canEdit && (
                    <button
                      onClick={() => onEdit && onEdit(review)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Edit
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => onDelete && onDelete(review)}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {review.comment || review.content}
          </p>
          {review.images && review.images.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {review.images.slice(0, 3).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Review image ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
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
