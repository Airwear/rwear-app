<?php

namespace App\DataTransformers;

use App\Contracts\TransformerContract;
use App\Models\Group;
use Illuminate\Database\Eloquent\Collection;

class GroupTransformer implements TransformerContract
{

    public function transform(Group $group): array
    {
        return [
            'id' => $group->getKey(),
            'slug' => $group->slug,
            'designation' => $group->designation,
            'email' => $group->email,
            'phone' => $group->phone,
        ];
    }

    public function toCollection(Collection $collection): array
    {
        return $collection->map(fn(Group $group) => $this->transform($group))->toArray();
    }

}
