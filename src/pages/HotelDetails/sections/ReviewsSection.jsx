import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { skipToken } from '@reduxjs/toolkit/query';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetHotelReviewsQuery,
  useGetHotelReviewStatsQuery,
  useCreateHotelReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useCheckHotelReviewQuery,
} from '../../../services/reviewsApi';
import RatingStars from '../../../components/reviews/RatingStars';
import ReviewCard from '../../../components/reviews/ReviewCard';
import ReviewForm from '../../../components/reviews/ReviewForm';
import DeleteReviewModal from '../../../components/reviews/DeleteReviewModal';
import { toast } from 'react-toastify';

const ReviewsSection = ({ hotel }) => {
  const { slug } = useParams(); // Get slug from URL params
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null); // Review being edited
  const [deletingReview, setDeletingReview] = useState(null); // Review being deleted
  const [currentPage, setCurrentPage] = useState(1);
  const [filterRating, setFilterRating] = useState(null);
  const [sortBy, setSortBy] = useState('latest'); // 'latest', 'oldest', 'highest', 'lowest'

  // Use slug from URL params, fallback to hotel?.slug if needed
  const hotelSlug = slug || hotel?.slug;

  // Fetch review stats
  const { data: statsData, isLoading: statsLoading } = useGetHotelReviewStatsQuery(
    hotelSlug || skipToken
  );

  // Check if user has already reviewed
  const { data: checkReviewData } = useCheckHotelReviewQuery(
    hotelSlug || skipToken,
    { skip: !isAuthenticated || !hotelSlug }
  );

  // Fetch reviews
  const { data: reviewsData, isLoading: reviewsLoading } = useGetHotelReviewsQuery(
    hotelSlug
      ? {
        hotelSlug,
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

  const [createReview, { isLoading: isSubmitting }] = useCreateHotelReviewMutation();
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

    if (!hotelSlug) {
      toast.error('Hotel information is missing. Please refresh the page.');
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
          hotelSlug,
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
    <div className="space-y-8">

  {/* Header */}
  <div className="flex items-center justify-between">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
      Guest Reviews
    </h2>

    {canReview && !showReviewForm && (
      <button
        onClick={() => setShowReviewForm(true)}
        className="cursor-pointer px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
      >
        Write a Review
      </button>
    )}
  </div>


  {/* Rating Summary */}
  {!statsLoading && (
    <div className="grid md:grid-cols-3 gap-6">

      {/* Average Rating */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm text-center">

        <div className="text-4xl font-bold text-gray-900 dark:text-white">
          {stats.average_rating?.toFixed(1) || "0.0"}
        </div>

        <div className="mt-2 flex justify-center">
          <RatingStars
            rating={stats.average_rating || 0}
            size={22}
            showNumber={false}
          />
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {stats.total_reviews || 0} reviews
        </p>
      </div>


      {/* Rating Breakdown */}
      <div className="md:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm space-y-3">

        {[5,4,3,2,1].map((star) => {
          const percentage = calculateRatingPercentage(star)

          return (
            <div key={star} className="flex items-center gap-3">

              <span className="w-12 text-sm text-gray-600 dark:text-gray-400">
                {star}★
              </span>

              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">

                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${percentage}%` }}
                />

              </div>

              <span className="text-sm text-gray-500 dark:text-gray-400 w-10 text-right">
                {percentage}%
              </span>

            </div>
          )
        })}

      </div>
    </div>
  )}


  {/* Review Form */}
  {showReviewForm && (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
      <ReviewForm
        onSubmit={handleSubmitReview}
        onCancel={handleCancelEdit}
        isSubmitting={isSubmitting || isUpdating}
        initialValues={editingReview ? {
          rating: editingReview.rating,
          title: editingReview.title || '',
          comment: editingReview.comment || '',
        } : {}}
        type="hotel"
      />
    </div>
  )}


  {/* Reviews */}
  {reviewsLoading ? (

    <div className="flex justify-center py-16">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

  ) : reviews.length === 0 ? (

    <div className="text-center py-16 text-gray-500 dark:text-gray-400">
      No reviews yet. Be the first to review!
    </div>

  ) : (

    <div className="grid gap-6">
      {reviews.map((review) => (

        <div
          key={review.id}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm"
        >

          <ReviewCard
            review={review}
            canEdit={isAuthenticated && user?.id === review.user_id}
            canDelete={isAuthenticated && user?.id === review.user_id}
            onEdit={handleEditReview}
            onDelete={handleDeleteReview}
          />

        </div>

      ))}
    </div>

  )}


  {/* Pagination */}
  {pagination.last_page > 1 && (

    <div className="flex justify-center items-center gap-4">

      <button
        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        disabled={currentPage === 1}
        className="cursor-pointer px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
      >
        Previous
      </button>

      <span className="text-sm text-gray-600 dark:text-gray-400">
        Page {pagination.current_page} of {pagination.last_page}
      </span>

      <button
        onClick={() => setCurrentPage((prev) => Math.min(pagination.last_page, prev + 1))}
        disabled={currentPage === pagination.last_page}
        className="cursor-pointer px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
      >
        Next
      </button>

    </div>

  )}

  {/* Delete Modal */}
  <DeleteReviewModal
    isOpen={!!deletingReview}
    onClose={handleCancelDelete}
    onConfirm={handleConfirmDelete}
    isDeleting={isDeleting}
  />

</div>
  );
};

export default ReviewsSection;
