<?php

namespace App\Models;

use App\Models\Traits\SlugTrait;
use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    use SlugTrait;

    protected $guarded = ['id'];


    public function toAlpine(): array
    {
        return [
            'designation' => $this->designation,
        ];
    }
}
