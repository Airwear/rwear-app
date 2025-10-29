<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Log;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    protected string $baseView = 'home';

    protected string $baseRoute = 'home';

    public string $message = 'success';

    protected function fail(\Throwable $e): array
    {
        return [
            'message' => $e->getMessage(),
            'error' => true,
            'data' => [],
        ];
    }

    protected function failJson(\Throwable $e): \Illuminate\Http\JsonResponse
    {
        return response()->json($this->fail($e));
    }

    protected function success(string $action, array $data = []): array
    {
        return [
            'message' => $this->message,
            '_action' => $action,
            'error' => false,
            'data' => $data
        ];
    }

    protected function successJson(string $action, array $data = []): \Illuminate\Http\JsonResponse
    {
        return response()->json($this->success($action, $data));
    }

    protected function log(\Throwable $e, array $data = []): void
    {
        Log::info($e->getMessage(), $data);
    }
}
