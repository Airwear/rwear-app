<?php

namespace App\Services\Articles;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class UpdateService
{
    public function handle(Article $article, Request $request): void
    {
        DB::transaction(function () use ($article, $request) {

            $article->update($request->validated());

            $article->additionnals()->sync($request->input('item_id', []));

            $this->updateMedias($article, $request);

            $this->syncTags($article, $request);

        });
    }

    /**
     * @param Article $article
     * @param Request $request
     * @return void
     */
    protected function syncTags(Article $article, Request $request): void
    {
        $article->syncTags($request->post('tag_id', []));
    }

    public function updateMedias(Article $article, Request $request): void
    {
        $uploadedFile = $request->file('file');
        if ($uploadedFile && $uploadedFile->isValid()) {
            $article
                ->addMediaFromRequest("file")
                ->toMediaCollection($article->getTable(), $article->getTable());
        }
    }
}
