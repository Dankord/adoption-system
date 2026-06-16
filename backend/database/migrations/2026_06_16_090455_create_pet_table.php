<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pets', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('species');
            $table->string('breed')->nullable();
            $table->string('image')->nullable();
            $table->decimal('adoption_fee', 10, 2)->nullable();
            $table->integer('age')->nullable();
            $table->string('gender')->nullable();
            $table->string('vac_status')->nullable(); // e.g. vaccinated / not vaccinated
            $table->boolean('is_neutered')->default(false);
            $table->json('temperaments')->nullable(); // could also be json if structured
            $table->text('special_needs')->nullable();
            $table->json('adoption_questions')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pet');
    }
};

        // 'name',
        // 'species',
        // 'image',
        // 'adoption_fee',
        // 'breed',
        // 'age',
        // 'gender',
        // 'vac_status',
        // 'is_neutered',
        // 'temperaments',
        // 'special_needs',
        // 'adoption_questions'