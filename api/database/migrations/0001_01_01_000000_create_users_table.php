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

        // Schema::create('availability', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('name');
        // });

        // Schema::create('experience', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('name');
        // });

        // Schema::create('instrument', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('name');
        // });

        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('about', 100);
            $table->string('picture');
            $table->string('location');
            $table->enum('availability', ['mornings', 'afternoons', 'evenings']);
            $table->enum('experience', ['beginner', 'intermediate', 'advanced'])->nullable();
            $table->enum('instrument', ['strings', 'bass', 'drums', 'vocals', 'keyboard'])->nullable();
            $table->enum('venue_type', ['bar', 'restaurant', 'club', 'theater', 'other'])->nullable();
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
        Schema::dropIfExists('genres');
        Schema::dropIfExists('roles');
    }
};
