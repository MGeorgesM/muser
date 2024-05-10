<?php

namespace Database\Factories;

use App\Models\Instrument;
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
            'location_id' => Location::all()->random()->id,
            'availability_id' => $this->faker->numberBetween(1, 4),
            'experience_id' => $this->faker->numberBetween(1, 3),
            'instrument_id' => null, // Set in state method for style
            'venue_type_id' => null,
            'venue_name' => null,
            'role_id' => 1,
            'is_active' => 1,
        ];
    }

    public function style(string $style)
    {
        return $this->state(function (array $attributes) use ($style) {
            $availableInstrumentIds = Instrument::pluck('id')->toArray();
            $instrumentId = $this->faker->unique()->randomElement($availableInstrumentIds);
            return [
                'instrument_id' => $instrumentId,
                'picture' => "musician ({$instrumentId}) {$style}.jpg",
            ];
        });
    }

    public function venue()
    {

        $venueNames = [
            "Mystic Grove Café",
            "The Velvet Room",
            "Lantern Light Tavern",
            "Echoes Jazz Lounge",
            "Starlight Rooftop Bar",
            "Amber Moon Winery",
            "Sapphire Seafront Bistro",
            "Golden Oak Library",
            "Twilight Vista Club",
            "Azure Plateau Grill"
        ];

        return $this->state(function (array $attributes)  use ($venueNames) {
            return [
                'name' => $this->faker->unique()->randomElement($venueNames),
                'email' => $this->faker->unique()->safeEmail,
                'password' => 'password',
                'about' => $this->faker->text(20),
                'picture' => $this->faker->randomElement(array_map(function ($i) {
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
