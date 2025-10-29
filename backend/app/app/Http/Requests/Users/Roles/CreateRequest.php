<?php

namespace App\Http\Requests\Users\Roles;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateRequest extends FormRequest
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
            'name' => [
                'required',
                Rule::unique('roles')
                    ->where('name', $this->request->get('name'))
                    ->where('guard_name', $this->request->get('guard_name')),
            ],
            'guard_name' => 'required',
            'display_name' => 'required',
        ];
    }
}
