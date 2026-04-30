<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\VoteController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\FollowController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/reports', [ReportController::class, 'index']);
Route::get('/reports/{report}', [ReportController::class, 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::post('/reports', [ReportController::class, 'store']);
    Route::post('/reports/{report}/comments', [CommentController::class, 'store']);
    Route::post('/reports/{report}/upvote', [VoteController::class, 'toggleUpvote']);
    Route::post('/reports/{report}/downvote', [VoteController::class, 'toggleDownvote']);
    Route::put('/reports/{report}', [ReportController::class, 'update']);
    Route::delete('/reports/{report}', [ReportController::class, 'destroy']);

    Route::get('/conversations', [MessageController::class, 'index']);
    Route::get('/conversations/{userId}', [MessageController::class, 'show']);
    Route::post('/conversations/{userId}/messages', [MessageController::class, 'store']);
    Route::delete('/messages/{messageId}', [MessageController::class, 'destroy']);

    Route::get('/user/following', [FollowController::class, 'following']);
    Route::post('/users/{userId}/follow', [FollowController::class, 'store']);
    Route::delete('/users/{userId}/follow', [FollowController::class, 'destroy']);
});
