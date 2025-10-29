<?php

namespace App\Http\Requests\Api\Trainings;

use App\Models\Training as Model;
use Illuminate\Foundation\Http\FormRequest;

class ReportRequest extends StoreRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'user_id' => ['required', 'exists:users,id'],
            'spend_time' => ['nullable',],
        ];
    }

    protected function table(): string
    {
        return (new Model())->getTable();
    }
}
