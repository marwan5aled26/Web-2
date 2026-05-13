<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Unique;
use Illuminate\Validation\Rules\Regex;
use Illuminate\Validation\Rules\Required;
use Illuminate\Validation\Rules\StringType;

class StoreMovieRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'id'     => ['required', 'string', 'max:20', 'regex:/^(tt)?[0-9]+$/', 'unique:movie_laravel,id'],
            'title'  => ['required', 'string', 'max:255'],
            'year'   => ['nullable', 'integer', 'min:1900', 'max:2027'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:10'],
            'note'   => ['nullable', 'string', 'max:500'],
            'poster' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'id.regex'  => 'ID must contain only numbers or start with "tt".',
            'id.unique' => 'Movie ID already exists in watchlist!',
            'year.min'  => 'Year must be between 1900 and 2027.',
            'year.max'  => 'Year must be between 1900 and 2027.',
        ];
    }
}