# Reviews & Ratings API Documentation

هذا الملف يحتوي على توثيق كامل لـ API endpoints المطلوبة لتطبيق نظام التقييمات والمراجعات للفنادق والغرف.

## Base URL
```
http://127.0.0.1:8000/api
```

## Authentication
جميع الـ endpoints تحتاج إلى Bearer Token في الـ header (ماعدا GET endpoints):
```
Authorization: Bearer {token}
```

---

## 1. Hotel Reviews Endpoints

### 1.1 Get Hotel Reviews
**GET** `/hotels/{hotelId}/reviews`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `per_page` (optional): Items per page (default: 10)
- `rating` (optional): Filter by rating (1-5)
- `sort_by` (optional): Sort field (`created_at` or `rating`)
- `sort_order` (optional): Sort order (`asc` or `desc`)

**Response:**
```json
{
  "data": {
    "reviews": [
      {
        "id": 1,
        "user_id": 5,
        "user": {
          "id": 5,
          "name": "John Doe",
          "email": "john@example.com",
          "avatar": "https://example.com/avatar.jpg"
        },
        "rating": 5,
        "title": "Amazing experience!",
        "comment": "The hotel was fantastic...",
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "last_page": 5,
      "per_page": 10,
      "total": 47
    }
  }
}
```

---

### 1.2 Get Hotel Review Statistics
**GET** `/hotels/{hotelId}/reviews/stats`

**Response:**
```json
{
  "data": {
    "average_rating": 4.5,
    "total_reviews": 47,
    "rating_distribution": {
      "5": 25,
      "4": 15,
      "3": 5,
      "2": 1,
      "1": 1
    }
  }
}
```

---

### 1.3 Create Hotel Review
**POST** `/hotels/{hotelId}/reviews`

**Authentication:** Required

**Request Body:**
```json
{
  "rating": 5,
  "title": "Amazing experience!", // optional
  "comment": "The hotel was fantastic, clean rooms and excellent service."
}
```

**Validation:**
- `rating`: Required, integer, between 1 and 5
- `title`: Optional, string, max 100 characters
- `comment`: Required, string, min 10 characters, max 1000 characters

**Response:**
```json
{
  "data": {
    "id": 48,
    "user_id": 5,
    "user": {
      "id": 5,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "rating": 5,
    "title": "Amazing experience!",
    "comment": "The hotel was fantastic...",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "message": "Review created successfully"
}
```

**Error Response:**
```json
{
  "message": "Validation failed",
  "errors": {
    "rating": ["The rating field is required."],
    "comment": ["The comment must be at least 10 characters."]
  }
}
```

---

### 1.4 Check if User Has Reviewed Hotel
**GET** `/hotels/{hotelId}/reviews/check`

**Authentication:** Required

**Response:**
```json
{
  "data": {
    "has_reviewed": true,
    "review_id": 15
  }
}
```

---

## 2. Room Reviews Endpoints

### 2.1 Get Room Reviews
**GET** `/rooms/{roomId}/reviews`

**Query Parameters:** (Same as hotel reviews)

**Response:** (Same structure as hotel reviews)

---

### 2.2 Get Room Review Statistics
**GET** `/rooms/{roomId}/reviews/stats`

**Response:** (Same structure as hotel review stats)

---

### 2.3 Create Room Review
**POST** `/rooms/{roomId}/reviews`

**Authentication:** Required

**Request Body:** (Same as hotel review)

**Response:** (Same structure as hotel review)

---

### 2.4 Check if User Has Reviewed Room
**GET** `/rooms/{roomId}/reviews/check`

**Authentication:** Required

**Response:** (Same structure as hotel review check)

---

## 3. General Review Endpoints

### 3.1 Update Review
**PUT** `/reviews/{reviewId}`

**Authentication:** Required (Only review owner)

**Request Body:**
```json
{
  "rating": 4,
  "title": "Updated title",
  "comment": "Updated comment..."
}
```

**Response:**
```json
{
  "data": {
    "id": 15,
    "rating": 4,
    "title": "Updated title",
    "comment": "Updated comment...",
    "updated_at": "2024-01-16T10:30:00Z"
  },
  "message": "Review updated successfully"
}
```

**Error Response (Not Owner):**
```json
{
  "message": "Unauthorized. You can only update your own reviews."
}
```

---

### 3.2 Delete Review
**DELETE** `/reviews/{reviewId}`

**Authentication:** Required (Only review owner)

**Response:**
```json
{
  "message": "Review deleted successfully"
}
```

