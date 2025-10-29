<?php

namespace App\DataTransformers;

use App\Contracts\TransformerContract;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class UserTransformer implements TransformerContract
{
    /**
     * @var bool
     */
    public bool $withToken = true;

    public function transform(User $user): array
    {
        $data = [
            'id' => $user->getKey(),
            'phone' => $user->phone,
            'slug' => $user->slug,
            'username' => $user->username,
            'last_name' => $user->last_name,
            'first_name' => $user->first_name,
            'email' => $user->email,
            'group_id' => $user->group_id,
            'group_name' => $user->group?->designation,
            'group_phone' => $user->group?->phone,
            'group_email' => $user->group?->email,
        ];


        return $data;
    }

    public function toCollection(Collection $collection): array
    {
        $this->withToken = false;

        return $collection->map(fn(User $user) => $this->transform($user))->toArray();
    }

}
