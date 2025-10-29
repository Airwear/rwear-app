<?php

namespace App\Http\Requests\Users;

use App\Models\User;
use Spatie\Permission\Models\Permission;

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
        $table = (new User())->getTable();

        return [
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => "unique:{$table},email",
            'permissions' => "nullable|array",
        ];
    }

    /**
     * @return array
     */
    public function attributes(): array
    {
        return [
            'first_name' => quotes(trans('auth.first_name')),
            'last_name' => quotes(trans('auth.last_name')),
            'password' => quotes(trans('auth.password')),
            'new_password' => quotes(trans('auth.new_password')),
            'old_password' => quotes(trans('auth.old_password')),
            'email' => quotes(trans('auth.email')),
            'permissions' => quotes("Permissions"),
        ];
    }
}
