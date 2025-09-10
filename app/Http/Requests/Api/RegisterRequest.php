<?php

namespace App\Http\Requests\Api;

use App\Models\Group;
use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{

    use DefaultTrait;

    protected $stopOnFirstFailure = true;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array
     */
    public function rules(): array
    {
        return [
            'username' => ['required',],
            'password' => 'required',
            'group_id' => 'required',
            'email' => ['required', 'email', 'unique:users,email', ],
            //'phone' => ['required', 'email', 'unique:users,phone', ],
            'last_name' => 'nullable',
            'first_name' => 'nullable',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge(['group_id' => 1]);
    }

}
