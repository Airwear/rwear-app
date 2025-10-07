<?php

namespace App\Http\Requests\Api\Groups;

use App\Http\Requests\Api\DefaultTrait;
use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    use DefaultTrait;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return string[]
     */
    public function rules(): array
    {
        return [
            'designation' => 'required',
            'email' => 'required|unique:groups,email',
            'phone' => 'required|unique:groups,phone',
            'id' => 'nullable',
            'address' => 'nullable',
            'zip_code' => 'nullable',
            'city' => 'nullable',
            'fax' => 'nullable',
            'web_site_url' => 'nullable',
            'facebook_url' => 'nullable',
            'twitter_url' => 'nullable',
        ];
    }

}
