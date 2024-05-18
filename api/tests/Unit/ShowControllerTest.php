<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Show;
use PHPUnit\Framework\Attributes\Test;

class ShowControllerTest extends TestCase
{
    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->withPictureAndGenres('picture1.jpg', 1, [1, 2])->create();

        $this->actingAs($this->user, 'api');
    }

    #[Test]
    public function it_can_get_a_single_show_by_id()
    {
        $show = Show::first();

        $response = $this->getJson("/api/shows/{$show->id}");

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'id', 'venue' => ['id', 'name', 'venue_name'],
                     'genre' => ['id', 'name'],
                     'band' => ['members' => [
                         '*' => ['id', 'name', 'picture', 'instrument' => ['id', 'name']]
                     ]]
                 ]);
    }

    #[Test]
    public function it_returns_404_if_show_not_found()
    {
        $response = $this->getJson('/api/shows/999');

        $response->assertStatus(404)
                 ->assertJson(['message' => 'Show not found']);
    }

    #[Test]
    public function it_can_get_all_shows()
    {
        $response = $this->getJson('/api/shows');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     '*' => [
                         'id', 'venue' => ['id', 'name', 'venue_name', 'location' => ['id', 'name']],
                         'genre' => ['id', 'name'],
                         'band' => ['members' => [
                             '*' => ['id', 'name', 'picture', 'instrument' => ['id', 'name']]
                         ]]
                     ]
                 ]);
    }

    #[Test]
    public function it_can_filter_shows_by_venue_id()
    {
        $venueId = 1;

        $response = $this->getJson("/api/shows?venue_id={$venueId}");

        $response->assertStatus(200)
                 ->assertJsonFragment(['venue_id' => $venueId]);
    }

    #[Test]
    public function it_can_filter_shows_by_status()
    {
        $status = 'set';

        $response = $this->getJson("/api/shows?status={$status}");

        $response->assertStatus(200)
                 ->assertJsonFragment(['status' => $status]);
    }
}
