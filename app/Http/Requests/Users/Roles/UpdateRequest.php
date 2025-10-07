<?php

namespace App\Http\Requests\Users\Roles;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRequest extends FormRequest
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
                    ->ignore(optional($this->route('role'))->id)
                    ->where('name', $this->request->get('name'))
                    ->where('guard_name', $this->request->get('guard_name')),
            ],
            'guard_name' => 'required',
            'display_name' => 'required',
        ];
    }
}
