<?php

namespace App\DataTransformers;

use App\Contracts\TransformerContract;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class ArticleTransformer implements TransformerContract
{
    public function transform(Article $model): array
    {
        return [
            'id' => $model->getKey(),
            'name' => $model->designation,
            'color' => $model->color ?? '',
        ];
    }

    public function toCollection(Collection $collection): array
    {
        return $collection->map(fn(Category $model) => $this->transform($model))->toArray();
    }

    public function fakers(): array
    {
        $data = [
            [
                'image' => "https://png.pngtree.com/png-clipart/20230113/ourmid/pngtree-red-fresh-tomato-with-green-leaf-png-image_6561484.png",
                'designation' => "Tomate de Cotonou",
                'unit_name' => "10 ml",
                'price' => 2.5,
                'promotional' => true,
            ],

            [
                'image' => "https://cdn-s-www.leprogres.fr/images/4F9ADCF4-7D05-469B-BE3F-53B93CD5C0C3/NW_detail/capture-d-ecran-rappel-conso-1701684634.jpg",
                'designation' => "Riz Basmati",
                'unit_name' => "100 g",
                'price' => 5,
                'promotional' => true,
            ],

            [
                'image' => "https://www.academiedugout.fr/images/7525/1200-auto/piment-antillais-copy.jpg?poix=50&poiy=50",
                'designation' => "Piment de Accra",
                'unit_name' => "100 ml",
                'price' => 4.5,
                'promotional' => true,
            ],

            [
                'image' => "https://konu-shop.com/cdn/shop/products/original-39_554x554.jpg?v=1618829223",
                'designation' => "Batton de manioc",
                'unit_name' => "4 unité",
                'price' => 2.5,
                'is_flash' => true,
            ],

            [
                'image' => "https://epiceries-staffsas.com/cdn/shop/products/Ndoleboules.jpg?v=1676027142",
                'designation' => "Boule de dolet",
                'unit_name' => "200 ml",
                'price' => 7,
                'best_seller' => true,
            ],

            [
                'image' => "https://panierexpress.fr/5306-large_default/epicerie-salee-pate-darachide-etoile-dafrique-1kg.jpg",
                'designation' => "Patte d'arachide",
                'unit_name' => "10 ml",
                'price' => 6,
                'best_seller' => true,
            ],

            [
                'image' => "https://www.racines-shop.com/Files/130808/Img/21/0-HPVIL2x1200.jpg",
                'designation' => "Huile rouge",
                'unit_name' => "10 ml",
                'price' => 3.20,
                'promotional' => true,
            ],

            [
                'image' => "https://media.carrefour.fr/medias/69a076e057003469b405eea5f7259e0d/p_1500x1500/3000001023050-photosite-20150617-162720-0.jpg",
                'designation' => "Noix de coco",
                'unit_name' => "10 ml",
                'price' => 2.20,
                'best_seller' => true,
            ],

            [
                'image' => "https://media.cdnws.com/_i/23958/36463/2529/67/huile-noix-de-coco-bio.jpeg",
                'designation' => "Huile de coco",
                'unit_name' => "10 ml",
                'price' => 10,
                'best_seller' => true,
            ],

            [
                'image' => "https://www.organicfacts.net/wp-content/uploads/2013/06/manioccassava.jpg",
                'designation' => "Tubercule de manioc",
                'unit_name' => "10 ml",
                'price' => 7,
                'promotional' => true,
            ],

            [
                'image' => "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj6yD_KG9MQ0zEqQWMjrZumCJlsK76zlCdGuHFmMqfRtgT6bkGEtvSlErn1MtJXGv561Q&usqp=CAU",
                'designation' => "Poisson fumé",
                'unit_name' => "10 ml",
                'price' => 12,
                'promotional' => true,
            ],

            [
                'image' => "https://panierexpress.fr/659-home_default/fruits-et-legumes-gombo-frais-300g.jpg",
                'designation' => "Gombo frais 300g",
                'unit_name' => "10 ml",
                'price' => 4,
                'promotional' => true,
            ],

            [
                'image' => "https://www.agidra.com/images/vignettes/132585_T1.jpg",
                'designation' => "Haricot rouge 1Kg",
                'price' => 5,
                'best_seller' => true,
            ],

            [
                'image' => "https://www.academiedugout.fr/images/16365/1200-auto/fotolia_55292183_subscription_xl-copy.jpg?poix=50&poiy=50",
                'designation' => "Pomme de terre",
                'price' => 2.45,
                'best_seller' => true,
            ],
        ];

        return collect($data)->map(function ($item) {
            $item['slug'] = Str::slug($item['designation']);
            $item['description'] = "Description for article: {$item['designation']}";
            $item['shop_name'] = config('app.name');
            $item['shop_url'] = config('app.url');
            $item['available'] = true;

            return $item;
        })->toArray();
    }

}
