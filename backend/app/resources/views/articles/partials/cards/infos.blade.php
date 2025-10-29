<div class="bg-white px-2 py-4">

    <div class="form-group">
        {!! Form::label('category_id', 'Catégorie de l\'article') !!}
        {!! Form::select('category_id', $categories ?? [], $article->category_id, [
            'class' => 'form-group custom-select'
        ]) !!}
    </div>

    @include('partials.forms.text', [
        'name' => 'designation',
        'label' => 'Désignation',
        'value' => $article->designation,
        'required' => true,
    ])

    <div class="row">
        <div class="col-12 col-md-6">
            @include('partials.forms.text', [
                'name' => 'price',
                'label' => 'Prix de l\'article',
                'value' => $article->price,
            ])
        </div>
        <div class="col-12 col-md-6">
            @include('partials.forms.text', [
                'name' => 'promotion_price',
                'label' => 'Prix promotionnel',
                'value' => $article->promotion_price,
            ])
        </div>
    </div>

    @include('partials.forms.text', [
        'type' => 'date',
        'name' => 'flashed_until_date',
        'label' => 'Vente flash jusqu\'au',
        'value' => $article->flashed_until_date?->format('Y-m-d'),
        'text' => "Si c'est un prix PROMO, précisez la date de fin du prix",
    ])


    {!! Form::label('unit_id', 'Unité de vente') !!}
    <div class="input-group">
        <input
            type="text"
            name="quantity"
            class="form-control"
            placeholder="Quantité"
            value="{{ $article->quantity }}"
        >
        {!! Form::select('unit_id', $units ?? [], $article->unit_id, [
            'class' => 'form-group custom-select'
        ]) !!}
    </div>

    <div class="row">
        <div class="col-md-6 col-12">
            @include('partials.forms.checkbox', [
                'name' => 'is_available',
                'label' => 'Produit disponible',
                'checked' => $article->is_available,
            ])
        </div>
        <div class="col-md-6 col-12">
            @include('partials.forms.checkbox', [
                'name' => 'is_fresh',
                'label' => 'Produit frais',
                'checked' => $article->is_fresh,
            ])
        </div>
    </div>

    <hr />

    @include('partials.forms.text', [
        'name' => 'brand',
        'label' => 'Marque de l\'article (wip)',
        'value' => $article->brand,
    ])
</div>
