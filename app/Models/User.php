<?php

namespace App\Models;

use App\Models\Traits\GroupTrait;
use App\Notifications\Admin\Users\SendPasswordNotification;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use Notifiable;
    use GroupTrait;
    use HasRoles;

    /**
     * @var string[]
     */
    protected $guarded = ['id'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'logged_at' => 'datetime',
        'last_connection' => 'datetime',
        'is_super_admin' => 'boolean',
    ];

    protected static function booted(): void
    {
        parent::creating(function ($model) {
            $model->slug = Str::uuid();
            $model->last_connection = now();
        });
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * @return string
     */
    public function getFullNameAttribute(): string
    {
        if ($this->attributes['last_name'] || $this->attributes['first_name']) {
            return $this->attributes['last_name'] . ' ' . $this->attributes['first_name'];
        }

        return $this->attributes['email'];
    }

    public function getDesignationAttribute(): string
    {
        return $this->getFullNameAttribute();
    }

    /**
     * @param $password
     */
    public function sendPasswordNotification($password): void
    {
        $this->notify(new SendPasswordNotification($this, $password));
    }

    public function trainings(): BelongsToMany
    {
        return $this->belongsToMany(Training::class, 'user_trainings');
    }
}
