<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', Rules\Password::defaults()],
            'name' => ['nullable', 'string', 'max:255'],
        ]);

        $user = User::create([
            'email' => $request->email,
            'password' => $request->password,
            'role' => 'customer',
        ]);

        $customerData = [
            'customer_name' => $request->name ?? $request->email,
            'housing_type' => 'Not set',
            'has_space' => false,
            'previous_owner' => false,
            'household_number' => 1,
            'has_pets' => false,
            'typical_sched' => 'Not set',
        ];

        $user->customer()->create($customerData);

        return response()->json([
            'user' => $user->fresh()->load('customer'),
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $request->validate([    
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('spa')->plainTextToken;

        return response()->json([
            'user' => $user->fresh()->load('customer'),
            'token' => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    public function user(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user()->load('customer'),
        ]);
    }
}
