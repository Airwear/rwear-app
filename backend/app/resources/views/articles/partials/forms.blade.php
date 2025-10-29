<div class="bg-white p-2">
    @include('partials.forms.textarea', [
        'name' => 'description',
        'label' => 'Description de l\'article',
        'value' => $article->description,
    ])

    <div class="form-group">
        {!! Form::label('item_id[]', 'Articles additionnels ou complémentaires') !!}
        {!! Form::select('item_id[]', $items ?? [], $article->additionnals?->pluck('id'), [
            'class' => 'form-group select2 w-100',
            'multiple' => true,
        ]) !!}

        <div class="text-muted">
            <p class="m-0">Les articles complémentaires sont des articles qui peuvent être vendus en accompagnement</p>
            <p class="m-0">Les articles additionnels apparaîtront sur la fiche de l'article <b>{{ $article->designation }}</b></p>
        </div>
    </div>

    <br/>

    <div class="form-group d-none">
        {!! Form::label('tag_id[]', 'Etiquettes (mot clés)') !!}
        {!! Form::select('tag_id[]', $tags->pluck('name', 'name') ?? [], $article->tags->pluck('name'), [
            'class' => 'form-group w-100',
            'multiple' => true,
            'id' => 'tag',
        ]) !!}
        <div class="text-muted">
            <p class="m-0">Les étiquettes permettront à vos clients de retrouver cet article rapidement en utilisant des mots clés</p>
        </div>
    </div>
</div>

@push('scripts')
    <script>
        $("#tag").select2({
            tags: true
        });
    </script>
@endpush


