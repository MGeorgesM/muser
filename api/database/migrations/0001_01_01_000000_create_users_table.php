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
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
        });

        Schema::create('genres', function (Blueprint $table) {
            $table->id();
            $table->string('name');
        });

        Schema::create('availabilities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
        });

        Schema::create('experiences', function (Blueprint $table) {
            $table->id();
            $table->string('name');
        });

        Schema::create('instruments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
        });

        Schema::create('venue_types',function (Blueprint $table) {
            $table->id();
            $table->string('name');
        });

        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
        });
        
        Schema::create('users', function (Blueprint $table) {
        $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('about', 50);
            $table->string('picture');
            $table->foreignId('location_id')->constrained('locations')->onDelete('cascade');
            $table->foreignId('availability_id')->nullable()->constrained('availabilities')->onDelete('cascade');
            $table->foreignId('experience_id')->nullable()->constrained('experiences')->onDelete('cascade');
            $table->foreignId('instrument_id')->nullable()->constrained('instruments')->onDelete('cascade');
            $table->string('venue_name', 40)->nullable();
            $table->foreignId('venue_type_id')->nullable()->constrained('venue_types')->onDelete('cascade');
            $table->foreignId('role_id')->default(1)->constrained('roles')->onDelete('cascade');
            $table->boolean('is_active')->default(1);
            $table->timestamps();
        });

        Schema::create('musician_genres', function (Blueprint $table) {
            $table->id();
            $table->foreignId('musician_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('genre_id')->constrained('genres')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('musician_genres');
        Schema::dropIfExists('users');
        Schema::dropIfExists('instruments');
        Schema::dropIfExists('experiences');
        Schema::dropIfExists('availabilities');
        Schema::dropIfExists('genres');
        Schema::dropIfExists('roles');
    }
};
