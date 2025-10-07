<?php

namespace App\Http\Requests\Users\Roles;

use Illuminate\Validation\Rule;

trait CommonTrait
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function commonRules(): array
    {
        return [
            'name' => [
                'required',
                Rule::unique('roles')
                    ->where('name', $this->request->get('name'))
                    ->where('guard_name', $this->request->get('guard_name')),
            ],
            'guard_name' => 'guard_name',
            'display_name' => 'required',
        ];
    }

    /**
     * @return array
     */
    public function attributes(): array
    {
        return [
            'name' => quotes(trans('roles.name')),
            'guard_name' => quotes(trans('roles.guard_name')),
            'display_name' => quotes(trans('roles.display_name')),
        ];
    }
}
