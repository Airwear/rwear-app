<?php

namespace App\Http\Requests\Users;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

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
        $table = (new User())->getTable();
        $rules = $this->commonRules();

        if ($user = $this->route()->parameter('user')) {
            $rules['email'] = "unique:{$table},email,{$user->id}";
        }

        return $rules;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'permissions' => $this->get('permissions', [])
        ]);
    }
}
