<?php

namespace App\Http\Requests\Api\Materials;

use App\Repositories\MaterialRepository;

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
        $modelId = (new MaterialRepository())->findBySlug(slug: $this->route('slug'))?->getKey();

        $rules['designation'] = ['required', 'unique:'.$table.',designation,'.$modelId];

        return $rules;
    }
}
