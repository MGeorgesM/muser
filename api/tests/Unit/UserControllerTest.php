<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Connection;
use PHPUnit\Framework\Attributes\Test;

class UserControllerTest extends TestCase
{
    protected $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::where('email', 'lloyd@mail.com')->first();
        if (!$this->user) {
            $this->markTestSkipped('User not found in the database.');
        }

        $this->actingAs($this->user, 'api');
    }

    #[Test]
    public function it_can_get_feed_users_by_role()
    {
        $response = $this->getJson('/api/users/type/musician');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'connectedUsers',
                'feedUsers'
            ]);

        $json = $response->json();

        if (!empty($json['connectedUsers'])) {
            $this->assertArrayHasKey('id', $json['connectedUsers'][0]);
            $this->assertArrayHasKey('name', $json['connectedUsers'][0]);
            $this->assertArrayHasKey('email', $json['connectedUsers'][0]);
        }

        if (!empty($json['feedUsers'])) {
            $this->assertArrayHasKey('id', $json['feedUsers'][0]);
            $this->assertArrayHasKey('name', $json['feedUsers'][0]);
            $this->assertArrayHasKey('email', $json['feedUsers'][0]);
        }
    }

    #[Test]
    public function it_does_not_include_users_with_different_roles()
    {
        $response = $this->getJson('/api/users/type/musician');

        $response->assertStatus(200)
            ->assertJsonMissing(['role' => ['name' => 'venue']]);
    }

    #[Test]
    public function it_can_get_connections()
    {
        $connectionUser = User::factory()->withPictureAndGenres('https://via.placeholder.com/150', 1, [1, 2])->create();
        Connection::factory()->create([
            'user_one_id' => $this->user->id,
            'user_two_id' => $connectionUser->id,
        ]);

        $response = $this->getJson('/api/connections');

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $connectionUser->id])
            ->assertJsonStructure([['id', 'name', 'picture']]);
    }

    #[Test]
    public function it_can_add_connections()
    {
        $newConnectionUser = User::factory()->withPictureAndGenres('https://via.placeholder.com/150', 1, [1, 2])->create();

        $response = $this->postJson('/api/connections', ['userIds' => [$newConnectionUser->id]]);

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $newConnectionUser->id])
            ->assertJsonStructure([
                'message',
                'connections' => [['id', 'name', 'email']],
                'failed',
            ]);
    }

    #[Test]
    public function it_handles_empty_user_ids_on_add_connections()
    {
        $response = $this->postJson('/api/connections', ['userIds' => []]);

        $response->assertStatus(400)
            ->assertJson(['message' => 'No user IDs provided']);
    }

    #[Test]
    public function it_ignores_adding_self_as_connection()
    {
        $response = $this->postJson('/api/connections', ['userIds' => [$this->user->id]]);

        $response->assertStatus(200)
            ->assertJsonFragment(['message' => 'Connections processed'])
            ->assertJson(['failed' => [$this->user->id]]);
    }
}
