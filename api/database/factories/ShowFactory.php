<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Band;
use App\Models\User;

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
            'name' => $this->faker->sentence,
            'description' => $this->faker->text(120),
            'picture' => $this->faker->imageUrl(),
            'date' => $this->faker->dateTimeBetween('+1 week', '+1 year'),
            'duration' => $this->faker->numberBetween(60, 180),
            'band_id' => Band::factory(),
            'venue_id' => User::factory(),
            'status' => $this->faker->randomElement(['pending', 'set', 'live', 'cancelled']),
        ];
    }
}
