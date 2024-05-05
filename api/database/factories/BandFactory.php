<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Band>
 */
class BandFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $bandNames = [
            "Midnight Echoes",
            "Velvet Thunder",
            "Neon Dreamers",
            "Silent Harmony",
            "Eclipse Rhythm",
            "Golden Rebels",
            "Electric Serenade",
            "Twilight Frequency",
            "Celestial Tunes",
            "Rustic Melodies"
        ];
        
        return [
            'name' => $this->faker->company,
            'name' => $this->faker->unique()->randomElement($bandNames),
        ];
    }
}
