<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6',
            'about' => 'required|string|max:120',
            'picture' => 'required|image|mimes:jpeg,png,jpg|max:4096',
            'location_id' => 'required|int|exists:locations,id',
            // 'availability_id' => 'sometimes|exists:availabilities,id',
            'experience_id' => 'sometimes|exists:experiences,id',
            'instrument_id' => 'sometimes|exists:instruments,id',
            'venue_type_id' => 'sometimes|exists:venue_types,id',
            'venue_name' => 'sometimes|string|max:40',
            'role_id' => 'exists:roles,id',
            'genres' => 'required|array',
            'genres.*' => 'exists:genres,id',
        ];

        if ($this->input('role_id') == 1) {
            $rules['instrument_id'] = 'required|exists:instruments,id';
            $rules['experience_id'] = 'required|exists:experiences,id';
        } elseif ($this->input('role_id') == 2) {
            $rules['venue_type_id'] = 'required|exists:venue_types,id';
            $rules['venue_name'] = 'required|string|max:40';
        }

        return $rules;
    }
}
