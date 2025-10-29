<?php

namespace App\Http\Controllers\Api;

class BaseApiController
{
    public function toApi(array $data, string $message = 'Done', bool $error = false): array
    {
        return compact('error', 'message', 'data');
    }

    public function fail(string $message): array
    {
        return [
            'data' => [],
            'message' => $message,
            'error' => true,
        ];
    }

    public function failException(\Throwable $e): array
    {
        return [
            'data' => [],
            //'message' => trans('messages.exception'),
            'message' => $e->getMessage(),
            'error' => true,
        ];
    }
}
