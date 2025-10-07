<?php

namespace App\Http\Requests\Api\Categories;

use App\Repositories\CategoryRepository;

class UpdateRequest extends StoreRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        $table = $this->table();
        $rules = parent::rules();
        $modelId = (new CategoryRepository())->findBySlug(slug: $this->route('slug'))?->getKey();

        $rules['code'] = ['required', 'unique:'.$table.',code,'.$modelId];

        return $rules;
    }
}
