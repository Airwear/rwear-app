<?php

namespace App\Models;

use App\Models\Traits\SlugTrait;
use Illuminate\Database\Eloquent\Model;

class Coach extends Model
{
    use SlugTrait;

    protected $guarded = ['id'];

    protected $table = 'coaches';

    public function toAlpine(): array
    {
        return [
            'designation' => $this->designation,
            'color' => $this->color,
        ];
    }
}
