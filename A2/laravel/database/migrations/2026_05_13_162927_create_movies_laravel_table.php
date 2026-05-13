<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('movies_laravel', function (Blueprint $table) {
            $table->string('id', 20)->primary(); // ttxxxxx or custom id
            $table->string('title', 255);
            $table->string('year', 10)->nullable();
            $table->float('rating')->nullable();
            $table->text('note')->nullable();
            $table->string('poster')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movies_laravel');
    }
};
