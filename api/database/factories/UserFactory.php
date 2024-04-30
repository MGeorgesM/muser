<?php

namespace Database\Factories;

use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'password' => 'password',
            'about' => $this->faker->text(40),
            'picture' => 'musician.jpg',
            'location_id' => Location::all()->random()->id,
            // 'availability_id' => $this->faker->numberBetween(1, 4),
            'experience_id' => $this->faker->numberBetween(1, 3),
            'instrument_id' => $this->faker->numberBetween(1, 6),
            'venue_type_id' => null,
            'venue_name' => null,
            'role_id' => 1,
            'is_active' => 1,
        ];
    }

    public function venue()
    {
        return $this->state(function (array $attributes) {
            return [
                'name' => $this->faker->name,
                'email' => $this->faker->unique()->safeEmail,
                'password' => 'password',
                'about' => $this->faker->text(40),
                'picture' => 'venue.jpg',
                'location_id' => Location::all()->random()->id,
                'availability_id' => $this->faker->numberBetween(1, 4),
                'experience_id' => null,
                'instrument_id' => null,
                'venue_type_id' => $this->faker->numberBetween(1, 4),
                'venue_name' => substr($this->faker->company(), 0, 50),
                'role_id' => 2,
                'is_active' => 1,
            ];
        });
    }
}
