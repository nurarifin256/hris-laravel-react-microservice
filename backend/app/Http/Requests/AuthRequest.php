<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AuthRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name'  => 'required',
            'password' => 'required',
        ];
    }

    public function messages()
    {
        return [
            'name.required'  => 'Name is required',
            'password.required' => 'Password is required',
        ];
    }
}
