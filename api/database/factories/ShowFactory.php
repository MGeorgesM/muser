<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Show>
 */
class ShowFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'time' => $this->faker->time('H:i:s'),
            'duration' => $this->faker->numberBetween(1, 4),
            'band_id' => $this->faker->numberBetween(1, 10),
            'venue_id' => $this->faker->numberBetween(11, 15),
            'genre_id' => $this->faker->numberBetween(1, 8),
            'status' => $this->faker->randomElement(['pending', 'set', 'live', 'cancelled']),
            'date' => $this->faker->dateTimeBetween('+1 week', '+1 month')->format('Y-m-d'),
            'picture' => $this->faker->randomElement(array_map(function ($i) {
                return "show ({$i}).jpg";
            }, range(1, 5))),
        ];
    }
}
