<?php

namespace App\Models;

use App\Models\Traits\GroupTrait;
use App\Models\Traits\SlugTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Tags\HasTags;

class Article extends Model implements HasMedia
{
    use GroupTrait;
    use SlugTrait;
    use InteractsWithMedia;
    use HasTags;

    protected $guarded = ['id'];

    protected $casts = [
        'flashed_until_date' => 'date',
        'flashed_until_time' => 'date',
    ];

    public function registerMediaCollections(): void
    {
        $this
            ->addMediaCollection($this->getTable())
            ->useDisk($this->getTable())
            ->useFallbackUrl('/images/articles.jpg')
            ->useFallbackPath(public_path('/images/articles.jpg'))
            ->singleFile()
        ;
    }

    public function additionnals(): BelongsToMany
    {
        return $this->belongsToMany(Article::class, 'additional_articles', 'item_id');
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class, 'unit_id');
    }

    public function image()
    {
        return $this->getFirstMedia($this->getTable());
    }

    public function getImageAttribute()
    {
        return $this->image();
    }
}
