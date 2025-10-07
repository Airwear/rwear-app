<?php

namespace App\View\Components\Articles;

use App\Models\Article;
use App\Models\Category;
use App\Models\Tag;
use App\Models\Unit;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\View\Component;

class EditForm extends Component
{
    /**
     * @param Article $article
     */
    public function __construct(public readonly Article $article)
    {
        //
    }

    private function categories(): Collection
    {
        return Category::query()
            ->pluck('designation', 'id')
            ->prepend('', null)
        ;
    }

    private function units(): Collection
    {
        return Unit::query()
            ->pluck('designation', 'id')
            ->prepend('', null)
        ;
    }

    private function articlesQuery(): Builder
    {
        return Article::query();
    }

    private function tags(): \Illuminate\Database\Eloquent\Collection|array
    {
        return \Spatie\Tags\Tag::query()->orderBy('name')->get();
    }

    /**
     * @return \Closure|\Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Support\Htmlable|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View|string
     */
    public function render()
    {
        return view('articles.components.edit-form', [
            'categories' => $this->categories(),
            'units' => $this->units(),
            'tags' => $this->tags(),
            'items' => $this
                ->articlesQuery()
                ->where('id', '!=', $this->article->getKey())
                ->pluck('designation', 'id')
                //->prepend('', null)
            ,
        ]);
    }
}
