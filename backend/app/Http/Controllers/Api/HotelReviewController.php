<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReviewRequest;
use App\Models\Hotel;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class HotelReviewController extends Controller
{
    /**
     * Get all reviews for a hotel.
     */
    public function index(Request $request, Hotel $hotel): JsonResponse
    {
        try {
            $query = Review::where('reviewable_type', 'hotel')
                ->where('reviewable_id', $hotel->id)
                ->with('user:id,name,email,avatar');

            // Filter by rating
            if ($request->has('rating') && $request->rating) {
                $query->where('rating', $request->rating);
            }

            // Sort
            $sortBy = $request->get('sort_by', 'created_at');
            $allowedSortFields = ['created_at', 'rating'];
            if (!in_array($sortBy, $allowedSortFields)) {
                $sortBy = 'created_at';
            }

            $sortOrder = $request->get('sort_order', 'desc');
            if (!in_array(strtolower($sortOrder), ['asc', 'desc'])) {
                $sortOrder = 'desc';
            }

            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 10);
            $perPage = min(max(1, $perPage), 50); // Limit between 1 and 50

            $reviews = $query->paginate($perPage);

            return response()->json([
                'data' => [
                    'reviews' => $reviews->items(),
                    'pagination' => [
                        'current_page' => $reviews->currentPage(),
                        'last_page' => $reviews->lastPage(),
                        'per_page' => $reviews->perPage(),
                        'total' => $reviews->total(),
                    ],
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching hotel reviews', [
                'hotel_id' => $hotel->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Failed to fetch reviews',
            ], 500);
        }
    }

    /**
     * Create a new review for a hotel.
     */
    public function store(StoreReviewRequest $request, Hotel $hotel): JsonResponse
    {
        try {
            // Check if user already reviewed this hotel
            $existingReview = Review::where('user_id', Auth::id())
                ->where('reviewable_type', 'hotel')
                ->where('reviewable_id', $hotel->id)
                ->first();

            if ($existingReview) {
                return response()->json([
                    'message' => 'You have already reviewed this hotel.',
                    'messages' => ['You can only review a hotel once.'],
                ], 422);
            }

            DB::beginTransaction();

            $review = Review::create([
                'user_id' => Auth::id(),
                'reviewable_type' => 'hotel',
                'reviewable_id' => $hotel->id,
                'rating' => $request->rating,
                'title' => $request->title,
                'comment' => $request->comment,
            ]);

            $review->load('user:id,name,email,avatar');

            // Update hotel's average rating
            $this->updateHotelRating($hotel);

            DB::commit();

            return response()->json([
                'data' => $review,
                'message' => 'Review created successfully',
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating hotel review', [
                'hotel_id' => $hotel->id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Failed to create review',
                'messages' => ['An error occurred while creating the review.'],
            ], 500);
        }
    }

    /**
     * Get review statistics for a hotel.
     */
    public function stats(Hotel $hotel): JsonResponse
    {
        try {
            $reviews = Review::where('reviewable_type', 'hotel')
                ->where('reviewable_id', $hotel->id)
                ->get();

            $stats = [
                'average_rating' => round($reviews->avg('rating') ?? 0, 2),
                'total_reviews' => $reviews->count(),
                'rating_distribution' => [
                    5 => $reviews->where('rating', 5)->count(),
                    4 => $reviews->where('rating', 4)->count(),
                    3 => $reviews->where('rating', 3)->count(),
                    2 => $reviews->where('rating', 2)->count(),
                    1 => $reviews->where('rating', 1)->count(),
                ],
            ];

            return response()->json(['data' => $stats]);
        } catch (\Exception $e) {
            Log::error('Error fetching hotel review stats', [
                'hotel_id' => $hotel->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Failed to fetch review statistics',
            ], 500);
        }
    }

    /**
     * Check if the authenticated user has reviewed the hotel.
     */
    public function check(Hotel $hotel): JsonResponse
    {
        try {
            $review = Review::where('user_id', Auth::id())
                ->where('reviewable_type', 'hotel')
                ->where('reviewable_id', $hotel->id)
                ->first();

            return response()->json([
                'data' => [
                    'has_reviewed' => $review !== null,
                    'review_id' => $review?->id,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error checking hotel review', [
                'hotel_id' => $hotel->id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Failed to check review status',
            ], 500);
        }
    }

    /**
     * Update hotel's average rating in the hotels table.
     */
    private function updateHotelRating(Hotel $hotel): void
    {
        $reviews = Review::where('reviewable_type', 'hotel')
            ->where('reviewable_id', $hotel->id)
            ->get();

        $averageRating = $reviews->avg('rating');
        $reviewsCount = $reviews->count();

        $hotel->update([
            'rating' => round($averageRating, 2),
            'reviews_count' => $reviewsCount,
        ]);
    }
}
