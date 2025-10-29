<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserTraining extends Model
{

    protected $guarded = ['id'];

    protected static function booted(): void
    {
        parent::creating(function ($model) {
            $model->view_count = 1;
        });

        parent::updating(function (UserTraining $model) {
            $model->view_count = $model->view_count + 1;
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function training(): BelongsTo
    {
        return $this->belongsTo(Training::class, 'training_id');
    }

    public function getTimerInSecondsAttribute(): ?float
    {
        $spendTime = $this->attributes['spend_time'];

        if (! $spendTime) {
            return null;
        }

        return round($this->attributes['spend_time'] / 1000, 3);
    }

    public function getTimerInMinutesAttribute(): ?float
    {
        $spendTimeInSecond = $this->getTimerInSecondsAttribute();

        if (! $spendTimeInSecond) {
            return null;
        }

        return round($spendTimeInSecond / 60, 2);
    }
}
