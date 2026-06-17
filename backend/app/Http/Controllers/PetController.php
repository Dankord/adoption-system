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
        ];
    }
}
