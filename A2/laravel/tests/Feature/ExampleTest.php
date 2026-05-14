<?php
 
namespace Tests\Feature;
 
use Tests\TestCase;
use App\Models\Movie;
use Illuminate\Foundation\Testing\RefreshDatabase;
 
class MovieTest extends TestCase
{
    use RefreshDatabase;
 
    // FEATURE TEST 1

    public function test_can_add_movie_and_stored_in_database(): void
    {
        $response = $this->postJson('/add-movie', [
            'id'     => 'tt1234567',
            'title'  => 'Test Movie',
            'year'   => 2020,
            'rating' => 8.5,
            'note'   => 'Great movie',
            'poster' => 'https://via.placeholder.com/300x450?text=Test',
        ]);
 
        $response->assertStatus(200)
                 ->assertJson(['status' => 'success']);
 
        $this->assertDatabaseHas('movies_laravel', [
            'id'    => 'tt1234567',
            'title' => 'Test Movie',
        ]);
    }

    // FEATURE TEST 2
    public function test_can_get_all_movies(): void
    {
        Movie::create([
            'id'     => 'tt1000001',
            'title'  => 'Movie One',
            'year'   => 2018,
            'rating' => 7.0,
            'note'   => '',
            'poster' => 'https://via.placeholder.com/300x450',
        ]);
 
        Movie::create([
            'id'     => 'tt1000002',
            'title'  => 'Movie Two',
            'year'   => 2019,
            'rating' => 6.5,
            'note'   => '',
            'poster' => 'https://via.placeholder.com/300x450',
        ]);
 
        $response = $this->getJson('/get-movies');
 
        $response->assertStatus(200)
                 ->assertJson(['status' => 'success'])
                 ->assertJsonCount(2, 'data');
    }
 
    // FEATURE TEST 3

    public function test_can_delete_movie(): void
    {
        Movie::create([
            'id'     => 'tt5555555',
            'title'  => 'Movie To Delete',
            'year'   => 2020,
            'rating' => 5.0,
            'note'   => '',
            'poster' => 'https://via.placeholder.com/300x450',
        ]);
 
        $response = $this->deleteJson('/delete-movie/tt5555555');
 
        $response->assertStatus(200)
                 ->assertJson(['status' => 'success']);
 
        $this->assertDatabaseMissing('movies_laravel', [
            'id' => 'tt5555555',
        ]);
    }
 
    // FEATURE TEST 4
    
    public function test_can_update_movie_rating_and_note(): void
    {
        Movie::create([
            'id'     => 'tt7777777',
            'title'  => 'Movie To Update',
            'year'   => 2021,
            'rating' => 5.0,
            'note'   => 'Old note',
            'poster' => 'https://via.placeholder.com/300x450',
        ]);
 
        $response = $this->putJson('/update-movie/tt7777777', [
            'rating' => 9.0,
            'note'   => 'New note after update',
        ]);
 
        $response->assertStatus(200)
                 ->assertJson(['status' => 'success']);
 
        $this->assertDatabaseHas('movies_laravel', [
            'id'     => 'tt7777777',
            'rating' => 9.0,
            'note'   => 'New note after update',
        ]);
    }
