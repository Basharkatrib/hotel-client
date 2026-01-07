import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { skipToken } from '@reduxjs/toolkit/query';
import {
  useGetRoomReviewsQuery,
  useGetRoomReviewStatsQuery,
  useCreateRoomReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useCheckRoomReviewQuery,
} from '../../../services/reviewsApi';
import RatingStars from '../../../components/reviews/RatingStars';
import ReviewCard from '../../../components/reviews/ReviewCard';
import ReviewForm from '../../../components/reviews/ReviewForm';
import DeleteReviewModal from '../../../components/reviews/DeleteReviewModal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const RoomReviews = ({ room }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null); // Review being edited
  const [deletingReview, setDeletingReview] = useState(null); // Review being deleted
  const [currentPage, setCurrentPage] = useState(1);
  const [filterRating, setFilterRating] = useState(null);
  const [sortBy, setSortBy] = useState('latest');

  const roomId = room?.id;

  // Fetch review stats
  const { data: statsData, isLoading: statsLoading } = useGetRoomReviewStatsQuery(
    roomId || skipToken
  );

  // Check if user has already reviewed
  const { data: checkReviewData } = useCheckRoomReviewQuery(
    roomId || skipToken,
    { skip: !isAuthenticated || !roomId }
  );

  // Fetch reviews
  const { data: reviewsData, isLoading: reviewsLoading } = useGetRoomReviewsQuery(
    roomId
      ? {
        roomId,
        params: {
          page: currentPage,
          per_page: 10,
          rating: filterRating || undefined,
          sort_by: sortBy === 'latest' || sortBy === 'oldest' ? 'created_at' : 'rating',
          sort_order: sortBy === 'latest' || sortBy === 'highest' ? 'desc' : 'asc',
        },
      }
      : skipToken
  );

  const [createReview, { isLoading: isSubmitting }] = useCreateRoomReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  const stats = statsData?.data || {};
  const reviews = reviewsData?.data?.reviews || [];
  const pagination = reviewsData?.data?.pagination || {};
  const hasReviewed = checkReviewData?.data?.has_reviewed || false;
  const canReview = isAuthenticated && !hasReviewed;

  const handleSubmitReview = async (reviewData) => {
    if (!isAuthenticated) {
      toast.info('Please login to submit a review');
      navigate('/auth/login');
      return;
    }

    if (!roomId) {
      toast.error('Room information is missing. Please refresh the page.');
      return;
    }

    try {
      if (editingReview) {
        // Update existing review
        await updateReview({
          reviewId: editingReview.id,
          reviewData,
        }).unwrap();
        toast.success('Review updated successfully!');
        setEditingReview(null);
      } else {
        // Create new review
        await createReview({
          roomId,
          reviewData,
        }).unwrap();
        toast.success('Review submitted successfully!');
      }
      setShowReviewForm(false);
    } catch (error) {
      const errorMessage = error.data?.messages?.[0] || error.data?.message || 'Failed to submit review';
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
    // Scroll to form
    setTimeout(() => {
      document.querySelector('form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDeleteReview = (review) => {
    setDeletingReview(review);
  };

  const handleConfirmDelete = async () => {
    if (!deletingReview) return;

    try {
      await deleteReview(deletingReview.id).unwrap();
      toast.success('Review deleted successfully!');
      setDeletingReview(null);
      // Reset to first page if current page becomes empty
      if (reviews.length === 1 && currentPage > 1) {
        setCurrentPage(1);
      }
    } catch (error) {
      const errorMessage = error.data?.messages?.[0] || error.data?.message || 'Failed to delete review';
      toast.error(errorMessage);
    }
  };

  const handleCancelDelete = () => {
    setDeletingReview(null);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setShowReviewForm(false);
  };

  const calculateRatingPercentage = (rating) => {
    const total = stats.total_reviews || 1;
    const count = stats.rating_distribution?.[rating] || 0;
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 transition-colors duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Room Reviews</h2>
          {canReview && !showReviewForm && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Write a Review
            </button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="mb-8">
            <ReviewForm
              onSubmit={handleSubmitReview}
              onCancel={handleCancelEdit}
              isSubmitting={isSubmitting || isUpdating}
              initialValues={editingReview ? {
                rating: editingReview.rating,
                title: editingReview.title || '',
                comment: editingReview.comment || '',
              } : {}}
              type="room"
            />
          </div>
        )}

        {/* Overall Rating & Stats */}
        {!statsLoading && (
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-6 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <div className="text-center md:text-left">
              <div className="text-5xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.average_rating ? stats.average_rating.toFixed(1) : '0.0'}
              </div>
              <RatingStars
                rating={stats.average_rating || 0}
                size={20}
                showNumber={false}
              />
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">
                Based on {stats.total_reviews || 0} {stats.total_reviews === 1 ? 'review' : 'reviews'}
              </div>
            </div>

            {/* Rating Breakdown */}
            <div className="flex-1 w-full space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const percentage = calculateRatingPercentage(star);
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-16">{star} star</span>
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                      {percentage}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filters and Sort */}
        <div className="mt-6 flex flex-wrap items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by rating:</span>
            <button
              onClick={() => setFilterRating(null)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${filterRating === null
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              All
            </button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${filterRating === rating
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
              >
                {rating} Star{rating > 1 ? 's' : ''}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 bg-white dark:bg-gray-800 text-sm border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        {reviewsLoading ? (
          <div className="mt-6 flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="mt-6 text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 font-medium">No reviews yet. Be the first to review this room!</p>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                canEdit={isAuthenticated && user?.id === review.user_id}
                canDelete={isAuthenticated && user?.id === review.user_id}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
              Page {pagination.current_page} of {pagination.last_page}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(pagination.last_page, prev + 1))}
              disabled={currentPage === pagination.last_page}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteReviewModal
        isOpen={!!deletingReview}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default RoomReviews;





