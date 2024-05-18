<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Band;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use PHPUnit\Framework\Attributes\Test;

class BandControllerTest extends TestCase
{
    protected $user;
    protected $otherUser;
    protected $thirdUser;

    public function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->withPictureAndGenres('picture1.jpg', 1, [1, 2])->create();

        $this->otherUser = User::factory()->withPictureAndGenres('picture2.jpg', 1, [1, 2])->create();

        $this->thirdUser = User::factory()->withPictureAndGenres('picture3.jpg', 1, [1, 2])->create();

        $this->actingAs($this->user, 'api');
    }

    #[Test]
    public function it_can_add_a_band()
    {
        $bandName = fake()->unique()->company;
        $bandData = [
            'name' => $bandName,
            'members' => [$this->user->id, $this->otherUser->id],
        ];

        $response = $this->postJson('/api/bands', $bandData);

        $response->assertStatus(201)
            ->assertJsonStructure(['id', 'name']);

        $this->assertDatabaseHas('bands', ['name' => $bandName]);
    }

    #[Test]
    public function it_can_get_a_band_by_id()
    {
        $band = Band::factory()->create();
        $band->members()->attach([$this->user->id, $this->otherUser->id]);

        $response = $this->getJson("/api/bands/{$band->id}");

        $response->assertStatus(200)
            ->assertJsonStructure(['id', 'name', 'members' => [['id', 'name']]]);
    }

    #[Test]
    public function it_can_get_all_bands()
    {
        $band1 = Band::factory()->create();
        $band1->members()->attach([$this->user->id, $this->otherUser->id]);

        $band2 = Band::factory()->create();
        $band2->members()->attach([$this->user->id, $this->otherUser->id]);

        $response = $this->getJson("/api/bands");

        $response->assertStatus(200)
            ->assertJsonStructure([
                '*' => ['id', 'name', 'members' => [['id', 'name']]],
            ]);
    }

    #[Test]
    public function it_can_get_user_bands()
    {
        $band = Band::factory()->create();
        $band->members()->attach([$this->user->id, $this->otherUser->id]);

        $response = $this->getJson("/api/bands/me");

        $response->assertStatus(200)
            ->assertJsonStructure([
                '*' => ['id', 'name', 'members' => [['id', 'name']]],
            ]);
    }
}
