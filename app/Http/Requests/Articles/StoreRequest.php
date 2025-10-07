<?php

namespace App\Http\Requests\Articles;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return string[]
     */
    public function rules(): array
    {
        return [
            'id' => 'nullable',
            'designation' => 'required',
            'group_id' => 'required',
            'price' => 'nullable|numeric',
            'promotion_price' => 'nullable|numeric',
            'description' => 'nullable',
            'quantity' => 'nullable',
            'country_id' => 'nullable',
            'category_id' => 'nullable',
            'unit_id' => 'nullable',
            'is_fresh' => 'nullable',
            'active' => 'nullable',
            'is_available' => 'nullable',
            'flashed_until_at' => 'nullable|date',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge(input: [
            'is_fresh' => ! empty($this->post('is_fresh')),
            'is_available' => ! empty($this->post('is_available')),
            'active' => ! empty($this->post('active')),
            'group_id' => auth()->user()->group_id,
        ]);
    }

}
