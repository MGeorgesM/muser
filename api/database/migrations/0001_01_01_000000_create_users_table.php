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
        
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('about', 120);
            $table->string('picture');
            $table->string('location');
            $table->foreignId('availability_id')->constrained('availabilities')->onDelete('cascade')->nullable();
            $table->foreignId('experience_id')->constrained('experiences')->onDelete('cascade')->nullable();
            $table->foreignId('instrument_id')->constrained('instruments')->onDelete('cascade')->nullable();
            $table->foreignId('role_id')->default(1)->constrained('roles')->onDelete('cascade');
            $table->boolean('is_active')->default(1);
            $table->timestamps();
        });

        Schema::create('musician_genres', function (Blueprint $table) {
            $table->foreignId('musician_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('genre_id')->constrained('genres')->onDelete('cascade');
            $table->primary(['musician_id', 'genre_id']);
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