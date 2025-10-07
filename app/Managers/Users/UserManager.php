<?php

namespace App\Managers\Users;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class UserManager
{
    public $user = null;

    /**
     * @param $request
     * @return bool
     */
    public function create($request): bool
    {
        $this->user = User::create(
            $this->getAttributeFromRequest($request) + [
                'locale' => config('app.locale')
            ]
        );

        if ($request->filled('send_email_auth_info')) {
            $this->user->sendPasswordNotification($request->post('password'));
        }

        return true;
    }

    /**
     * @param User $user
     * @param $request
     * @return User
     */
    public function update(User $user, $request): User
    {
        DB::transaction(function () use ($request, $user) {

            $user->update(
                $this->getAttributeFromRequest($request)
            );

            $user->syncPermissions(
                array_keys($request->post('permissions') ?? [])
            );
        });

        if ($request->post('password') && $request->filled('send_email_auth_info')) {
            $user->sendPasswordNotification($request->post('password'));
        }

        return $user;
    }

    /**
     * @param $request
     * @return int
     */
    public function updateMe($request): int
    {
        return $request->user()->update(
            $this->getAttributeFromRequest($request)
        );
    }

    /**
     * @param User $user
     * @param $request
     * @return User
     */
    public function setLocale(User $user, $request): User
    {
        $user->update([
            'language_id' => $request->post('language_id'),
        ]);

        return $user;
    }

    /**
     * @param User $user
     * @param $request
     * @return User
     */
    public function changePassword(User $user, $request): User
    {
        $user->update([
            'password' => bcrypt($request->post('new_password') ?? $request->post('password')),
        ]);

        return $user;
    }

    /**
     * @param $request
     * @return array
     */
    private function getAttributeFromRequest($request): array
    {
        $data = [
            'first_name' => $request->post('first_name'),
            'last_name' => $request->post('last_name'),
            'email' => $request->post('email'),
            'phone' => $request->post('phone'),
            'group_id' => $request->post('group_id'),
        ];

        if ($request->post('password')) {
            $data['password'] = bcrypt($request->post('password'));
        }

        if ($request->user()->cannot('manage users')) {

        }

        return $data;
    }
}
