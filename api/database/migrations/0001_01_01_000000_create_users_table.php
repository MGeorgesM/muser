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

        // Schema::create('instruments', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('name');
        //     $table->timestamps();
        // });

        Schema::create('genres', function (Blueprint $table) {
            $table->id();
            $table->string('name');
        });

        // Schema::create('experiences', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('name');
        //     $table->timestamps();
        // });

        // Schema::create('availabilities', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('name');
        //     $table->timestamps();
        // });

        // Schema::create('venue_types', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('name');
        //     $table->timestamps();
        // });

        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('about');
            $table->string('picture');
            $table->string('location');
            $table->foreignId('role_id')->default(1)->constrained('roles')->onDelete('cascade');
            $table->boolean('is_active')->default(1);
            $table->enum('availability', ['mornings', 'afternoons', 'evenings'])->nullable();
            $table->enum('experience', ['beginner', 'intermediate', 'advanced'])->nullable();
            $table->enum('instrument', ['strings', 'bass', 'drums', 'vocals', 'keyboard', 'other'])->nullable();
            $table->enum('venue_type', ['bar', 'restaurant', 'club', 'theater', 'arena', 'other'])->nullable();
            $table->timestamps();
        });

        Schema::create('musician_genres', function (Blueprint $table) {
            $table->foreignId('musician_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('genre_id')->constrained('genres')->onDelete('cascade');
            $table->primary(['musician_id', 'genre_id']);
        });

        // Schema::create('musician_experiences', function (Blueprint $table) {
        //     $table->foreignId('musician_id')->constrained('users')->onDelete('cascade');
        //     $table->foreignId('experience_id')->constrained('experiences')->onDelete('cascade');
        //     $table->primary(['musician_id', 'experience_id']);
        // });

        // Schema::create('venue_details', function (Blueprint $table) {
        //     $table->id();
        //     $table->foreignId('venue_id')->constrained('users')->onDelete('cascade');
        //     $table->string('venue_name');
        //     $table->foreignId('venue_type_id')->constrained('venue_types')->onDelete('cascade');
        //     $table->timestamps();
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('venue_details');
        Schema::dropIfExists('musician_experiences');
        Schema::dropIfExists('musician_genres');
        Schema::dropIfExists('users');
        Schema::dropIfExists('venue_types');
        Schema::dropIfExists('availabilities');
        Schema::dropIfExists('experiences');
        Schema::dropIfExists('genres');
        Schema::dropIfExists('instruments');
        Schema::dropIfExists('roles');
    }
};
