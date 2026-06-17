<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Application;
use App\Models\Pet;

class ApplicationController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'pet_id' => 'required|exists:pets,id',
            'answers' => 'nullable|array',
            'answers.*' => 'nullable|string',
        ]);

        $customer = $request->user()->customer;
        if (!$customer) {
            return response()->json([
                'message' => 'Please complete your profile before applying.',
            ], 422);
        }

        $pet = Pet::findOrFail($validated['pet_id']);

        $answers = $validated['answers'] ?? [];

        $hasQuestions = isset($pet->adoption_questions) && count($pet->adoption_questions) > 0;
        $hasAnswers = count(array_filter($answers)) > 0;

        if ($hasQuestions && !$hasAnswers) {
            return response()->json([
                'message' => 'All questions must be answered when the pet has adoption questions.',
            ], 422);
        }

        $formattedAnswers = $hasQuestions
            ? \collect($pet->adoption_questions)->map(fn($q, $i) => [
                'question' => $q['question'],
                'answer' => $answers[$i] ?? null,
            ])->toArray()
            : [];

        $application = Application::create([
            'customer_id' => $customer->id,
            'pet_id' => $pet->id,
            'status' => $hasQuestions ? 'submitted' : 'approved',
            'answers' => $formattedAnswers,
            'submitted_at' => now(),
            'approved_at' => $hasQuestions ? null : now(),
        ]);

        if (!$hasQuestions) {
            $pet->update(['status' => 'under_review']);
        }

        return response()->json([
            'application' => $application->load('pet'),
        ], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role === 'owner') {
            $petIds = Pet::where('owner_id', $user->id)->pluck('id');
            $applications = Application::whereIn('pet_id', $petIds)
                ->with(['customer', 'pet'])
                ->latest()
                ->get();
        } else {
            $applications = Application::where('customer_id', $user->customer->id)
                ->with(['pet'])
                ->latest()
                ->get();
        }

        $applications = $applications->map(function ($app) {
            $answers = $app->answers ?? [];
            if (!empty($answers)) {
                $first = reset($answers);
                if (is_string($first)) {
                    $answers = collect($answers)->map(fn($a, $i) => ['question' => "Question " . ($i + 1), 'answer' => $a])->toArray();
                }
            }

            return [
                'id' => $app->id,
                'customer_id' => $app->customer_id,
                'pet_id' => $app->pet_id,
                'status' => $app->status,
                'answers' => $answers,
                'submitted_at' => $app->submitted_at,
                'created_at' => $app->created_at,
                'customer' => [
                    'customer_name' => $app->customer->customer_name ?? null,
                ],
                'pet' => [
                    'name' => $app->pet->name ?? null,
                    'species' => $app->pet->species ?? null,
                    'breed' => $app->pet->breed ?? null,
                ],
            ];
        });

        return response()->json([
            'applications' => $applications,
        ]);
    }

    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role === 'customer' && $user->customer) {
            $appId = $user->customer->id;
            $apps = Application::where('customer_id', $appId)->get();

            $stats = [
                'customer' => [
                    'applications_count' => $apps->count(),
                    'under_review_count' => $apps->where('status', 'under_review')->count(),
                    'approved_count' => $apps->where('status', 'approved')->count(),
                    'care_reminders_count' => 0,
                ],
            ];
        } else {
            $petIds = Pet::where('owner_id', $user->id)->pluck('id');
            $apps = Application::whereIn('pet_id', $petIds)->get();
            $pets = Pet::where('owner_id', $user->id)->count();

            $firstDayOfMonth = now()->startOfMonth();
            $adoptedThisMonth = $apps->where('status', 'completed')->filter(function ($app) use ($firstDayOfMonth) {
                return $app->completed_at && $app->completed_at->gte($firstDayOfMonth);
            })->count();

            $stats = [
                'owner' => [
                    'pets_count' => $pets,
                    'pending_count' => $apps->where(function ($q) {
                        return $q->where('status', 'submitted')->orWhere('status', 'under_review');
                    })->count(),
                    'adopted_this_month' => $adoptedThisMonth,
                    'all_time_adoptions' => $apps->where('status', 'completed')->count(),
                ],
            ];
        }

        return response()->json(['data' => $stats]);
    }

    public function ownersStats(Request $request): JsonResponse
    {
        $user = $request->user();
        $petIds = Pet::where('owner_id', $user->id)->pluck('id');
        $pets = Pet::where('owner_id', $user->id)->get();
        $apps = Application::whereIn('pet_id', $petIds)->get();

        $petStatusBreakdown = [
            'available' => $pets->where('status', 'available')->count(),
            'under_review' => $pets->where('status', 'under_review')->count(),
            'reserved' => $pets->where('status', 'reserved')->count(),
            'adopted' => $pets->where('status', 'adopted')->count(),
        ];

        $appStatusBreakdown = [
            'submitted' => $apps->where('status', 'submitted')->count(),
            'under_review' => $apps->where('status', 'under_review')->count(),
            'approved' => $apps->where('status', 'approved')->count(),
            'reserved' => $apps->where('status', 'reserved')->count(),
            'rejected' => $apps->where('status', 'rejected')->count(),
            'cancelled' => $apps->where('status', 'cancelled')->count(),
            'completed' => $apps->where('status', 'completed')->count(),
        ];

        $firstDayOfMonth = now()->startOfMonth();
        $adoptedThisMonth = $apps->where('status', 'completed')->filter(function ($app) use ($firstDayOfMonth) {
            return $app->completed_at && $app->completed_at->gte($firstDayOfMonth);
        })->count();

        $totalListed = $pets->count();
        $pendingApplications = $apps->where(function ($q) {
            return $q->where('status', 'submitted')->orWhere('status', 'under_review');
        })->count();

        $speciesDistribution = $pets->groupBy('species')->map(fn($group) => $group->count())->toArray();

        return response()->json([
            'pet_status_breakdown' => $petStatusBreakdown,
            'application_status' => $appStatusBreakdown,
            'key_metrics' => [
                'adopted_this_month' => $adoptedThisMonth,
                'total_listed' => $totalListed,
                'pending_applications' => $pendingApplications,
            ],
            'species_distribution' => $speciesDistribution,
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $application = Application::findOrFail($id);

        if ($user->role === 'owner') {
            $pet = Pet::find($application->pet_id);
            if (!$pet || $pet->owner_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        } elseif ($user->role === 'customer') {
            if ($application->customer_id !== $user->customer->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        $validated = $request->validate([
            'status' => 'required|in:submitted,under_review,reserved,approved,rejected,completed,cancelled',
        ]);

        $newStatus = $validated['status'];
        $now = now();

        if ($newStatus === 'approved') {
            $application->update(['approved_at' => $now]);
            $pet = Pet::find($application->pet_id);
            if ($pet) {
                $pet->update(['status' => 'reserved']);
            }
        } elseif ($newStatus === 'rejected' || $newStatus === 'cancelled') {
            $application->update(['rejected_at' => $now]);
            $pet = Pet::find($application->pet_id);
            if ($pet && $pet->status === 'under_review') {
                $pet->update(['status' => 'available']);
            }
        } elseif ($newStatus === 'completed') {
            $application->update(['completed_at' => $now]);
            $pet = Pet::find($application->pet_id);
            if ($pet) {
                $pet->update(['status' => 'adopted']);
            }
        }

        $application->update(['status' => $newStatus]);

        return response()->json([
            'application' => $application->fresh()->load(['pet', 'customer']),
        ]);
    }
}
