<?php

namespace App\Models;

use App\Models\Traits\SlugTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Group extends Model
{
    use SlugTrait;

    protected $guarded = ['id'];

    public function users(): HasMany
    {
        return $this
            ->hasMany(User::class)
            ->where('is_super_admin', false)
        ;
    }

    public function adminInfos(): array
    {
        return [
            [
                'name' => 'Raison sociale',
                'value' => $this->social_reason,
            ],

            [
                'name' => 'Siret',
                'value' => $this->siret,
            ],

            [
                'name' => 'Localisation',
                'value' => $this->address.' '.$this->zip_code.' '.$this->city,
            ],

            [
                'name' => 'En ligne le',
                'value' => $this->created_at?->format('d/m/Y'),
            ],
        ];
    }

    public function featureInfos(): array
    {
        return [
            [
                'name' => 'Paiement en ligne',
                'value' => $this->accept_payment_on_line ? 'Oui' : 'Non',
                'fa_class' => 'credit-card',
            ],

            [
                'name' => 'Clique En Collect',
                'value' => $this->accept_click_on_collect ? 'Oui' : 'Non',
                'fa_class' => 'box',
            ],

        ];
    }
}
