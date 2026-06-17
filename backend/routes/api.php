<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PetImageController;
use App\Http\Controllers\PetController;

Route::get('/health', function () {
    return response()->json(['status' => 'OK']);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

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
    Route::get('/pets/{id}', [PetController::class, 'show']);
    Route::put('/pets/{id}', [PetController::class, 'update']);
    Route::delete('/pets/{id}', [PetController::class, 'destroy']);
});
