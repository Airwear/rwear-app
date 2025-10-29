<?php

namespace App\Http\Requests\Api\Groups;

class UpdateRequest extends StoreRequest
{
    public function rules(): array
    {
        $rules = parent::rules();
        $modelId = $this->get('id');

        $rules['email'] = 'required|unique:groups,email,'.$modelId;
        $rules['phone'] = 'required|unique:groups,phone,'.$modelId;

        return $rules;
    }
}
