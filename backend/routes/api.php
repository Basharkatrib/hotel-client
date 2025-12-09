<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\HotelReviewController;
use App\Http\Controllers\Api\RoomReviewController;
use App\Http\Controllers\Api\ReviewController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Hotel Reviews Routes
Route::prefix('hotels')->group(function () {
    Route::prefix('{hotel}')->group(function () {
        // Public routes
        Route::get('/reviews', [HotelReviewController::class, 'index']);
        Route::get('/reviews/stats', [HotelReviewController::class, 'stats']);
        
        // Protected routes (require authentication)
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/reviews', [HotelReviewController::class, 'store']);
            Route::get('/reviews/check', [HotelReviewController::class, 'check']);
        });
    });
});

// Room Reviews Routes
Route::prefix('rooms')->group(function () {
    Route::prefix('{room}')->group(function () {
        // Public routes
        Route::get('/reviews', [RoomReviewController::class, 'index']);
        Route::get('/reviews/stats', [RoomReviewController::class, 'stats']);
        
        // Protected routes (require authentication)
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/reviews', [RoomReviewController::class, 'store']);
            Route::get('/reviews/check', [RoomReviewController::class, 'check']);
        });
    });
});

// General Review Routes (Update & Delete)
Route::middleware('auth:sanctum')->prefix('reviews')->group(function () {
    Route::put('/{review}', [ReviewController::class, 'update']);
    Route::delete('/{review}', [ReviewController::class, 'destroy']);
});
