<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PetImageController;
use App\Http\Controllers\PetController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\AdminController;

Route::get('/health', function () {
    return response()->json(['status' => 'OK']);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public routes (must be before auth middleware group so they're matched first)
Route::get('/pets', [PetController::class, 'publicIndex']);
Route::get('/pets/{id}', [PetController::class, 'publicShow']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::get('/profile', [ProfileController::class, 'getProfile']);
    Route::post('/profile', [ProfileController::class, 'profile']);

    Route::post('/pet-image', [PetImageController::class, 'upload']);

    Route::get('/owner-pets', [PetController::class, 'index']);
    Route::post('/pets', [PetController::class, 'store']);
    Route::put('/pets/{id}', [PetController::class, 'update']);
    Route::delete('/pets/{id}', [PetController::class, 'destroy']);
    Route::get('/recommendations', [PetController::class, 'recommendations']);

    Route::post('/application', [ApplicationController::class, 'store']);
    Route::get('/applications', [ApplicationController::class, 'index']);
    Route::put('/applications/{id}', [ApplicationController::class, 'update']);
    Route::get('/dashboard-stats', [ApplicationController::class, 'stats']);
    Route::get('/dashboard-owners-stats', [ApplicationController::class, 'ownersStats']);
    Route::get('/care-reminders', [ApplicationController::class, 'getCareReminders']);
    Route::post('/care-reminders/{id}/survey', [ApplicationController::class, 'submitSurvey']);

    Route::get('/conversations', [ConversationController::class, 'index']);
    Route::post('/conversations', [ConversationController::class, 'store']);
    Route::get('/conversations/{conversationId}/messages', [ConversationController::class, 'messages']);
    Route::post('/conversations/{conversationId}/messages', [ConversationController::class, 'sendMessage']);
    Route::get('/unread-count', [ConversationController::class, 'unreadCount']);

    Route::middleware('admin')->group(function () {
        Route::get('/admin/users', [AdminController::class, 'index']);
        Route::get('/admin/users/{id}', [AdminController::class, 'show']);
        Route::post('/admin/users', [AdminController::class, 'store']);
        Route::put('/admin/users/{id}', [AdminController::class, 'update']);
        Route::delete('/admin/users/{id}', [AdminController::class, 'destroy']);
        Route::get('/admin/stats', [AdminController::class, 'stats']);
    });
});
