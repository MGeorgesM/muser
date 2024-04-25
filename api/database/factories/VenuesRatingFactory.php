<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VenuesRating>
 */
class VenuesRatingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'venue_id' => $this->faker->numberBetween(11, 15),
            'user_id' => $this->faker->numberBetween(1, 10),
            'rating' => $this->faker->numberBetween(1, 5)
        ];
    }
}
