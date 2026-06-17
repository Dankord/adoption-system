<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class AdminController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $users = User::with('customer')
            ->select('id', 'email', 'role', 'profile_completed_at', 'created_at')
            ->latest()
            ->get();

        $users = $users->map(function ($u) {
            return [
                'id' => $u->id,
                'email' => $u->email,
                'role' => $u->role,
                'profile_completed_at' => $u->profile_completed_at,
                'customer_name' => $u->customer?->customer_name ?? null,
                'has_customer_profile' => $u->customer !== null,
                'created_at' => $u->created_at,
            ];
        });

        return response()->json(['users' => $users]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        if (!$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $userData = User::with('customer')
            ->select('id', 'email', 'role', 'profile_completed_at', 'created_at')
            ->find($id);

        if (!$userData) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $data = [
            'id' => $userData->id,
            'email' => $userData->email,
            'role' => $userData->role,
            'profile_completed_at' => $userData->profile_completed_at,
            'customer_name' => $userData->customer?->customer_name ?? null,
            'has_customer_profile' => $userData->customer !== null,
            'created_at' => $userData->created_at,
        ];

        if ($userData->customer) {
            $data['customer'] = [
                'housing_type' => $userData->customer->housing_type,
                'has_space' => $userData->customer->has_space,
                'previous_owner' => $userData->customer->previous_owner,
                'household_number' => $userData->customer->household_number,
                'has_pets' => $userData->customer->has_pets,
                'typical_sched' => $userData->customer->typical_sched,
            ];
        }

        return response()->json(['user' => $data]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', Rules\Password::defaults()],
            'name' => ['required', 'string', 'max:255'],
            'role' => ['required', 'string', 'in:customer,owner'],
        ]);

        $newUser = User::create([
            'email' => $validated['email'],
            'password' => $validated['password'],
            'role' => $validated['role'],
        ]);

        if ($validated['role'] === 'customer') {
            $newUser->customer()->create([
                'customer_name' => $validated['name'],
                'housing_type' => 'Not set',
                'has_space' => false,
                'previous_owner' => false,
                'household_number' => 1,
                'has_pets' => false,
                'typical_sched' => 'Not set',
            ]);
        }

        return response()->json([
            'user' => $newUser->fresh()->load('customer'),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        if (!$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $targetUser = User::find($id);

        if (!$targetUser) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if ($targetUser->id === $user->id) {
            return response()->json(['message' => 'Cannot modify your own account'], 400);
        }

        $validated = $request->validate([
            'email' => ['sometimes', 'string', 'email', 'max:255', 'unique:users,email,' . $id],
            'role' => ['sometimes', 'string', 'in:customer,owner'],
            'name' => ['sometimes', 'string', 'max:255'],
            'profile_completed_at' => ['sometimes', 'nullable', 'date'],
        ]);

        $updateData = [];

        if (isset($validated['email'])) {
            $updateData['email'] = $validated['email'];
        }

        if (isset($validated['role'])) {
            $updateData['role'] = $validated['role'];

            if ($validated['role'] === 'customer' && !$targetUser->customer) {
                $targetUser->customer()->create([
                    'customer_name' => $targetUser->customer?->customer_name ?? $validated['name'] ?? $targetUser->email,
                    'housing_type' => 'Not set',
                    'has_space' => false,
                    'previous_owner' => false,
                    'household_number' => 1,
                    'has_pets' => false,
                    'typical_sched' => 'Not set',
                ]);
            }
        }

        if (isset($validated['name']) && $targetUser->customer) {
            $targetUser->customer->update(['customer_name' => $validated['name']]);
        }

        if (isset($validated['profile_completed_at'])) {
            $updateData['profile_completed_at'] = $validated['profile_completed_at'];
        }

        if (!empty($updateData)) {
            $targetUser->update($updateData);
        }

        return response()->json([
            'user' => $targetUser->fresh()->load('customer'),
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        if (!$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $targetUser = User::find($id);

        if (!$targetUser) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if ($targetUser->id === $user->id) {
            return response()->json(['message' => 'Cannot delete your own account'], 400);
        }

        if ($targetUser->role === 'owner' && $targetUser->customer) {
            $targetUser->customer->delete();
        }

        $targetUser->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $totalUsers = User::count();
        $totalCustomers = User::where('role', 'customer')->count();
        $totalOwners = User::where('role', 'owner')->count();
        $totalPets = \App\Models\Pet::count();
        $totalApplications = \App\Models\Application::count();
        $totalAdoptions = \App\Models\Application::where('status', 'completed')->count();
        $pendingApplications = \App\Models\Application::whereIn('status', ['submitted', 'under_review'])->count();

        $usersThisWeek = User::where('created_at', '>=', now()->startOfWeek())->count();
        $adoptionsThisMonth = \App\Models\Application::where('status', 'completed')
            ->where('completed_at', '>=', now()->startOfMonth())
            ->count();

        return response()->json([
            'total_users' => $totalUsers,
            'total_customers' => $totalCustomers,
            'total_owners' => $totalOwners,
            'total_pets' => $totalPets,
            'total_applications' => $totalApplications,
            'total_adoptions' => $totalAdoptions,
            'pending_applications' => $pendingApplications,
            'users_this_week' => $usersThisWeek,
            'adoptions_this_month' => $adoptionsThisMonth,
        ]);
    }
}
