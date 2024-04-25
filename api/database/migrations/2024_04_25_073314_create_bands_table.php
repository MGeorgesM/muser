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
        Schema::create('bands', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('band_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('band_id')->constrained('bands')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
        });

        Schema::create('shows', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('description', 120);
            $table->string('picture');
            $table->dateTime('date');
            $table->integer('duration');

            $table->foreignId('band_id')->constrained('bands')->onDelete('cascade');
            $table->foreignId('venue_id')->constrained('users')->onDelete('cascade');

            $table->enum('status', ['pending', 'set', 'live', 'cancelled']);
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shows');
        Schema::dropIfExists('band_members');
        Schema::dropIfExists('bands');
    }
};
