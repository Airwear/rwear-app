<?php

namespace App\Http\Requests\Api\Categories;

use App\Http\Requests\Api\FailedValidationTrait;
use Illuminate\Foundation\Http\FormRequest;
use App\Models\Category as Model;
// use Illuminate\Support\Str;

class StoreRequest extends FormRequest
{
    use FailedValidationTrait;

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
        $table = $this->table();

        return [
            'designation' => ['required',],
            'code' => ['required', 'unique:'.$table.',code'],
            'active' => ['nullable',],
            'order' => ['nullable',],
            'color' => ['nullable',],
        ];
    }

    protected function table(): string
    {
        return (new Model())->getTable();
    }

    protected function prepareForValidation()
    {
        //$this->merge(['code' => Str::upper($this->get('code'))]);
    }

    public function messages(): array
    {
        return [
            'designation.required' => "Le champ (designation) est requis",
        ];
    }
}
