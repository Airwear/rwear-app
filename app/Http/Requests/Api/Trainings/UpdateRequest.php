<?php

namespace App\Http\Requests\Api\Trainings;

use App\Models\Training as Model;
use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
{
    protected $stopOnFirstFailure = true;

    /**
     * Determine if the user is authorized to make this request.
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
    public function rules(): array
    {


        return [
            'designation' => ['required'],
            'url' => ['nullable'],
            'cover' => ['nullable',],
            'description' => ['nullable'],
            'duration_in_text' => ['nullable'],
            'duration_in_minute' => ['nullable'],
            'coach_id' => ['nullable', 'exists:coaches,id'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'level_id' => ['nullable', 'exists:training_levels,id'],
            'material_id' => ['nullable',],
            'file' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
            'register_date' => 'nullable|date',
            'publish_date' => 'nullable|date',
        ];
    }


    protected function prepareForValidation(): void
    {
        //$this->merge(['cover' => base64_encode($this->get('cover'))]);
    }

    public function messages(): array
    {
        return [
            'designation.required' => "Le champ (designation) est requis",
        ];
    }
}
