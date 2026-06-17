<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PetImageController;
use App\Http\Controllers\PetController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\ConversationController;

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

    // Get all conversations for current user
    Route::get('/conversations', [ConversationController::class, 'index']);
    // Create a new conversation (customer messages an owner)
    Route::post('/conversations', [ConversationController::class, 'store']);
    // Get messages in a conversation
    Route::get('/conversations/{conversation}/messages', [ConversationController::class, 'messages']);
    // Send a message
    Route::post('/conversations/{conversation}/messages', [ConversationController::class, 'sendMessage']);
    // Mark messages as read
    Route::put('/conversations/{conversation}/read', [ConversationController::class, 'markAsRead']);
    // Get unread count
    Route::get('/unread-count', [ConversationController::class, 'unreadCount']);
});
