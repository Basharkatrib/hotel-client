import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import RatingStars from './RatingStars';
import { toast } from 'react-toastify';

const ReviewForm = ({ 
  onSubmit, 
  initialValues = {}, 
  onCancel,
  isSubmitting = false,
  type = 'hotel' // 'hotel' or 'room'
}) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  const validationSchema = Yup.object({
    rating: Yup.number()
      .min(1, 'Rating is required')
      .max(5, 'Rating must be between 1 and 5')
      .required('Please select a rating'),
    comment: Yup.string()
      .min(10, 'Review must be at least 10 characters')
      .max(1000, 'Review must not exceed 1000 characters')
      .required('Review comment is required'),
  });

  const formik = useFormik({
    initialValues: {
      rating: initialValues.rating || 0,
      comment: initialValues.comment || '',
      ...initialValues,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await onSubmit(values);
        formik.resetForm();
        setHoveredRating(0);
        if (onCancel) {
          onCancel();
        }
      } catch (error) {
        // Error handling is done in parent component
      }
    },
  });

  const isEditing = initialValues?.rating && initialValues.rating > 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        {isEditing ? 'Edit Your Review' : 'Write a Review'}
      </h3>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Rating Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating <span className="text-red-500">*</span>
          </label>
          <div 
            className="flex items-center gap-2"
            onMouseLeave={() => setHoveredRating(0)}
          >
            <RatingStars
              rating={hoveredRating || formik.values.rating}
              size={28}
              interactive={true}
              onRatingChange={(rating) => {
                formik.setFieldValue('rating', rating);
              }}
            />
            {formik.values.rating > 0 && (
              <span className="text-sm text-gray-600 ml-2">
                {formik.values.rating === 5 && 'Excellent'}
                {formik.values.rating === 4 && 'Very Good'}
                {formik.values.rating === 3 && 'Good'}
                {formik.values.rating === 2 && 'Fair'}
                {formik.values.rating === 1 && 'Poor'}
              </span>
            )}
          </div>
          {formik.touched.rating && formik.errors.rating && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.rating}</p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review <span className="text-red-500">*</span>
          </label>
          <textarea
            id="comment"
            name="comment"
            rows={6}
            placeholder={`Share your experience with this ${type}...`}
            value={formik.values.comment}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="flex justify-between items-center mt-1">
            {formik.touched.comment && formik.errors.comment ? (
              <p className="text-sm text-red-600">{formik.errors.comment}</p>
            ) : (
              <div />
            )}
            <p className="text-sm text-gray-500">
              {formik.values.comment.length}/1000 characters
            </p>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !formik.isValid}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (isEditing ? 'Updating...' : 'Submitting...') : (isEditing ? 'Update Review' : 'Submit Review')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
