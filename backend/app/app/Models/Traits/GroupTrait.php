<?php

namespace App\Models\Traits;

use App\Models\Group;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait GroupTrait
{
    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class, 'group_id');
    }

    public function scopeGroup($query): void
    {
        if (! auth()->user()->is_super_admin) {
            $query
                ->whereNotNull('group_id')
                ->where('group_id', auth()->user()->group_id)
            ;
        }

    }
}
