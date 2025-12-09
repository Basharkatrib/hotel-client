<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateReviewRequest;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReviewController extends Controller
{
    /**
     * Update a review.
     */
    public function update(UpdateReviewRequest $request, Review $review): JsonResponse
    {
        try {
            // Double check authorization
            if ($review->user_id !== Auth::id()) {
                return response()->json([
                    'message' => 'Unauthorized. You can only update your own reviews.',
                ], 403);
            }

            DB::beginTransaction();

            $updateData = [];
            if ($request->has('rating')) {
                $updateData['rating'] = $request->rating;
            }
            if ($request->has('title')) {
                $updateData['title'] = $request->title;
            }
            if ($request->has('comment')) {
                $updateData['comment'] = $request->comment;
            }

            $review->update($updateData);
            $review->load('user:id,name,email,avatar');

            // Update hotel/room rating
            $this->updateReviewableRating($review);

            DB::commit();

            return response()->json([
                'data' => $review,
                'message' => 'Review updated successfully',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating review', [
                'review_id' => $review->id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Failed to update review',
            ], 500);
        }
    }

    /**
     * Delete a review.
     */
    public function destroy(Review $review): JsonResponse
    {
        try {
            // Check authorization
            if ($review->user_id !== Auth::id()) {
                return response()->json([
                    'message' => 'Unauthorized. You can only delete your own reviews.',
                ], 403);
            }

            DB::beginTransaction();

            $reviewableType = $review->reviewable_type;
            $reviewableId = $review->reviewable_id;

            $review->delete();

            // Update hotel/room rating
            $this->updateReviewableRatingAfterDelete($reviewableType, $reviewableId);

            DB::commit();

            return response()->json([
                'message' => 'Review deleted successfully',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting review', [
                'review_id' => $review->id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Failed to delete review',
            ], 500);
        }
    }

    /**
     * Update the reviewable model's rating after review update.
     */
    private function updateReviewableRating(Review $review): void
    {
        $this->updateReviewableRatingAfterDelete($review->reviewable_type, $review->reviewable_id);
    }

    /**
     * Update the reviewable model's rating after review creation/update/delete.
     */
    private function updateReviewableRatingAfterDelete(string $reviewableType, int $reviewableId): void
    {
        $reviews = Review::where('reviewable_type', $reviewableType)
            ->where('reviewable_id', $reviewableId)
            ->get();

        $averageRating = $reviews->avg('rating');
        $reviewsCount = $reviews->count();

        if ($reviewableType === 'hotel') {
            $hotel = \App\Models\Hotel::find($reviewableId);
            if ($hotel) {
                $hotel->update([
                    'rating' => round($averageRating, 2),
                    'reviews_count' => $reviewsCount,
                ]);
            }
        } elseif ($reviewableType === 'room') {
            $room = \App\Models\Room::find($reviewableId);
            if ($room && \Illuminate\Support\Facades\Schema::hasColumn('rooms', 'rating')) {
                $room->update([
                    'rating' => round($averageRating, 2),
                    'reviews_count' => $reviewsCount,
                ]);
            }
        }
    }
}
