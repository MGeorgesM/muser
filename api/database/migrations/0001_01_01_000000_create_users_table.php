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
            $table->timestamps();
        });

        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('about');
            $table->string('picture');
            $table->string('location');
            $table->unsignedBigInteger('role_id')->default(1);
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade')->onUpdate('cascade');
            $table->boolean('is_active')->default(1);
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('instruments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('genres', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('experiences', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('availabilities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('venue_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('musician_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
            $table->unsignedBigInteger('instrument_id');
            $table->foreign('instrument_id')->references('id')->on('instruments')->onDelete('cascade')->onUpdate('cascade');
            $table->unsignedBigInteger('genre_id');
            $table->foreign('genre_id')->references('id')->on('genres')->onDelete('cascade')->onUpdate('cascade');
            $table->unsignedBigInteger('experience_id');
            $table->foreign('experience_id')->references('id')->on('experiences')->onDelete('cascade')->onUpdate('cascade');
            $table->timestamps();
        });

        Schema::create('venue_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
            $table->string('venue_name');
            $table->unsignedBigInteger('venue_type_id');
            $table->foreign('venue_type_id')->references('id')->on('venue_types')->onDelete('cascade')->onUpdate('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roles');
        Schema::dropIfExists('insturments');
        Schema::dropIfExists('genres');
        Schema::dropIfExists('experiences');
        Schema::dropIfExists('availabilities');
        Schema::dropIfExists('venue_types');
        Schema::dropIfExists('musician_details');
        Schema::dropIfExists('venue_details');
        Schema::dropIfExists('users');
    }
};
