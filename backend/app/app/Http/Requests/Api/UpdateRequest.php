<?php

namespace App\Http\Requests\Api;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateRequest extends FormRequest
{
    protected $stopOnFirstFailure = true;

    /**
     * @return array[]
     */
    public function rules(): array
    {
        $user = $this->route()->user;

        return [
            'last_name' => ['nullable',],
            'first_name' => ['nullable',],
            'email' => ['required', 'email', 'unique:users,email,'.$user->id, ],
            'phone' => ['required', 'string', 'unique:users,phone,'.$user->id, ],
        ];
    }

    /**
     * @param Validator $validator
     * @return mixed
     */
    protected function failedValidation(Validator $validator): mixed
    {
        throw new HttpResponseException(response()->json([
            'error' => true,
            'message' => $validator->errors()->first(),
        ]));
    }
}
