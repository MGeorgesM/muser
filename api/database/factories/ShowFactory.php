<?php

namespace Database\Factories;

use App\Models\Genre;
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
        static $availabeGenresIds = null;

        if (is_null($availabeGenresIds)) {
            $availabeGenresIds = Genre::pluck('id')->toArray();
        }

        try {
            $genreId = $this->faker->unique()->randomElement($availabeGenresIds);
        } catch (\OverflowException $e) {
            $this->faker->unique(true);
            $genreId = $this->faker->unique()->randomElement($availabeGenresIds);
        }

        return [
            'time' => $this->faker->time('H:i'),
            'duration' => $this->faker->numberBetween(1, 4),
            'band_id' => $this->faker->numberBetween(1, 10),
            'venue_id' => $this->faker->numberBetween(1, 4),
            'genre_id' => $genreId,
            'date' => $this->faker->dateTimeBetween('+1 week', '+1 month')->format('Y-m-d'),
            'picture' => 'show (' . $genreId . ').jpg',
        ];
    }
}
