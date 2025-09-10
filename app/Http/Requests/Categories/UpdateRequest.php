<?php

namespace App\Http\Requests\Categories;

class UpdateRequest extends StoreRequest
{
    public function rules(): array
    {
        $rules = parent::rules();
        $modelId = $this->get('id');

        //$rules['code'] = 'required|unique:categories,code,'.$modelId;

        return $rules;
    }
}
