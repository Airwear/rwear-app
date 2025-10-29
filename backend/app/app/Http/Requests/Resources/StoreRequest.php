<?php

namespace App\Http\Requests\Resources;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

class StoreRequest extends FormRequest
{
    protected bool $stopOnFirstFailure = true;

    protected ?FormRequest $formRequestFactory = null;


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
        if (is_object($this->formRequestFactory)) {
            return $this->formRequestFactory->rules();
        }

        return $this->defaultRules();
    }

    protected function defaultRules(): array
    {
        return [
            'name' => 'required',
            'value' => 'nullable',
            'active' => 'nullable',
            'color' => 'nullable',
            'order' => 'nullable',
            'description' => 'nullable',
        ];
    }

    protected function requestFactory(): ?FormRequest
    {
        $modelName = ucfirst(
            kebab_to_camel_case($this->route('modelName'))
        );

        $namespace = "\\App\\Http\\Requests\\{$modelName}";


        if ($this->route('slug')) {
            $class = $namespace."\\UpdateRequest";
        } else {
            $class = $namespace."\\StoreRequest";
        }

        // Log::info(__METHOD__, [$class]);

        return class_exists($class) ? new $class : null;
    }

    public function messages(): array
    {
        if (is_object($this->formRequestFactory)) {
            return $this->formRequestFactory->messages();
        }

        return [
            // 'name.required' => trans('resources.name_is_required'),
        ];
    }

    public function attributes(): array
    {
        if (is_object($this->formRequestFactory)) {
            return $this->formRequestFactory->attributes();
        }

        return [
            'name' => quotes(trans('resources.label_name')),
            'active' => quotes(trans('resources.label_active')),
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->formRequestFactory = $this->requestFactory();

        if (is_object($this->formRequestFactory)) {
            $this->formRequestFactory->prepareForValidation();
        } else {

            $this->merge([
                'active' => ! empty($this->get('active'))
            ]);
        }

    }
}
