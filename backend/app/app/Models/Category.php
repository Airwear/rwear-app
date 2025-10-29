<?php

namespace App\Models;

use App\Models\Traits\SlugTrait;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use SlugTrait;

    protected $guarded = ['id'];

    protected $table = 'categories';

    public function toAlpine(): array
    {
        return [
            'designation' => $this->designation,
            'code' => $this->code,
            'active' => ! empty($this->active),
            'order' => $this->order,
            'color' => $this->color,
        ];
    }

    public function getFileNameAttribute(): string
    {
        return $this->code.'.png';
    }

    public function toApi(): array
    {
        $data = $this->toArray();
        $data['image'] = $this->getCoverAttribute();

        unset($data['created_at'], $data['updated'], $data['active']);

        return $data;
    }

    public function trainings()
    {
        return $this->hasMany(Training::class, 'category_id');
    }

    public function getCoverAttribute(): ?string
    {
        $fileName = 'images/categories/'.$this->code;

        if (! file_exists(public_path($fileName))) {
            return null;
        }

        return asset('images/categories/'.$this->code);
    }
}
