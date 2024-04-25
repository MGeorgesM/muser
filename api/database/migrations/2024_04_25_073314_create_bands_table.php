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
            $table->unsignedBigInteger('band_id');
            $table->foreign('band_id')->references('id')->on('bands')->onDelete('cascade')->onUpdate('cascade');
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
            $table->timestamps();
        });

        schema::create('shows', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('description');
            $table->string('picture');
            $table->date('date');
            $table->unsignedBigInteger('band_id');
            $table->foreign('band_id')->references('id')->on('bands')->onDelete('cascade')->onUpdate('cascade');
            $table->unsignedBigInteger('venue_id');
            $table->foreign('venue_id')->references('id')->on('venues')->onDelete('cascade')->onUpdate('cascade');
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bands');
    }
};
