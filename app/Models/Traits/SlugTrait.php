<?php

namespace App\Models\Traits;

use Illuminate\Support\Str;

trait SlugTrait
{
    protected static function booted()
    {
        parent::creating(function($model) {
            $model->slug = Str::uuid();
        });
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
