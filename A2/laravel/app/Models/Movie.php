<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Movie extends Model
{
    use HasFactory;

    protected $table = 'movies';
    protected $primaryKey = 'id';
    public $incrementing = false;    // عشان الـ id مش auto-increment
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'title', 'year', 'rating', 'note', 'poster'
    ];
}