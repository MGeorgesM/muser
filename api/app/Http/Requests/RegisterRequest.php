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
            'role_id' => 'exists:roles,id',

        ];

        if ($this->input('role_id') == 1) {
            $rules += [
                'instrument_id' => 'required|exists:instruments,id',
                'experience_id' => 'required|exists:experiences,id',
                'genres' => 'required|array',
                'genres.*' => 'exists:genres,id',
            ];
        } elseif ($this->input('role_id') == 2) {
            $rules += [
                'venue_type_id' => 'required|exists:venue_types,id',
                'venue_name' => 'required|string|max:40',
            ];
        }

        return $rules;
    }
}
