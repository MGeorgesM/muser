<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Availability;
use App\Models\Experience;
use App\Models\Instrument;
use App\Models\Role;

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
            'password' => bcrypt('useruser'),
            'about' => $this->faker->text(120),
            'picture' => $this->faker->imageUrl(),
            'location' => $this->faker->city,
            'availability_id' => $this->faker->numberBetween(1,4),
            'experience_id' => $this->faker->numberBetween(1,3),
            'instrument_id' => $this->faker->numberBetween(1,6),
            'role_id' => $this->faker->numberBetween(1,3),
            'is_active' => $this->faker->boolean
        ];
    }
}
