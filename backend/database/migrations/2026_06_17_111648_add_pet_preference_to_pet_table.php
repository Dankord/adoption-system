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
        Schema::table('pets', function (Blueprint $table) {
            $table->string('housing_preference')->nullable()->after('status');
            $table->boolean('good_with_other_pets')->nullable()->after('housing_preference');
            $table->string('required_experience')->nullable()->after('good_with_other_pets');
        });
    }

    public function down(): void
    {
        Schema::table('pets', function (Blueprint $table) {
            $table->dropColumn(['housing_preference', 'good_with_other_pets', 'required_experience']);
        });
    }
};
