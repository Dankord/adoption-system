<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Pet;

class PetController extends Controller
{
    public function publicIndex(Request $request): JsonResponse
    {
        $pets = Pet::where('status', 'available')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'pets' => $pets->map(function ($pet) {
                return $this->formatPet($pet);
            }),
        ]);
    }

    public function publicShow(Request $request, int $id): JsonResponse
    {
        $pet = Pet::find($id);

        if (!$pet) {
            return response()->json(['message' => 'Pet not found'], 404);
        }

        return response()->json([
            'pet' => $this->formatPet($pet),
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $pets = Pet::where('owner_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'pets' => $pets->map(function ($pet) {
                return $this->formatPet($pet);
            }),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:64',
            'species' => 'required|in:Dog,Cat,Rabbit,Bird,Other',
            'breed' => 'required|string|max:64',
            'age' => 'required|string|max:32',
            'gender' => 'required|in:Male,Female',
            'adoption_fee' => 'required|numeric|min:0',
            'vac_status' => 'nullable|string',
            'is_neutered' => 'boolean',
            'temperaments' => 'nullable|array',
            'special_needs' => 'nullable|string',
            'adoption_questions' => 'nullable|array',
            'status' => 'nullable|in:available,under_review,reserved,adopted',
            'image' => 'nullable|string',
            'description' => 'nullable|string',
            'housing_preference' => 'nullable|string',
            'good_with_other_pets' => 'nullable|boolean',
            'required_experience' => 'nullable|string',
        ]);

        $user = $request->user();

        $pet = Pet::create([
            'owner_id' => $user->id,
            'name' => $validated['name'],
            'species' => $validated['species'],
            'breed' => $validated['breed'],
            'age' => $validated['age'],
            'gender' => $validated['gender'],
            'adoption_fee' => $validated['adoption_fee'],
            'vac_status' => $validated['vac_status'] ?? 'No',
            'is_neutered' => $validated['is_neutered'] ?? false,
            'temperaments' => $validated['temperaments'] ?? [],
            'special_needs' => $validated['special_needs'] ?? null,
            'adoption_questions' => $validated['adoption_questions'] ?? [],
            'status' => $validated['status'] ?? 'under_review',
            'image' => $validated['image'] ?? null,
            'description' => $validated['description'] ?? null,
            'housing_preference' => $validated['housing_preference'] ?? null,
            'good_with_other_pets' => $validated['good_with_other_pets'] ?? null,
            'required_experience' => $validated['required_experience'] ?? null,
        ]);

        return response()->json([
            'pet' => $this->formatPet($pet),
        ], 201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $pet = Pet::where('owner_id', $user->id)->find($id);

        if (!$pet) {
            return response()->json(['message' => 'Pet not found'], 404);
        }

        return response()->json([
            'pet' => $this->formatPet($pet),
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $pet = Pet::where('owner_id', $user->id)->find($id);

        if (!$pet) {
            return response()->json(['message' => 'Pet not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:64',
            'species' => 'required|in:Dog,Cat,Rabbit,Bird,Other',
            'breed' => 'required|string|max:64',
            'age' => 'required|string|max:32',
            'gender' => 'required|in:Male,Female',
            'adoption_fee' => 'required|numeric|min:0',
            'vac_status' => 'nullable|string',
            'is_neutered' => 'boolean',
            'temperaments' => 'nullable|array',
            'special_needs' => 'nullable|string',
            'adoption_questions' => 'nullable|array',
            'status' => 'nullable|in:available,under_review,reserved,adopted',
            'image' => 'nullable|string',
            'description' => 'nullable|string',
            'housing_preference' => 'nullable|string',
            'good_with_other_pets' => 'nullable|boolean',
            'required_experience' => 'nullable|string',
        ]);

        $pet->update([
            'name' => $validated['name'],
            'species' => $validated['species'],
            'breed' => $validated['breed'],
            'age' => $validated['age'],
            'gender' => $validated['gender'],
            'adoption_fee' => $validated['adoption_fee'],
            'vac_status' => $validated['vac_status'] ?? 'No',
            'is_neutered' => $validated['is_neutered'] ?? false,
            'temperaments' => $validated['temperaments'] ?? [],
            'special_needs' => $validated['special_needs'] ?? null,
            'adoption_questions' => $validated['adoption_questions'] ?? [],
            'status' => $validated['status'] ?? 'under_review',
            'image' => $validated['image'] ?? $pet->image,
            'description' => $validated['description'] ?? $pet->description,
            'housing_preference' => $validated['housing_preference'] ?? $pet->housing_preference,
            'good_with_other_pets' => $validated['good_with_other_pets'] ?? $pet->good_with_other_pets,
            'required_experience' => $validated['required_experience'] ?? $pet->required_experience,
        ]);

        return response()->json([
            'pet' => $this->formatPet($pet->fresh()),
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $pet = Pet::where('owner_id', $user->id)->find($id);

        if (!$pet) {
            return response()->json(['message' => 'Pet not found'], 404);
        }

        if ($pet->image && Storage::disk('public')->exists($pet->image)) {
            Storage::disk('public')->delete($pet->image);
        }

        $pet->delete();

        return response()->json(['message' => 'Pet deleted successfully']);
    }

    private function formatPet(Pet $pet): array
    {
        return [
            'id' => $pet->id,
            'name' => $pet->name,
            'species' => $pet->species,
            'breed' => $pet->breed,
            'age' => $pet->age,
            'gender' => $pet->gender,
            'status' => ucfirst($pet->status),
            'adoption_fee' => $pet->adoption_fee,
            'image' => $pet->image ? Storage::url($pet->image) : null,
            'vaccinated' => $pet->vac_status === 'Yes' || $pet->vac_status === 'Vaccinated' || $pet->vac_status === 'yes',
            'neutered' => (bool) $pet->is_neutered,
            'special_needs' => $pet->special_needs,
            'temperaments' => $pet->temperaments ?? [],
            'adoption_questions' => $pet->adoption_questions ?? [],
            'description' => $pet->description,
            'created_at' => $pet->created_at,
            'housing_preference' => $pet->housing_preference,
            'good_with_other_pets' => $pet->good_with_other_pets,
            'required_experience' => $pet->required_experience,
        ];
    }

    public function recommendations(Request $request): JsonResponse
    {
        $user = $request->user();
        $customer = $user->customer;

        if (!$customer) {
            return response()->json(['pets' => []]);
        }

        $housingType = $customer->housing_type ?? '';
        $hasSpace = (bool) $customer->has_space;
        $hasPets = (bool) $customer->has_pets;
        $schedule = $customer->typical_sched ?? '';
        $previousOwner = (bool) $customer->previous_owner;

        $pets = Pet::where('status', 'available')
            ->with('owner')
            ->get()
            ->map(function ($pet) use ($housingType, $hasSpace, $hasPets, $schedule, $previousOwner) {
                $score = 0;
                $matchDetails = [];

                if ($pet->housing_preference) {
                    if ($pet->housing_preference === 'apartment-friendly') {
                        if (stripos($housingType, 'apartment') !== false || stripos($housingType, 'condo') !== false) {
                            $score += 2;
                            $matchDetails[] = 'Housing match';
                        }
                    } elseif ($pet->housing_preference === 'yard_needed' || $pet->housing_preference === 'large_space') {
                        if ($hasSpace && (stripos($housingType, 'house') !== false || stripos($housingType, 'standalone') !== false)) {
                            $score += 2;
                            $matchDetails[] = 'Space match';
                        } else {
                            return null;
                        }
                    } elseif ($pet->housing_preference === 'any') {
                        $score += 1;
                    }
                }

                if ($pet->good_with_other_pets === false && $hasPets) {
                    return null;
                }

                if ($pet->good_with_other_pets === true && $hasPets) {
                    $score += 2;
                    $matchDetails[] = 'Good with existing pets';
                }

                if ($pet->required_experience) {
                    if ($pet->required_experience === 'first_time_friendly') {
                        if (!$previousOwner && !$hasPets) {
                            $score += 2;
                            $matchDetails[] = 'Great for first-time owners';
                        } else {
                            $score += 1;
                        }
                    } elseif ($pet->required_experience === 'experienced_only') {
                        if ($previousOwner && $hasPets) {
                            $score += 2;
                            $matchDetails[] = 'Experience match';
                        } else {
                            return null;
                        }
                    } elseif ($pet->required_experience === 'intermediate') {
                        if ($previousOwner || $hasPets) {
                            $score += 2;
                            $matchDetails[] = 'Experience match';
                        } else {
                            $score += 0;
                        }
                    }
                }

                if ($schedule) {
                    $petTemps = $pet->temperaments ?? [];
                    if (in_array('high_energy', array_map('strtolower', $petTemps)) || in_array('Energetic', $petTemps)) {
                        if (stripos($schedule, 'work_from_home') !== false || stripos($schedule, 'home') !== false) {
                            $score += 2;
                            $matchDetails[] = 'Energy schedule match';
                        } else {
                            $score -= 1;
                        }
                    } elseif (in_array('calm', array_map('strtolower', $petTemps)) || in_array('Calm', $petTemps)) {
                        if (stripos($schedule, 'away') !== false || stripos($schedule, 'work') !== false) {
                            $score += 2;
                            $matchDetails[] = 'Calm pet for busy schedule';
                        }
                    }
                }

                if ($score <= 0) {
                    return null;
                }

                return [
                    'id' => $pet->id,
                    'name' => $pet->name,
                    'species' => $pet->species,
                    'breed' => $pet->breed,
                    'age' => $pet->age,
                    'gender' => $pet->gender,
                    'status' => ucfirst($pet->status),
                    'adoption_fee' => $pet->adoption_fee,
                    'image' => $pet->image ? Storage::url($pet->image) : null,
                    'vaccinated' => $pet->vac_status === 'Yes' || $pet->vac_status === 'Vaccinated' || $pet->vac_status === 'yes',
                    'neutered' => (bool) $pet->is_neutered,
                    'special_needs' => $pet->special_needs,
                    'temperaments' => $pet->temperaments ?? [],
                    'adoption_questions' => $pet->adoption_questions ?? [],
                    'description' => $pet->description,
                    'created_at' => $pet->created_at,
                    'housing_preference' => $pet->housing_preference,
                    'good_with_other_pets' => $pet->good_with_other_pets,
                    'required_experience' => $pet->required_experience,
                    'match_score' => $score,
                    'match_details' => $matchDetails,
                    'owner_name' => $pet->owner ? $pet->owner->customer->customer_name ?? 'Owner' : 'Owner',
                ];
            })
            ->filter()
            ->sortByDesc('match_score')
            ->values();

        return response()->json(['pets' => $pets]);
    }
}
