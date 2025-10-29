<x-form.group>
    <x-label for="name">
        {{ trans('labels.designation') }}
    </x-label>
    <x-input.text
        name="name"
        type="text"
        :value="$model->designation"
        x-model="designation"
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
