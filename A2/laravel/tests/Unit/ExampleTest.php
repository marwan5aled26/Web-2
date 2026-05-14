<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Movie;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    public function test_add_movie_fails_when_id_already_exists(): void
    {
        Movie::create([
            'id'     => 'tt9999999',
            'title'  => 'Existing Movie',
            'year'   => 2019,
            'rating' => 7.0,
            'note'   => '',
            'poster' => 'https://via.placeholder.com/300x450',
        ]);
        $response = $this->postJson('/add-movie', [
            'id'    => 'tt9999999',
            'title' => 'Duplicate Movie',
        ]);
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['id']);
    }

    public function test_add_movie_fails_when_title_is_missing(): void
    {
        $response = $this->postJson('/add-movie', [
            'id'     => 'tt2222222',
            'year'   => 2020,
            'rating' => 7.0,
        ]);
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['title']);
    }

    public function test_update_movie_fails_when_rating_out_of_range(): void
    {
        Movie::create([
            'id'     => 'tt1111111',
            'title'  => 'Rating Test Movie',
            'year'   => 2021,
            'rating' => 5.0,
            'note'   => '',
            'poster' => 'https://via.placeholder.com/300x450',
        ]);
        $response = $this->putJson('/update-movie/tt1111111', [
            'rating' => 15,
            'note'   => 'Updated note',
        ]);
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['rating']);
    }

    public function test_add_movie_fails_when_year_is_invalid(): void
    {
        $response = $this->postJson('/add-movie', [
            'id'    => 'tt3333333',
            'title' => 'Old Movie',
            'year'  => 1800,
        ]);
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['year']);
    }
}
