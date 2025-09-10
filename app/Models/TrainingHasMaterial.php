<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainingHasMaterial extends Model
{
    protected $guarded = ['id'];
    protected $table = 'training_has_materials';
}
