import React from 'react';
import { FaStar } from 'react-icons/fa';

const ReviewsSection = ({ hotel }) => {
  // Mock reviews for now (you can add real reviews from backend later)
  const reviews = [
    {
      id: 1,
      name: 'John Smith',
      rating: 5,
      date: '2024-11-15',
      comment: 'Amazing hotel! The staff was incredibly friendly and the rooms were spotless.',
      avatar: null,
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      rating: 4,
      date: '2024-11-10',
      comment: 'Great location and beautiful views. Would definitely stay here again.',
      avatar: null,
    },
    {
      id: 3,
      name: 'Michael Brown',
      rating: 5,
      date: '2024-11-05',
      comment: 'Perfect stay! The breakfast was excellent and the spa was very relaxing.',
      avatar: null,
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Guest Reviews</h2>
      
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Overall Rating */}
        <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-1">
              {hotel.rating || 0}
            </div>
            <div className="flex items-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={i < Math.floor(hotel.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}
                  size={16}
                />
              ))}
            </div>
            <div className="text-sm text-gray-600">Based on 125 reviews</div>
          </div>

          {/* Rating Breakdown */}
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-12">{star} star</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400"
                    style={{ width: `${star === 5 ? 80 : star === 4 ? 15 : 5}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">{star === 5 ? 80 : star === 4 ? 15 : 5}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="mt-6 space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="pb-6 border-b border-gray-200 last:border-0 last:pb-0">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-lg font-semibold text-gray-600">
                    {review.name.charAt(0)}
                  </span>
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-gray-900">{review.name}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                          size={14}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-6 text-center">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
          >
            Load More Reviews
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;

