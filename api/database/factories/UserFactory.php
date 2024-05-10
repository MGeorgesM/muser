<?php

namespace Database\Factories;

use App\Models\User;
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
            'name' => $this->faker->unique()->firstName,
            'email' => $this->faker->unique()->safeEmail,
            'password' => 'password',
            'about' => $this->faker->text(20),
            'picture' => null,
            'location_id' => Location::all()->random()->id,
            'availability_id' => $this->faker->numberBetween(1, 4),
            'experience_id' => $this->faker->numberBetween(1, 3),
            'instrument_id' => null,
            'venue_type_id' => null,
            'venue_name' => null,
            'role_id' => 1,
            'is_active' => 1,
        ];
    }

    public function withGender($gender)
    {
        return $this->state(function (array $attributes) use ($gender) {
            return [
                'name' => $gender === 'male' ? $this->faker->unique()->firstNameMale() : $this->faker->unique()->firstNameFemale(),
            ];
        });
    }

    public function withPictureAndGenres(string $picture, int $instrumentId, array $genreIds)
    {
        return $this->state(function (array $attributes) use ($picture, $instrumentId, $genreIds) {
            return [
                'picture' => $picture,
                'instrument_id' => $instrumentId,
            ];
        })->afterCreating(function (User $user) use ($genreIds) {
            $user->genres()->attach($genreIds);
        });
    }

    public function venue()
    {

        $venueNames = [
            "Mystic Grove",
            "The Velvet",
            "Lantern Light",
            "Echoes Jazz",
            "Starlight",
            "Amber Moon",
            "Sapphire Seafront",
            "Golden Oak",
            "Twilight Vista",
            "Azure Plateau"
        ];

        return $this->state(function (array $attributes)  use ($venueNames) {
            return [
                'name' => $this->faker->unique()->randomElement($venueNames),
                'email' => $this->faker->unique()->safeEmail,
                'password' => 'password',
                'about' => $this->faker->text(20),
                'picture' => $this->faker->unique()->randomElement(array_map(function ($i) {
                    return "venue ({$i}).jpg";
                }, range(1, 4))),
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
