<?php

namespace App\Http\Controllers\Api\Auth;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class VerifyEmailController extends BaseController
{
    /**
     * Retourne le profil de l'utilisateur authentifié, incluant le statut de vérification email.
     */
    public function me(): JsonResponse
    {
        try {
            $user = Auth::guard('api')->user();

            if (! $user) {
                return response()->json(['error' => true, 'message' => 'Non authentifié'], 401);
            }

            return response()->json(
                $this->success(action: 'me', data: $this->userDataTransfer->transform($user))
            );
        } catch (\Throwable $e) {
            return response()->json($this->fail($e));
        }
    }

    /**
     * Renvoie l'email de vérification à l'utilisateur authentifié.
     */
    public function resend(): JsonResponse
    {
        try {
            $user = Auth::guard('api')->user();

            if (! $user) {
                return response()->json(['error' => true, 'message' => 'Non authentifié'], 401);
            }

            if ($user->hasVerifiedEmail()) {
                return response()->json([
                    'error' => false,
                    'message' => 'Email déjà vérifié.',
                    'data' => [],
                ]);
            }

            $user->sendEmailVerificationNotification();

            return response()->json([
                'error' => false,
                'message' => 'Email de vérification envoyé.',
                'data' => [],
            ]);
        } catch (\Throwable $e) {
            return response()->json($this->fail($e));
        }
    }
}
