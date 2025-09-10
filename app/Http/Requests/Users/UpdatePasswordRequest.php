<?php

namespace App\Http\Requests\Users;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePasswordRequest extends FormRequest
{
    use CommonTrait;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'old_password' => 'required',
            'new_password' => "required|confirmed|min:8|regex:/{$this->regex()}/",
        ];
    }

    private function regex(): string
    {
        $regex =  [
            '^',
            '(?=(?:.*[A-Z]){1,})', # 1 upper case letters
            '(?=(?:.*[a-z]){1,})', # 1 lower case letters
            '(?=(?:.*\d){1,})', # 1 digits
            '(?=(?:.*[!@#$%^&*()\-_=+{};:,<.>]){1,})', # 1 special characters
            '(.{8,})', # length 8 or more
            '$',
        ];

        return join('', $regex);
    }
}
