<div>
    {!! Form::open([
        'url' => route('articles.update', $article),
        'method' => 'POST',
        'files' => true,
    ]) !!}

    <div class="row">
        <div class="col-md-4 col-12">
            @include('articles.partials.cards.image')
            <br />
            @include('articles.partials.cards.infos')
        </div>
        <div class="col-md-8 col-12">
            @include('articles.partials.forms')
        </div>
    </div>

    @include('partials.forms.btn-submit')

    {!! Form::close() !!}
</div>
