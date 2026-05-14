<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MoviesSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('movies_laravel')->insert([
            [
                'id' => 'tt0068646',
                'title' => 'The Godfather',
                'year' => '1972',
                'rating' => 9.4,
                'note' => '2nd GOAT',
                'poster' => 'https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_QL75_UY562_CR8,0,380,562_.jpg',
                'created_at' => '2026-04-26 13:58:11',
                'updated_at' => null,
            ],
            [
                'id' => 'tt0071562',
                'title' => 'The Godfather Part II',
                'year' => '1974',
                'rating' => 9.8,
                'note' => 'GOAT',
                'poster' => 'https://m.media-amazon.com/images/M/MV5BMDIxMzBlZDktZjMxNy00ZGI4LTgxNDEtYWRlNzRjMjJmOGQ1XkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg',
                'created_at' => '2026-04-26 21:20:43',
                'updated_at' => null,
            ],
            [
                'id' => 'tt0109830',
                'title' => 'Forrest Gump',
                'year' => '1994',
                'rating' => 8.8,
                'note' => 'Best Movie for Tom Hanks',
                'poster' => 'https://m.media-amazon.com/images/M/MV5BNDYwNzVjMTItZmU5YS00YjQ5LTljYjgtMjY2NDVmYWMyNWFmXkEyXkFqcGc@._V1_QL75_UY562_CR4,0,380,562_.jpg',
                'created_at' => '2026-05-13 06:34:39',
                'updated_at' => null,
            ],
            [
                'id' => 'tt0111161',
                'title' => 'The Shawshank Redemption',
                'year' => '1994',
                'rating' => 8.4,
                'note' => 'A Great Plot Twist',
                'poster' => 'https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg',
                'created_at' => '2026-04-26 15:04:05',
                'updated_at' => null,
            ],
            [
                'id' => 'tt16311594',
                'title' => 'F1: The Movie',
                'year' => '2025',
                'rating' => 7.7,
                'note' => 'Great Movie',
                'poster' => 'https://m.media-amazon.com/images/M/MV5BNGI0MDI4NjEtOWU3ZS00ODQyLWFhYTgtNGYxM2ZkM2Q2YjE3XkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg',
                'created_at' => '2026-04-24 15:56:58',
                'updated_at' => null,
            ],
        ]);
    }
}