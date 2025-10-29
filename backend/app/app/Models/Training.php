<?php

namespace App\Models;

use App\Models\Traits\SlugTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Training extends Model implements HasMedia
{
    use SlugTrait;
    use InteractsWithMedia;

    protected $guarded = ['id'];

    protected $casts = [
        'register_date' => 'date',
        'publish_date' => 'date',
    ];

    protected static function booted()
    {
        parent::creating(function($model) {
            $model->slug = Str::uuid();
        });
    }

    public function toAlpine(): array
    {
        return [
            'designation' => $this->designation,
        ];
    }

    public function coach(): BelongsTo
    {
        return $this->belongsTo(Coach::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function level(): BelongsTo
    {
        return $this->belongsTo(TrainingLevel::class, 'level_id');
    }

    public function materials(): BelongsToMany
    {
        return $this->belongsToMany(Material::class, 'training_has_materials');
    }

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

    public function image()
    {
        return $this->getFirstMedia($this->getTable());
    }

    public function getImageAttribute(): ?Media
    {
        return $this->image();
    }

    public function toApi(): array
    {
        $data = $this->toArray();
        $data['level_name'] = $this->level?->designation;
        $data['coach_name'] = $this->coach?->designation;
        $data['category_name'] = $this->category?->designation;
        $data['cover'] = $this->getImageCoverAttribute();

        $data['materiel_list'] = $this->materials->map(fn($item) => $item->designation)->join(', ');

        return $data;
    }

    public function getImageCoverAttribute(): ?string
    {

        if ($this->cover) {
            return $this->cover;
        } else {
            if ($this->url) {
                return str_replace('.mp4', '.jpeg', $this->url);
            }
        }

        return null;

    }
}
