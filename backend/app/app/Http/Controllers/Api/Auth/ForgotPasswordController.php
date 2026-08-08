<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Requests\Api\ForgotPasswordRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Password;

class ForgotPasswordController extends BaseController
{
    public function sendResetLink(ForgotPasswordRequest $request): JsonResponse
    {
        try {
            $status = Password::sendResetLink($request->only('email'));

            if ($status === Password::RESET_THROTTLED) {
                return response()->json([
                    'error' => true,
                    'message' => 'Veuillez patienter avant de réessayer.',
                ], 429);
            }

            $this->message = 'Nous vous avons envoyé par email le lien de réinitialisation du mot de passe !';

            // Anti-énumération: on renvoie toujours succès pour un email syntaxiquement valide.
            return response()->json($this->success(action: 'forgot-password', data: []));
        } catch (\Throwable $e) {
            return response()->json($this->fail($e), 500);
        }
    }
}
