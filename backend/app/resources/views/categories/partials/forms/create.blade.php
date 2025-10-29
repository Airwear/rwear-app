<x-form.group>
    <x-label for="designation--{{ $model->id }}">
        {{ trans('labels.designation') }}
    </x-label>
    <x-input.text
        id="designation--{{ $model->id }}"
        name="designation"
        type="text"
        placeholder="Ex: Yoga"
        :value="$model->designation"
        x-model="designation"
    />
</x-form.group>

<x-form.group>
    <x-label for="code--{{ $model->id }}">
        {{ trans('labels.code') }}
        <small class="d-block">nom du fichier avec extension</small>
    </x-label>
    <x-input.text
        id="code--{{ $model->id }}"
        name="code"
        placeholder="Ex: fichier-yoga"
        type="text"
        :value="$model->code"
        x-model="code"
    />
</x-form.group>

<x-form.group>
    <x-label for="name">
        {{ trans('labels.color') }}
    </x-label>
    <x-input.text
        name="name"
        type="color"
        :value="$model->color"
        x-model="color"
    />
</x-form.group>

<x-form.group>
    <x-label for="order--{{ $model->id }}">
        {{ trans('labels.order') }}
    </x-label>
    <x-input.text
        id="order--{{ $model->id }}"
        name="order"
        type="number"
        :value="$model->order"
        x-model="order"
        min="0"
        step="1"
    />
</x-form.group>

<x-form.group class="custom-control custom-switch">
    <x-input.checkbox
        name="active"
        id="active--{{ $model->id }}"
        class="custom-control-input"
        :value="$model->active"
        x-model="active"
    />
    <x-label for="active--{{ $model->id }}" class="custom-control-label font-weight-light">
        {{ trans('labels.active') }}
    </x-label>
</x-form.group>

@if($model->exists && $model->cover)
    <div class="text-center">
        <img width="200" src="{{ $model->cover }}" alt="{{ $model->designation }}" class="img-thumbnail">
    </div>
@endif
