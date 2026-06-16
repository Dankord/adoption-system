<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function profile(Request $request): JsonResponse
    {
        $user = $request->user();

        $flatValidation = [
            'customer_name' => ['nullable', 'string', 'max:255'],
            'housing_type' => ['nullable', 'string'],
            'has_space' => ['nullable', 'boolean'],
            'previous_owner' => ['nullable', 'boolean'],
            'household_number' => ['nullable', 'integer', 'min:1'],
            'has_pets' => ['nullable', 'boolean'],
            'typical_sched' => ['nullable', 'string'],
        ];

        $nestedValidation = [
            'profile.customer_name' => ['required', 'string', 'max:255'],
            'profile.housing_type' => ['required', 'string'],
            'profile.has_space' => ['required', 'boolean'],
            'profile.previous_owner' => ['required', 'boolean'],
            'profile.household_number' => ['required', 'integer', 'min:1'],
            'profile.has_pets' => ['required', 'boolean'],
            'profile.typical_sched' => ['required', 'string'],
        ];

        if ($request->has('profile')) {
            $validated = $request->validate($nestedValidation);
            $data = $validated['profile'];
        } else {
            $validated = $request->validate($flatValidation);
            $data = $validated;
        }

        if (!$user->customer()->exists()) {
            $user->customer()->create($data);
        } else {
            $user->customer()->update($data);
        }

        $user->update([
            'profile_completed_at' => now(),
        ]);

        return response()->json([
            'user' => $user->fresh()->load('customer'),
        ]);
    }

    public function getProfile(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->load('customer');

        return response()->json([
            'user' => $user,
        ]);
    }
}
