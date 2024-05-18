<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use PHPUnit\Framework\Attributes\Test;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class AuthControllerTest extends TestCase
{
    // use RefreshDatabase;

    protected function authenticate($user)
    {
        $token = JWTAuth::fromUser($user);
        return $token;
    }

    #[Test]
    public function it_can_login()
    {
        $user = User::factory()->withPictureAndGenres('picture1.jpg', 1, [1, 2])->create();

        $response = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'token',
                'stream_token',
                'user' => ['id', 'name', 'email'],
            ]);
    }

    #[Test]
    public function it_can_register()
    {
        Storage::fake('public');
        $faker = \Faker\Factory::create();
        $randomEmail = $faker->unique()->safeEmail;

        $userData = [
            'name' => 'Test User',
            'email' => $randomEmail,
            'password' => 'password',
            'about' => 'This is a test user.',
            'picture' => UploadedFile::fake()->image('avatar.jpg'),
            'location_id' => 1,
            'role_id' => 1,
            'instrument_id' => 1,
            'experience_id' => 1,
            'genres' => [1, 2],
        ];

        $response = $this->postJson('/api/auth/register', $userData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'token',
                'stream_token',
                'user' => ['id', 'name', 'email'],
            ]);

        $this->assertDatabaseHas('users', ['email' => $randomEmail]);
    }

    #[Test]
    public function it_can_get_current_user_details()
    {
        $user = User::factory()->withPictureAndGenres('picture1.jpg', 1, [1, 2])->create();

        $token = $this->authenticate($user);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/auth/me');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'id', 'name', 'email', 'about', 'picture', 'location', 'genres', 'instrument', 'role'
            ]);
    }

    #[Test]
    public function it_can_logout()
    {
        $user = User::factory()->withPictureAndGenres('picture1.jpg', 1, [1, 2])->create();

        $token = $this->authenticate($user);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/auth/logout');

        $response->assertStatus(200)
            ->assertJson(['message' => 'Successfully logged out']);
    }
}
