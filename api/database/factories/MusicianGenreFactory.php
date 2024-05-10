<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MusicianGenre>
 */
class MusicianGenreFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Array of all genre IDs
        $allGenreIds = range(1, 8);
        
        $excludedGenreIds = [1, 2, 5]; 

        $allowedGenreIds = array_diff($allGenreIds, $excludedGenreIds);

        return [
            'musician_id' => $this->faker->numberBetween(5, 25),
            'genre_id' => $this->faker->randomElement($allowedGenreIds)
        ];
    }
}
