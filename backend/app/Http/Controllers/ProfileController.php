<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;

class ProfileController extends Controller
{
    public function profile(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'profile.customer_name' => ['required', 'string', 'max:255'],
            'profile.housing_type' => ['required', 'string'],
            'profile.has_space' => ['required', 'boolean'],
            'profile.previous_owner' => ['required', 'boolean'],
            'profile.household_number' => ['required', 'integer', 'min:1'],
            'profile.has_pets' => ['required', 'boolean'],
            'profile.typical_sched' => ['required', 'string'],
        ]);
        $user = $request->user();

        $user->customer()->updateOrCreate(
            ['user_id' => $user->id],
            $validated['profile']
        );

        $user->update([
            'profile_completed_at' => now(),
        ]);

        return response()->json([
            'user' => $user,
        ]);
    }
}
