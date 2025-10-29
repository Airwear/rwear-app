<div class="col-md-6 col-12">
    {{--@include("$baseView.partials.cards.image")--}}

    @if($model->image_cover)
        <img style="" src="{{ $model->image_cover }}" alt="{{ $model->designation }}" class="img-thumbnail mb-2">
    @endif
    <div class="card bg-white p-2">

        <x-form.group>
            <x-label for="designation">
                {{ trans('labels.designation') }}
            </x-label>
            <x-input.text
                name="designation"
                type="text"
                :value="$model->designation"
            />
        </x-form.group>

        @include('partials.forms.textarea', [
            'name' => 'description',
            'label' => 'Description',
            'value' => $model->description,
        ])

        <x-form.group>
            <x-label for="category_id">
                Catégorie
            </x-label>
            <x-input.select
                id="category_id"
                name="category_id"
                :options="$categories"
                :value="$model->category_id"
            />
        </x-form.group>

        <x-form.group>
            <x-label for="level_id">
                Niveau
            </x-label>
            <x-input.select
                id="level_id"
                name="level_id"
                :options="$levels"
                :value="$model->level_id"
            />
        </x-form.group>

        @include('partials.forms.text', [
            'name' => 'url',
            'label' => 'URL de la vidéo',
            'value' => $model->url,
        ])

        @if($model->url)
            <video width="620" height="340" controls>
                <source src="{{ $model->url }}" type="video/mp4">
                Votre navigateur ne supporte pas la balise vidéo.
            </video>
            <br />
        @endif

        {{--@include('partials.forms.text', [
            'name' => 'cover',
            'label' => 'Photo de couverture',
            'value' => $model->cover,
        ])--}}

        <div class="row">
            <div class="col-md-6 col-12">
                @include('partials.forms.text', [
                    'name' => 'duration_in_minute',
                    'label' => 'Durée en minutes',
                    'type' => 'number',
                    'value' => $model->duration_in_minute,
                ])
            </div>
            <div class="col-md-6 col-12">
                @include('partials.forms.text', [
                    'name' => 'duration_in_text',
                    'label' => 'Durée affichée',
                    'value' => $model->duration_in_text,
                ])
            </div>
        </div>

        <x-form.group>
            <x-label for="coach_id">
                Réalisée par
            </x-label>
            <x-input.select
                id="coach_id"
                name="coach_id"
                :options="$coaches"
                :value="$model->coach_id"
            />
        </x-form.group>

        <div class="row">
            <div class="col-md-6 col-12">
                @include('partials.forms.text', [
                    'name' => 'register_date',
                    'label' => 'Date de création',
                    'type' => 'date',
                    'value' => $model->register_date?->format('Y-m-d'),
                ])
            </div>
            <div class="col-md-6 col-12">
                @include('partials.forms.text', [
                    'name' => 'publish_date',
                    'label' => 'Date mise en ligne',
                    'type' => 'date',
                    'value' => $model->publish_date?->format('Y-m-d'),
                ])
            </div>
        </div>
    </div>
</div>

<div class="col-md-6 col-12">
    <div class="card bg-white p-2">
        <div class="form-group">
            {!! Form::label('material_id', 'Matériels') !!}
            {!! Form::select('material_id[]', $materials ?? [], $model?->materials->pluck('id'), [
                'class' => 'form-group custom-select select2',
                'id' => 'material_id',
                'multiple' => true,
            ]) !!}
        </div>
    </div>
</div>