**Error Response:**
```json
{
  "message": "Unauthorized. You can only delete your own reviews."
}
```

---

## Database Schema Suggestions

### Reviews Table
```sql
CREATE TABLE reviews (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    reviewable_type VARCHAR(255) NOT NULL, -- 'hotel' or 'room'
    reviewable_id BIGINT UNSIGNED NOT NULL,
    rating TINYINT UNSIGNED NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(100) NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_reviewable (reviewable_type, reviewable_id),
    INDEX idx_user_id (user_id),
    INDEX idx_rating (rating),
    UNIQUE KEY unique_user_reviewable (user_id, reviewable_type, reviewable_id)
);
```

---

## Business Rules

1. **One Review Per User**: كل مستخدم يمكنه كتابة تقييم واحد فقط لكل فندق/غرفة
2. **Edit/Delete**: المستخدم يمكنه تعديل أو حذف تقييمه فقط
3. **Rating Calculation**: يتم حساب متوسط التقييمات تلقائياً عند إضافة/تعديل/حذف تقييم
4. **Pagination**: جميع قوائم التقييمات تدعم pagination
5. **Sorting**: يمكن ترتيب التقييمات حسب التاريخ أو التقييم
6. **Filtering**: يمكن تصفية التقييمات حسب عدد النجوم

---

## Error Responses

جميع الـ errors تتبع هذا التنسيق:

```json
{
  "message": "Error message",
  "errors": {
    "field_name": ["Error message 1", "Error message 2"]
  }
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request (Validation errors)
- `401`: Unauthorized (Not authenticated)
- `403`: Forbidden (Not authorized to perform action)
- `404`: Not Found
- `422`: Unprocessable Entity (Validation failed)
- `500`: Internal Server Error

---

## Example Implementation (Laravel)

### Model
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Review extends Model
{
    protected $fillable = [
        'user_id',
        'reviewable_type',
        'reviewable_id',
        'rating',
        'title',
        'comment',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewable(): MorphTo
    {
        return $this->morphTo();
    }
}
```

### Controller Example
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Hotel;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HotelReviewController extends Controller
{
    public function index(Request $request, Hotel $hotel)
    {
        $query = Review::where('reviewable_type', 'hotel')
            ->where('reviewable_id', $hotel->id)
            ->with('user');

        // Filter by rating
        if ($request->has('rating')) {
            $query->where('rating', $request->rating);
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $reviews = $query->paginate($request->get('per_page', 10));

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
    }

    public function store(Request $request, Hotel $hotel)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:100',
            'comment' => 'required|string|min:10|max:1000',
        ]);

        // Check if user already reviewed
        $existingReview = Review::where('user_id', Auth::id())
            ->where('reviewable_type', 'hotel')
            ->where('reviewable_id', $hotel->id)
            ->first();

        if ($existingReview) {
            return response()->json([
                'message' => 'You have already reviewed this hotel.',
            ], 422);
        }

        $review = Review::create([
            'user_id' => Auth::id(),
            'reviewable_type' => 'hotel',
            'reviewable_id' => $hotel->id,
            ...$validated,
        ]);

        $review->load('user');

        return response()->json([
            'data' => $review,
            'message' => 'Review created successfully',
        ], 201);
    }

    public function stats(Hotel $hotel)
    {
        $reviews = Review::where('reviewable_type', 'hotel')
            ->where('reviewable_id', $hotel->id)
            ->get();

        $stats = [
            'average_rating' => $reviews->avg('rating') ?? 0,
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
    }

    public function check(Hotel $hotel)
    {
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
    }
}
```

---

## Notes

1. تأكد من تحديث متوسط التقييمات في جدول الفنادق/الغرف عند إضافة/تعديل/حذف تقييم
2. يمكن إضافة خاصية إرفاق صور مع التقييمات لاحقاً
3. يمكن إضافة خاصية "Helpful" votes للتقييمات
4. يمكن إضافة خاصية الردود على التقييمات من قبل المالك

---

## Testing

يمكنك اختبار الـ API باستخدام Postman أو curl:

```bash
# Get hotel reviews
curl -X GET "http://127.0.0.1:8000/api/hotels/1/reviews?page=1&per_page=10"

# Create review (requires auth token)
curl -X POST "http://127.0.0.1:8000/api/hotels/1/reviews" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "title": "Great hotel!",
    "comment": "Had an amazing stay, highly recommended."
  }'

# Get review stats
curl -X GET "http://127.0.0.1:8000/api/hotels/1/reviews/stats"
```

