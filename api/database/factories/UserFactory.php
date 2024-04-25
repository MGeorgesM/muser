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
            'availability_id' => Availability::factory(),
            'experience_id' => Experience::factory(),
            'instrument_id' => Instrument::factory(),
            'role_id' => Role::factory(),
            'is_active' => $this->faker->boolean
        ];
    }
}
