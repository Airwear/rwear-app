<?php

namespace App\Http\Requests\Users;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class UpdateMeRequest extends FormRequest
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

        if ($user = auth()->user()) {
            $rules['email'] = "unique:{$table},email,{$user->id}";
        }

        return $rules;
    }
}
